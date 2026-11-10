import { describe, expect, it } from "vitest";
import { apiError, apiSuccess } from "@/lib/api-response";

describe("api-response standardizer", () => {
  it("formats standard REST success response with HTTP 200", async () => {
    const res = apiSuccess({ id: "prod-1", title: "Aso Oke Coat" }, { total: 1 }, 200);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.data.title).toBe("Aso Oke Coat");
    expect(json.meta?.total).toBe(1);
  });

  it("formats standard REST error response with given status code", async () => {
    const res = apiError("Product not found", 404, "NOT_FOUND");
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toBe("Product not found");
    expect(json.code).toBe("NOT_FOUND");
  });
});

