import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  buildOrderReceiptHtml,
  sendOrderConfirmationEmail,
  OrderEmailPayload,
} from "@/lib/email-service";

const samplePayload: OrderEmailPayload = {
  orderNumber: "MKM-2026-9045",
  customerName: "Tunde Bakare",
  customerEmail: "tunde.bakare@couture.luxury",
  customerPhone: "+234 809 442 1900",
  shippingAddress: "14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
  destinationCity: "Lagos",
  destinationCountry: "Nigeria",
  currency: "NGN",
  subtotalAmount: 185000,
  shippingAmount: 0,
  dutiesAmount: 0,
  totalAmount: 185000,
  assignedHub: "HUB_A_LAGOS",
  courierPartner: "GIG Logistics Express",
  waybillNumber: "GIG-NG-884210",
  paymentProvider: "PAYSTACK",
  paymentReference: "PSK_MKM_1700000000",
  estimatedTransitDays: "1-2 Business Days",
  items: [
    {
      productId: "prod-1",
      productTitle: "Aso-Oke Royal Dashiki",
      brandName: "Macklemore Fashion",
      size: "XL",
      quantity: 1,
      unitPrice: 185000,
    },
  ],
};

describe("Afro-Luxury Order Receipt Email Service", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("HTML Template Generation (buildOrderReceiptHtml)", () => {
    it("generates an email containing order number and client name", () => {
      const html = buildOrderReceiptHtml(samplePayload);
      expect(html).toContain("MKM-2026-9045");
      expect(html).toContain("Tunde");
      expect(html).toContain("Aso-Oke Royal Dashiki");
      expect(html).toContain("GIG-NG-884210");
      expect(html).toContain("GIG Logistics Express");
      expect(html).toContain("PAYSTACK");
    });

    it("explicitly includes fulfillment waiting times and delivery schedules", () => {
      const html = buildOrderReceiptHtml(samplePayload);
      expect(html).toContain("Fulfillment Waiting Times &amp; Delivery Schedule");
      expect(html).toContain("Stage 1 · Atelier Quality Inspection &amp; Packaging");
      expect(html).toContain("12-24 Hours (Hand Inspection &amp; Preservation Tissue)");
      expect(html).toContain("Stage 2 · Courier Waybill Activation &amp; Dispatch");
      expect(html).toContain("Within 24 Hours");
      expect(html).toContain("Stage 3 · Doorstep Delivery to Recipient");
      expect(html).toContain("1-2 Business Days");
    });

    it("uses correct hub context for Lagos Hub A vs Toronto Hub B", () => {
      const lagosHtml = buildOrderReceiptHtml(samplePayload);
      expect(lagosHtml).toContain("Nigeria Operations Hub (Hub A · Lagos)");

      const torontoPayload: OrderEmailPayload = {
        ...samplePayload,
        destinationCountry: "Canada",
        destinationCity: "Toronto",
        assignedHub: "HUB_B_TORONTO",
        currency: "CAD",
        courierPartner: "DHL Express International",
        waybillNumber: "DHL-YYZ-549102",
        estimatedTransitDays: "2-4 Business Days",
      };
      const torontoHtml = buildOrderReceiptHtml(torontoPayload);
      expect(torontoHtml).toContain("Toronto Corporate HQ (Hub B · Toronto, Canada)");
      expect(torontoHtml).toContain("2-4 Business Days");
    });

    it("contains no pill badges or rounded-full classes in styles", () => {
      const html = buildOrderReceiptHtml(samplePayload);
      expect(html).not.toContain("rounded-full");
      expect(html).not.toContain("border-radius: 9999px");
    });
  });

  describe("Resend Dispatch Handler (sendOrderConfirmationEmail)", () => {
    it("returns error gracefully if RESEND_API_KEY is missing", async () => {
      delete process.env.RESEND_API_KEY;
      const result = await sendOrderConfirmationEmail(samplePayload);
      expect(result.success).toBe(false);
      expect(result.error).toContain("RESEND_API_KEY not configured");
    });

    it("dispatches successfully via Resend REST API when API key is provided", async () => {
      process.env.RESEND_API_KEY = "re_test_123456789";

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: "msg_resend_test_abc123" }),
      });
      global.fetch = mockFetch as unknown as typeof fetch;

      const result = await sendOrderConfirmationEmail(samplePayload);
      expect(result.success).toBe(true);
      expect(result.messageId).toBe("msg_resend_test_abc123");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.resend.com/emails",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer re_test_123456789",
          }),
        })
      );
    });

    it("retries with onboarding@resend.dev when custom domain is unverified", async () => {
      process.env.RESEND_API_KEY = "re_test_123456789";
      process.env.RESEND_FROM_EMAIL = "Macklemore <orders@macklemorefashions.com>";

      const mockFetch = vi
        .fn()
        // First attempt fails with validation error (domain unverified)
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({
            name: "validation_error",
            message: "The domain is not verified",
          }),
        })
        // Retry attempt succeeds with onboarding@resend.dev
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: "msg_retry_success_456" }),
        });
      global.fetch = mockFetch as unknown as typeof fetch;

      const result = await sendOrderConfirmationEmail(samplePayload);
      expect(result.success).toBe(true);
      expect(result.messageId).toBe("msg_retry_success_456");
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it("catches fetch exceptions without throwing unhandled rejection", async () => {
      process.env.RESEND_API_KEY = "re_test_123456789";

      const mockFetch = vi.fn().mockRejectedValue(new Error("Network timeout"));
      global.fetch = mockFetch as unknown as typeof fetch;

      const result = await sendOrderConfirmationEmail(samplePayload);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Network timeout");
    });
  });
});

