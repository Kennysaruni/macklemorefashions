import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET as getOrders } from "@/app/api/orders/route";
import { GET as getB2BInquiries } from "@/app/api/b2b-inquiries/route";
import { POST as orchestrateCheckout } from "@/app/api/checkout/orchestrate/route";
import { POST as createCollection } from "@/app/api/collections/route";
import { DELETE as deleteBrand } from "@/app/api/brands/[id]/route";

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

  it("POST /api/checkout/orchestrate handles Paystack checkout payload", async () => {
    const req = new NextRequest("http://localhost:3000/api/checkout/orchestrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinationCountryIso: "NG",
        destinationCountryName: "Nigeria",
        destinationCity: "Lagos",
        shippingAddress: "14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
        currency: "NGN",
        subtotalAmount: 150000,
        paymentProvider: "PAYSTACK",
        paystackChannel: "CARD",
        customerName: "Amara Eze",
        customerEmail: "amara@couture.luxury",
        customerPhone: "+234 809 111 2222",
        items: [
          {
            productId: "prod-demo-1",
            productTitle: "Aso-Oke Royal Dashiki",
            brandName: "Macklemore Fashion",
            size: "L",
            quantity: 1,
            unitPrice: 150000,
          },
        ],
      }),
    });

    const res = await orchestrateCheckout(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.provider).toBe("PAYSTACK");
    expect(json.assignedHub).toBe("HUB_A_LAGOS");
    expect(json.waybillNumber).toBeDefined();
    expect(json.reference).toMatch(/^PSK_/);
  });

  it("POST /api/checkout/orchestrate handles Stripe checkout payload", async () => {
    const req = new NextRequest("http://localhost:3000/api/checkout/orchestrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinationCountryIso: "CA",
        destinationCountryName: "Canada",
        destinationCity: "Toronto",
        shippingAddress: "100 King St West, Suite 400, Toronto, Ontario, Canada",
        currency: "CAD",
        subtotalAmount: 380,
        paymentProvider: "STRIPE",
        customerName: "Julian Vance",
        customerEmail: "julian.vance@luxury.ca",
        customerPhone: "+1 416 555 0199",
        items: [
          {
            productId: "prod-demo-2",
            productTitle: "Embroidered Silk Kaftan",
            brandName: "Macklemore Fashion",
            size: "M",
            quantity: 1,
            unitPrice: 380,
          },
        ],
      }),
    });

    const res = await orchestrateCheckout(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.provider).toBe("STRIPE");
    expect(json.assignedHub).toBe("HUB_B_TORONTO");
    expect(json.waybillNumber).toBeDefined();
    expect(json.paymentIntentId).toMatch(/^pi_/);
  });

  it("POST /api/collections publishes a new drop capsule", async () => {
    const req = new NextRequest("http://localhost:3000/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Harmattan Royal Gala 2026",
        seasonCode: "AW26",
        manifesto: "Artisanal Yoruba weaving and bespoke tailoring.",
        brandId: "brand-macklemore",
        brandName: "Macklemore Fashion",
        releaseDate: new Date().toISOString(),
        isDropLive: true,
        isVipLocked: false,
      }),
    });

    const res = await createCollection(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.data.title).toBe("Harmattan Royal Gala 2026");
    expect(json.data.seasonCode).toBe("AW26");
  });

  it("DELETE /api/brands/[id] deletes a partner house", async () => {
    const req = new NextRequest("http://localhost:3000/api/brands/brand-test-del", {
      method: "DELETE",
    });

    const res = await deleteBrand(req, {
      params: Promise.resolve({ id: "brand-test-del" }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.data.deletedId).toBe("brand-test-del");
  });
});

