import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST as authPost, DELETE as authDelete } from "@/app/api/admin/auth/route";

describe("Admin Authentication Endpoint", () => {
  it("authenticates successfully with valid admin credentials", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@macklemorefashions.com",
        password: "Macklemore2026#",
      }),
    });

    const res = await authPost(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.user?.email).toBe("admin@macklemorefashions.com");
  });

  it("rejects invalid password", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@macklemorefashions.com",
        password: "WrongPassword!",
      }),
    });

    const res = await authPost(req);
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.ok).toBe(false);
  });

  it("handles DELETE logout successfully", async () => {
    const res = await authDelete();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });
});

