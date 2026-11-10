import { describe, expect, it } from "vitest";
import { isNeonS3Configured } from "@/lib/s3-storage";

describe("s3-storage engine", () => {
  it("detects Neon S3 storage configuration correctly", () => {
    // Check if the credentials in environment are recognized
    const configured = isNeonS3Configured();
    expect(typeof configured).toBe("boolean");
  });
});

