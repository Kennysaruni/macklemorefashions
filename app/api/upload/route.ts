import { NextRequest, NextResponse } from "next/server";
import { listS3Objects, putS3Object } from "@/lib/s3-storage";

export async function GET(request: NextRequest) {
  try {
    const prefix = request.nextUrl.searchParams.get("prefix") || "";
    const bucket = request.nextUrl.searchParams.get("bucket") || "uploads";
    const objects = await listS3Objects({ bucket, prefix });

    return NextResponse.json({
      ok: true,
      bucket,
      count: objects.length,
      totalBytes: objects.reduce((sum, o) => sum + o.size, 0),
      objects: objects.map((obj) => ({
        ...obj,
        url: `/api/storage/${bucket}/${obj.key}`,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to list Neon S3 objects",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "products";
      const bucket = (formData.get("bucket") as string) || "uploads";

      if (!file) {
        return NextResponse.json(
          { ok: false, error: "No file provided" },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const safeName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, "-")
        .replace(/^-|-$/g, "");
      const key = `${folder}/${Date.now()}-${safeName}`;

      const uploaded = await putS3Object({
        bucket,
        key,
        body: buffer,
        contentType: file.type || "image/jpeg",
      });

      return NextResponse.json({
        ok: true,
        bucket,
        key: uploaded.key,
        url: uploaded.storageUrl,
        size: uploaded.size,
      });
    }

    // Remote URL ingestion into Neon S3 bucket
    const body = await request.json();
    const {
      sourceUrl,
      folder = "products",
      customKey,
      bucket = "uploads",
    }: {
      sourceUrl?: string;
      folder?: string;
      customKey?: string;
      bucket?: string;
    } = body;

    if (!sourceUrl) {
      return NextResponse.json(
        { ok: false, error: "Missing sourceUrl or multipart file" },
        { status: 400 }
      );
    }

    const remoteRes = await fetch(sourceUrl);
    if (!remoteRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `Failed to fetch remote image (${remoteRes.status})`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await remoteRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = remoteRes.headers.get("content-type") || "image/jpeg";
    const parsedUrl = new URL(sourceUrl);
    const basename =
      parsedUrl.pathname.split("/").pop()?.replace(/[^a-zA-Z0-9._-]+/g, "-") ||
      `asset-${Date.now()}.jpg`;
    const key = customKey || `${folder}/${basename}`;

    const uploaded = await putS3Object({
      bucket,
      key,
      body: buffer,
      contentType: mimeType,
    });

    return NextResponse.json({
      ok: true,
      bucket,
      key: uploaded.key,
      url: uploaded.storageUrl,
      size: uploaded.size,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Neon S3 upload failed",
      },
      { status: 500 }
    );
  }
}

