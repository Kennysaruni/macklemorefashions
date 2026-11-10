import crypto from "crypto";

export interface S3ObjectSummary {
  key: string;
  size: number;
  lastModified: string;
  etag: string;
}

function getS3Config() {
  const endpoint = (
    process.env.AWS_ENDPOINT_URL_S3 ||
    "https://br-soft-waterfall-bdp6q20e.s3.us-east-2.neon.storage"
  ).replace(/\/+$/, "");
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
  const region = process.env.AWS_REGION || "us-east-2";

  return {
    endpoint,
    accessKeyId,
    secretAccessKey,
    region,
    isConfigured: Boolean(endpoint && accessKeyId && secretAccessKey),
  };
}

function hmacSha256(key: Buffer | string, data: string): Buffer {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}

function sha256Hex(data: Buffer | string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function encodeS3Path(pathStr: string): string {
  return pathStr
    .split("/")
    .map((segment) =>
      encodeURIComponent(segment).replace(
        /[!'()*]/g,
        (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
      )
    )
    .join("/");
}

function signS3Request({
  method,
  bucket,
  key,
  query = {},
  headers = {},
  payloadHash = "UNSIGNED-PAYLOAD",
}: {
  method: "GET" | "PUT" | "DELETE" | "HEAD";
  bucket: string;
  key?: string;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  payloadHash?: string;
}) {
  const { endpoint, accessKeyId, secretAccessKey, region } = getS3Config();
  const endpointUrl = new URL(endpoint);
  const host = endpointUrl.host;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);

  const rawPath = key ? `/${bucket}/${key.replace(/^\/+/, "")}` : `/${bucket}`;
  const canonicalUri = encodeS3Path(rawPath);

  const sortedQueryKeys = Object.keys(query).sort();
  const canonicalQueryString = sortedQueryKeys
    .map(
      (k) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(query[k]).replace(
          /[!'()*]/g,
          (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
        )}`
    )
    .join("&");

  const allHeaders: Record<string, string> = {
    host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };

  for (const [hk, hv] of Object.entries(headers)) {
    allHeaders[hk.toLowerCase()] = hv.trim();
  }

  const sortedHeaderKeys = Object.keys(allHeaders).sort();
  const canonicalHeaders = sortedHeaderKeys
    .map((k) => `${k}:${allHeaders[k]}\n`)
    .join("");
  const signedHeaders = sortedHeaderKeys.join(";");

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const kDate = hmacSha256(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = hmacSha256(kDate, region);
  const kService = hmacSha256(kRegion, "s3");
  const kSigning = hmacSha256(kService, "aws4_request");
  const signature = hmacSha256(kSigning, stringToSign).toString("hex");

  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const requestUrl = `${endpointUrl.origin}${canonicalUri}${
    canonicalQueryString ? `?${canonicalQueryString}` : ""
  }`;

  const finalHeaders: Record<string, string> = {
    ...headers,
    "x-amz-date": amzDate,
    "x-amz-content-sha256": payloadHash,
    Authorization: authorization,
  };

  return { requestUrl, headers: finalHeaders };
}

export async function putS3Object({
  bucket = "uploads",
  key,
  body,
  contentType = "application/octet-stream",
}: {
  bucket?: string;
  key: string;
  body: Buffer | string;
  contentType?: string;
}): Promise<{ ok: boolean; key: string; storageUrl: string; size: number }> {
  const buf = typeof body === "string" ? Buffer.from(body, "utf8") : body;
  const payloadHash = sha256Hex(buf);

  const { requestUrl, headers } = signS3Request({
    method: "PUT",
    bucket,
    key,
    headers: {
      "content-type": contentType,
      "content-length": String(buf.byteLength),
    },
    payloadHash,
  });

  const res = await fetch(requestUrl, {
    method: "PUT",
    headers,
    body: new Uint8Array(buf),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(
      `Neon S3 PUT failed (${res.status}) for ${bucket}/${key}: ${errText}`
    );
  }

  return {
    ok: true,
    key,
    storageUrl: `/api/storage/${bucket}/${key.replace(/^\/+/, "")}`,
    size: buf.byteLength,
  };
}

export async function getS3Object({
  bucket = "uploads",
  key,
}: {
  bucket?: string;
  key: string;
}): Promise<{ buffer: Buffer; contentType: string; etag?: string } | null> {
  const emptyHash = sha256Hex("");
  const { requestUrl, headers } = signS3Request({
    method: "GET",
    bucket,
    key,
    payloadHash: emptyHash,
  });

  const res = await fetch(requestUrl, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Neon S3 GET failed (${res.status}) for ${bucket}/${key}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    contentType: res.headers.get("content-type") || "application/octet-stream",
    etag: res.headers.get("etag") || undefined,
  };
}

export async function listS3Objects({
  bucket = "uploads",
  prefix = "",
}: {
  bucket?: string;
  prefix?: string;
} = {}): Promise<S3ObjectSummary[]> {
  const emptyHash = sha256Hex("");
  const query: Record<string, string> = { "list-type": "2" };
  if (prefix) query.prefix = prefix;

  const { requestUrl, headers } = signS3Request({
    method: "GET",
    bucket,
    query,
    payloadHash: emptyHash,
  });

  const res = await fetch(requestUrl, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const xml = await res.text();
  const items: S3ObjectSummary[] = [];
  const contentsRegex = /<Contents>([\s\S]*?)<\/Contents>/g;
  let match: RegExpExecArray | null;
  while ((match = contentsRegex.exec(xml)) !== null) {
    const block = match[1];
    const keyMatch = block.match(/<Key>([\s\S]*?)<\/Key>/);
    const sizeMatch = block.match(/<Size>(\d+)<\/Size>/);
    const modMatch = block.match(/<LastModified>([\s\S]*?)<\/LastModified>/);
    const etagMatch = block.match(/<ETag>([\s\S]*?)<\/ETag>/);
    if (keyMatch) {
      items.push({
        key: keyMatch[1],
        size: sizeMatch ? parseInt(sizeMatch[1], 10) : 0,
        lastModified: modMatch ? modMatch[1] : "",
        etag: etagMatch ? etagMatch[1].replace(/&quot;|"/g, "") : "",
      });
    }
  }
  return items;
}

export function isNeonS3Configured(): boolean {
  return getS3Config().isConfigured;
}

