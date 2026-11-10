import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CURRENCIES, CurrencyCode } from "@/lib/store-data";
import { listS3Objects } from "@/lib/s3-storage";

export async function GET() {
  try {
    const [orders, products, brands, collections, inquiries, s3Objects] =
      await Promise.all([
        prisma.order.findMany({
          include: { items: true },
          orderBy: { createdAt: "desc" },
        }),
        prisma.product.findMany({
          include: { variants: true },
        }),
        prisma.brand.findMany(),
        prisma.collection.findMany(),
        prisma.b2BInquiry.findMany({
          orderBy: { createdAt: "desc" },
        }),
        listS3Objects({ bucket: "uploads" }).catch(() => []),
      ]);

    const validOrders = orders.filter(
      (o) => o.status !== "CANCELLED" && o.status !== "REFUNDED"
    );

    // 1. Total Revenue Calculations (Normalized to CAD, USD, and NGN + Native Currency Breakdown)
    let totalRevenueCad = 0;
    let stripeRevenueCad = 0;
    let paystackRevenueCad = 0;
    let stripeOrderCount = 0;
    let paystackOrderCount = 0;

    let nigeriaHubRevenueCad = 0;
    let torontoHubRevenueCad = 0;
    let nigeriaHubOrderCount = 0;
    let torontoHubOrderCount = 0;

    const revenueByCurrency: Record<
      string,
      { amount: number; cadEquivalent: number; orders: number }
    > = {};

    const brandSalesMap: Record<
      string,
      {
        brandName: string;
        unitsSold: number;
        grossCad: number;
        commissionRatePct: number;
        macklemoreCommissionCad: number;
      }
    > = {};

    const categorySalesMap: Record<
      string,
      { category: string; unitsSold: number; revenueCad: number }
    > = {};

    const productCategoryLookup = new Map<string, string>();
    for (const p of products) {
      productCategoryLookup.set(p.id, p.category);
    }

    const brandCommissionLookup = new Map<string, number>();
    for (const b of brands) {
      brandCommissionLookup.set(b.name.toLowerCase(), b.commissionRatePct);
    }

    for (const order of validOrders) {
      const curr = (order.currency || "CAD") as CurrencyCode;
      const rate = CURRENCIES[curr]?.rateFromCad || 1;
      const orderCad =
        order.totalAmountCad && order.totalAmountCad > 0
          ? order.totalAmountCad
          : order.totalAmount / rate;

      totalRevenueCad += orderCad;

      if (!revenueByCurrency[curr]) {
        revenueByCurrency[curr] = { amount: 0, cadEquivalent: 0, orders: 0 };
      }
      revenueByCurrency[curr].amount += order.totalAmount;
      revenueByCurrency[curr].cadEquivalent += orderCad;
      revenueByCurrency[curr].orders += 1;

      if (order.paymentProvider === "PAYSTACK") {
        paystackRevenueCad += orderCad;
        paystackOrderCount += 1;
      } else {
        stripeRevenueCad += orderCad;
        stripeOrderCount += 1;
      }

      if (order.assignedHub === "HUB_A_LAGOS") {
        nigeriaHubRevenueCad += orderCad;
        nigeriaHubOrderCount += 1;
      } else {
        torontoHubRevenueCad += orderCad;
        torontoHubOrderCount += 1;
      }

      for (const item of order.items) {
        const itemCad = (item.unitPrice * item.quantity) / rate;
        const bKey = item.brandName;
        const commRate =
          brandCommissionLookup.get(item.brandName.toLowerCase()) ?? 0;

        if (!brandSalesMap[bKey]) {
          brandSalesMap[bKey] = {
            brandName: item.brandName,
            unitsSold: 0,
            grossCad: 0,
            commissionRatePct: commRate,
            macklemoreCommissionCad: 0,
          };
        }
        brandSalesMap[bKey].unitsSold += item.quantity;
        brandSalesMap[bKey].grossCad += itemCad;
        brandSalesMap[bKey].macklemoreCommissionCad +=
          commRate > 0 ? itemCad * (commRate / 100) : itemCad;

        const cat =
          productCategoryLookup.get(item.productId) || "Ready-to-Wear";
        if (!categorySalesMap[cat]) {
          categorySalesMap[cat] = {
            category: cat,
            unitsSold: 0,
            revenueCad: 0,
          };
        }
        categorySalesMap[cat].unitsSold += item.quantity;
        categorySalesMap[cat].revenueCad += itemCad;
      }
    }

    // 2. Inventory & Dual-Hub Stock Health
    let totalUnitsNigeria = 0;
    let totalUnitsToronto = 0;
    let totalInventoryValueCad = 0;
    const lowStockProducts: {
      id: string;
      title: string;
      category: string;
      totalStock: number;
      hubALagos: number;
      hubBToronto: number;
    }[] = [];

    for (const p of products) {
      let pLagos = 0;
      let pToronto = 0;
      for (const v of p.variants) {
        pLagos += v.hubALagos;
        pToronto += v.hubBToronto;
      }
      totalUnitsNigeria += pLagos;
      totalUnitsToronto += pToronto;
      totalInventoryValueCad += (pLagos + pToronto) * p.basePriceCad;

      if (pLagos + pToronto <= 15) {
        lowStockProducts.push({
          id: p.id,
          title: p.title,
          category: p.category,
          totalStock: pLagos + pToronto,
          hubALagos: pLagos,
          hubBToronto: pToronto,
        });
      }
    }

    // 3. Order Status Breakdown
    const statusBreakdown: Record<string, number> = {};
    for (const o of orders) {
      statusBreakdown[o.status] = (statusBreakdown[o.status] || 0) + 1;
    }

    // 4. S3 Bucket Storage Stats
    const s3TotalBytes = s3Objects.reduce((acc, obj) => acc + obj.size, 0);

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      financials: {
        totalRevenueCad: Math.round(totalRevenueCad),
        totalRevenueUsd: Math.round(
          totalRevenueCad * CURRENCIES.USD.rateFromCad
        ),
        totalRevenueNgn: Math.round(
          totalRevenueCad * CURRENCIES.NGN.rateFromCad
        ),
        totalRevenueGbp: Math.round(
          totalRevenueCad * CURRENCIES.GBP.rateFromCad
        ),
        averageOrderValueCad:
          validOrders.length > 0
            ? Math.round(totalRevenueCad / validOrders.length)
            : 0,
        totalOrdersCount: orders.length,
        activeOrdersCount: validOrders.length,
        revenueByCurrency,
      },
      gateways: {
        stripe: {
          revenueCad: Math.round(stripeRevenueCad),
          orderCount: stripeOrderCount,
          sharePct:
            totalRevenueCad > 0
              ? Math.round((stripeRevenueCad / totalRevenueCad) * 100)
              : 0,
        },
        paystack: {
          revenueCad: Math.round(paystackRevenueCad),
          revenueNgn: Math.round(
            paystackRevenueCad * CURRENCIES.NGN.rateFromCad
          ),
          orderCount: paystackOrderCount,
          sharePct:
            totalRevenueCad > 0
              ? Math.round((paystackRevenueCad / totalRevenueCad) * 100)
              : 0,
        },
      },
      hubs: {
        nigeriaHub: {
          label: "Nigeria Operations Hub",
          revenueCad: Math.round(nigeriaHubRevenueCad),
          orderCount: nigeriaHubOrderCount,
          stockUnits: totalUnitsNigeria,
        },
        torontoHub: {
          label: "Toronto, Canada HQ",
          revenueCad: Math.round(torontoHubRevenueCad),
          orderCount: torontoHubOrderCount,
          stockUnits: totalUnitsToronto,
        },
      },
      inventory: {
        totalProducts: products.length,
        totalBrands: brands.length,
        totalCollections: collections.length,
        totalUnitsInStock: totalUnitsNigeria + totalUnitsToronto,
        totalInventoryValueCad: Math.round(totalInventoryValueCad),
        lowStockProducts,
      },
      categoryPerformance: Object.values(categorySalesMap).sort(
        (a, b) => b.revenueCad - a.revenueCad
      ),
      brandPerformance: Object.values(brandSalesMap).sort(
        (a, b) => b.grossCad - a.grossCad
      ),
      orderStatusBreakdown: statusBreakdown,
      b2bPipeline: {
        totalInquiries: inquiries.length,
        newCount: inquiries.filter((i) => i.status === "NEW").length,
        inReviewCount: inquiries.filter((i) => i.status === "IN_REVIEW").length,
        partneredCount: inquiries.filter((i) => i.status === "PARTNERED")
          .length,
      },
      neonStorage: {
        bucket: "uploads",
        objectCount: s3Objects.length,
        totalBytes: s3TotalBytes,
        totalMegabytes: Number((s3TotalBytes / (1024 * 1024)).toFixed(2)),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to compute analytics",
      },
      { status: 500 }
    );
  }
}

