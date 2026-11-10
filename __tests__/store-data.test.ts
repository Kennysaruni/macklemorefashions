import { describe, expect, it } from "vitest";
import {
  calculateLogisticsForDestination,
  convertPrice,
  formatCurrencyValue,
  getTotalProductStock,
  INITIAL_PRODUCTS,
} from "@/lib/store-data";

describe("store-data utilities", () => {
  it("converts CAD prices accurately to foreign currencies", () => {
    const sampleProduct = INITIAL_PRODUCTS[0];
    const cadPrice = sampleProduct.basePriceCad;

    // USD: 1 CAD = 0.74 USD
    const usdPrice = convertPrice(sampleProduct, "USD");
    expect(usdPrice).toBe(Math.round(cadPrice * 0.74));

    // NGN: 1 CAD = 1125 NGN
    const ngnPrice = convertPrice(sampleProduct, "NGN");
    expect(ngnPrice).toBe(Math.round(cadPrice * 1125));

    // CAD should be identical
    expect(convertPrice(sampleProduct, "CAD")).toBe(cadPrice);
  });

  it("formats currency values with correct symbols", () => {
    expect(formatCurrencyValue(500, "CAD")).toBe("CAD $500");
    expect(formatCurrencyValue(450, "USD")).toBe("USD $450");
    expect(formatCurrencyValue(150000, "NGN")).toBe("NGN ₦150,000");
    expect(formatCurrencyValue(380, "GBP")).toBe("GBP £380");
  });

  it("routes West Africa (Nigeria) to Hub A (Lagos) with Paystack recommendation", () => {
    const logistics = calculateLogisticsForDestination("NG", "NGN", 200000);
    expect(logistics.assignedHub).toBe("HUB_A_LAGOS");
    expect(logistics.recommendedGateway).toBe("PAYSTACK");
    expect(logistics.dutiesFee).toBe(0); // Domestic/ECOWAS duty cleared
    expect(logistics.courierPartner).toBe("GIG Logistics Priority");
  });

  it("routes North America (Canada) to Hub B (Toronto) with Stripe recommendation", () => {
    const logistics = calculateLogisticsForDestination("CA", "CAD", 600);
    expect(logistics.assignedHub).toBe("HUB_B_TORONTO");
    expect(logistics.recommendedGateway).toBe("STRIPE");
    expect(logistics.dutiesFee).toBe(0); // Domestic Canadian clearance
    expect(logistics.courierPartner).toBe("DHL Express International");
  });

  it("routes East Africa (Kenya) to Hub A (Lagos) with regional delivery", () => {
    const logistics = calculateLogisticsForDestination("KE", "KES", 50000);
    expect(logistics.assignedHub).toBe("HUB_A_LAGOS");
    expect(logistics.recommendedGateway).toBe("STRIPE");
  });

  it("calculates total warehouse stock across Hub A and Hub B variants", () => {
    const sampleProduct = INITIAL_PRODUCTS[0];
    const stock = getTotalProductStock(sampleProduct);

    let expectedLagos = 0;
    let expectedToronto = 0;
    for (const v of sampleProduct.variants) {
      expectedLagos += v.hubALagos;
      expectedToronto += v.hubBToronto;
    }

    expect(stock.hubALagos).toBe(expectedLagos);
    expect(stock.hubBToronto).toBe(expectedToronto);
    expect(stock.total).toBe(expectedLagos + expectedToronto);
    expect(stock.total).toBeGreaterThan(0);
  });
});
