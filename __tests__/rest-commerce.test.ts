import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET as getOrders } from "@/app/api/orders/route";
import { GET as getB2BInquiries } from "@/app/api/b2b-inquiries/route";

describe("RESTful Commerce & B2B Handlers", () => {
  it("GET /api/orders returns orders array with meta count", async () => {
    const req = new NextRequest("http://localhost:3000/api/orders?limit=10");
    const res = await getOrders(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
    expect(json.meta?.total).toBeGreaterThan(0);
  });

  it("GET /api/orders filters by gateway (STRIPE or PAYSTACK)", async () => {
    const req = new NextRequest("http://localhost:3000/api/orders?gateway=PAYSTACK");
    const res = await getOrders(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    for (const ord of json.data) {
      expect(ord.paymentProvider).toBe("PAYSTACK");
    }
  });

  it("GET /api/b2b-inquiries returns inquiry dossiers", async () => {
    const req = new NextRequest("http://localhost:3000/api/b2b-inquiries");
    const res = await getB2BInquiries(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
  });
});

