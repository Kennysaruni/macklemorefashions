import { NextRequest, NextResponse } from "next/server";
import { getS3Object } from "@/lib/s3-storage";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    if (!path || path.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Invalid storage path" },
        { status: 400 }
      );
    }

    const [bucket, ...rest] = path;
    const key = rest.join("/");

    const obj = await getS3Object({ bucket, key });
    if (!obj) {
      return NextResponse.json(
        { ok: false, error: "Object not found in Neon S3 bucket" },
        { status: 404 }
      );
    }

    return new NextResponse(new Uint8Array(obj.buffer), {
      status: 200,
      headers: {
        "Content-Type": obj.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        ...(obj.etag ? { ETag: obj.etag } : {}),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to read from Neon S3 bucket",
      },
      { status: 500 }
    );
  }
}

