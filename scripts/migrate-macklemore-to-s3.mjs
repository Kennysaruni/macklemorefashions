import fs from "fs";
import path from "path";
import crypto from "crypto";

// Load .env manually
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

const endpoint = (
  process.env.AWS_ENDPOINT_URL_S3 ||
  "https://br-soft-waterfall-bdp6q20e.s3.us-east-2.neon.storage"
).replace(/\/+$/, "");
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
const region = process.env.AWS_REGION || "us-east-2";

function hmacSha256(key, data) {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}

function sha256Hex(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function encodeS3Path(pathStr) {
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

async function putToNeonS3({ bucket = "uploads", key, buffer, contentType }) {
  const endpointUrl = new URL(endpoint);
  const host = endpointUrl.host;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);

  const rawPath = `/${bucket}/${key.replace(/^\/+/, "")}`;
  const canonicalUri = encodeS3Path(rawPath);
  const payloadHash = sha256Hex(buffer);

  const allHeaders = {
    "content-length": String(buffer.byteLength),
    "content-type": contentType,
    host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };

  const sortedKeys = Object.keys(allHeaders).sort();
  const canonicalHeaders = sortedKeys
    .map((k) => `${k}:${allHeaders[k]}\n`)
    .join("");
  const signedHeaders = sortedKeys.join(";");

  const canonicalRequest = [
    "PUT",
    canonicalUri,
    "",
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

  const res = await fetch(`${endpointUrl.origin}${canonicalUri}`, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(buffer.byteLength),
      "x-amz-date": amzDate,
      "x-amz-content-sha256": payloadHash,
      Authorization: authorization,
    },
    body: new Uint8Array(buffer),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Failed S3 PUT ${key}: ${res.status} ${errText}`);
  }
  return `/api/storage/${bucket}/${key.replace(/^\/+/, "")}`;
}

// Collect all unique remote URLs referenced in lib/store-data.ts and app/page.tsx
const storeDataContent = fs.readFileSync(
  path.resolve(process.cwd(), "lib/store-data.ts"),
  "utf8"
);
const homePageContent = fs.readFileSync(
  path.resolve(process.cwd(), "app/page.tsx"),
  "utf8"
);

const urlRegex = /https:\/\/(?:macklemorefashions\.com\/wp-content\/uploads\/[^\s"']+|images\.unsplash\.com\/[^\s"']+)/g;
const allUrls = Array.from(
  new Set([
    ...(storeDataContent.match(urlRegex) || []),
    ...(homePageContent.match(urlRegex) || []),
  ])
);

console.log(`Found ${allUrls.length} unique Macklemore Fashion & partner image URLs to migrate to Neon S3 bucket "uploads"...`);

function urlToS3Key(rawUrl) {
  const u = new URL(rawUrl);
  if (u.hostname.includes("macklemorefashions.com")) {
    // e.g. /wp-content/uploads/2025/04/7.jpg -> macklemore/2025/04/7.jpg
    const rel = u.pathname.replace(/^\/wp-content\/uploads\//, "");
    return `macklemore/${rel}`;
  }
  // Unsplash partner image -> partner/<id>.jpg
  const photoId = u.pathname.replace(/^\//, "").replace(/[^a-zA-Z0-9._-]+/g, "-");
  return `partner/${photoId}.jpg`;
}

async function runMigration() {
  const urlMapping = {};
  let migratedCount = 0;

  for (const sourceUrl of allUrls) {
    const key = urlToS3Key(sourceUrl);
    try {
      const resp = await fetch(sourceUrl);
      if (!resp.ok) {
        console.warn(`⚠️ Skipping ${sourceUrl} (HTTP ${resp.status})`);
        continue;
      }
      const arr = await resp.arrayBuffer();
      const buffer = Buffer.from(arr);
      const contentType = resp.headers.get("content-type") || "image/jpeg";

      const localStorageUrl = await putToNeonS3({
        bucket: "uploads",
        key,
        buffer,
        contentType,
      });

      urlMapping[sourceUrl] = {
        s3Key: key,
        storageUrl: localStorageUrl,
        bytes: buffer.byteLength,
        contentType,
      };
      migratedCount++;
      console.log(
        `[${migratedCount}/${allUrls.length}] ✓ Uploaded ${key} (${(
          buffer.byteLength / 1024
        ).toFixed(1)} KB)`
      );
    } catch (err) {
      console.error(`✗ Error migrating ${sourceUrl}:`, err.message);
    }
  }

  // Save the URL mapping & full catalog metadata snapshot to Neon S3 bucket as well
  const manifestPayload = {
    migratedAt: new Date().toISOString(),
    bucket: "uploads",
    totalImagesMigrated: migratedCount,
    urlMapping,
  };

  await putToNeonS3({
    bucket: "uploads",
    key: "catalog/s3-image-manifest.json",
    buffer: Buffer.from(JSON.stringify(manifestPayload, null, 2), "utf8"),
    contentType: "application/json",
  });

  fs.writeFileSync(
    path.resolve(process.cwd(), "lib/s3-image-manifest.json"),
    JSON.stringify(manifestPayload, null, 2)
  );

  console.log(
    `\n✅ Completed migrating ${migratedCount}/${allUrls.length} images to Neon S3 bucket "uploads" and wrote lib/s3-image-manifest.json!`
  );
}

runMigration().catch((err) => {
  console.error(err);
  process.exit(1);
});

