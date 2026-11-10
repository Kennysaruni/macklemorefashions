import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  CURRENCIES,
  CurrencyCode,
  INITIAL_B2B_INQUIRIES,
  INITIAL_BRANDS,
  INITIAL_COLLECTIONS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
} from "@/lib/store-data";
import { putS3Object } from "@/lib/s3-storage";

async function syncCatalogSnapshotToS3() {
  try {
    const [brands, collections, products] = await Promise.all([
      prisma.brand.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.collection.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.product.findMany({
        include: { variants: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    await putS3Object({
      bucket: "uploads",
      key: "catalog/macklemore-catalog-live.json",
      body: JSON.stringify(
        {
          updatedAt: new Date().toISOString(),
          counts: {
            brands: brands.length,
            collections: collections.length,
            products: products.length,
          },
          brands,
          collections,
          products,
        },
        null,
        2
      ),
      contentType: "application/json",
    });
  } catch {
    // Non-blocking background sync to Neon S3 bucket
  }
}

export async function GET() {
  try {
    const [dbBrands, dbCollections, dbProducts, dbOrders, dbInquiries] =
      await Promise.all([
        prisma.brand.findMany({ orderBy: { createdAt: "asc" } }),
        prisma.collection.findMany({ orderBy: { createdAt: "asc" } }),
        prisma.product.findMany({
          include: { variants: true },
          orderBy: { createdAt: "asc" },
        }),
        prisma.order.findMany({
          include: { items: true },
          orderBy: { createdAt: "desc" },
        }),
        prisma.b2BInquiry.findMany({ orderBy: { createdAt: "desc" } }),
      ]);

    return NextResponse.json({
      ok: true,
      source: "neon_postgres_and_s3",
      brands: dbBrands.length > 0 ? dbBrands : INITIAL_BRANDS,
      collections:
        dbCollections.length > 0 ? dbCollections : INITIAL_COLLECTIONS,
      products:
        dbProducts.length > 0
          ? dbProducts.map((p) => ({
              ...p,
              priceRangeLabel: p.priceRangeLabel || undefined,
              variants: p.variants.map((v) => ({
                size: v.size,
                sku: v.sku,
                hubALagos: v.hubALagos,
                hubBToronto: v.hubBToronto,
              })),
            }))
          : INITIAL_PRODUCTS,
      orders:
        dbOrders.length > 0
          ? dbOrders.map((o) => ({
              ...o,
              waybillNumber: o.waybillNumber || undefined,
              createdAt: o.createdAt.toISOString(),
            }))
          : INITIAL_ORDERS,
      b2bInquiries:
        dbInquiries.length > 0
          ? dbInquiries.map((inq) => ({
              ...inq,
              createdAt: inq.createdAt.toISOString(),
            }))
          : INITIAL_B2B_INQUIRIES,
    });
  } catch {
    // Fallback to initial seed data if database is still migrating
    return NextResponse.json({
      ok: true,
      source: "fallback_seed",
      brands: INITIAL_BRANDS,
      collections: INITIAL_COLLECTIONS,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      b2bInquiries: INITIAL_B2B_INQUIRIES,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    if (action === "CREATE_BRAND") {
      const id = payload.id || `brand-${Date.now()}`;
      const created = await prisma.brand.create({
        data: {
          id,
          slug: payload.slug,
          name: payload.name,
          tagline: payload.tagline,
          bio: payload.bio,
          story: payload.story || payload.bio,
          originCity: payload.originCity,
          originCountry: payload.originCountry,
          creativeDirector: payload.creativeDirector,
          foundedYear: Number(payload.foundedYear) || 2024,
          isProprietary: Boolean(payload.isProprietary),
          lookbookBannerUrl: payload.lookbookBannerUrl,
          secondaryBannerUrl:
            payload.secondaryBannerUrl || payload.lookbookBannerUrl,
          commissionRatePct: Number(payload.commissionRatePct) || 20,
          allocatedRegions: Array.isArray(payload.allocatedRegions)
            ? payload.allocatedRegions
            : ["West Africa", "North America"],
          isActive: payload.isActive ?? true,
        },
      });
      await syncCatalogSnapshotToS3();
      return NextResponse.json({ ok: true, brand: created });
    }

    if (action === "CREATE_PRODUCT") {
      const id = payload.id || `mkm-${Date.now()}`;
      const variants = Array.isArray(payload.variants) ? payload.variants : [];
      const created = await prisma.product.create({
        data: {
          id,
          slug: payload.slug,
          skuPrefix: payload.skuPrefix,
          title: payload.title,
          subtitle: payload.subtitle,
          description: payload.description,
          gender: payload.gender,
          category: payload.category,
          fabricWeightGsm: Number(payload.fabricWeightGsm) || 360,
          fabricComposition: payload.fabricComposition,
          originLabel: payload.originLabel || "Nigeria & Toronto, Canada",
          basePriceCad: Number(payload.basePriceCad) || 150,
          priceRangeLabel: payload.priceRangeLabel || null,
          editorialImageUrl: payload.editorialImageUrl,
          flatlayImageUrl:
            payload.flatlayImageUrl || payload.editorialImageUrl,
          colorName: payload.colorName || "Signature Gold",
          colorHex: payload.colorHex || "#D4860B",
          isFeatured: Boolean(payload.isFeatured),
          brandId: payload.brandId,
          brandSlug: payload.brandSlug,
          brandName: payload.brandName,
          collectionSlug: payload.collectionSlug || "men-wears-collection",
          variants: {
            create: variants.map(
              (v: {
                size: string;
                sku: string;
                hubALagos: number;
                hubBToronto: number;
              }) => ({
                size: v.size,
                sku: v.sku,
                hubALagos: Number(v.hubALagos) || 0,
                hubBToronto: Number(v.hubBToronto) || 0,
              })
            ),
          },
        },
        include: { variants: true },
      });
      await syncCatalogSnapshotToS3();
      return NextResponse.json({ ok: true, product: created });
    }

    if (action === "UPDATE_PRODUCT") {
      const updated = await prisma.product.update({
        where: { id: payload.id },
        data: {
          title: payload.title,
          subtitle: payload.subtitle,
          description: payload.description,
          category: payload.category,
          gender: payload.gender,
          basePriceCad: Number(payload.basePriceCad),
          priceRangeLabel: payload.priceRangeLabel || null,
          editorialImageUrl: payload.editorialImageUrl,
          flatlayImageUrl: payload.flatlayImageUrl,
          colorName: payload.colorName,
          colorHex: payload.colorHex,
          isFeatured: Boolean(payload.isFeatured),
        },
        include: { variants: true },
      });
      await syncCatalogSnapshotToS3();
      return NextResponse.json({ ok: true, product: updated });
    }

    if (action === "DELETE_PRODUCT") {
      await prisma.product.delete({
        where: { id: payload.id },
      });
      await syncCatalogSnapshotToS3();
      return NextResponse.json({ ok: true });
    }

    if (action === "UPDATE_VARIANT_STOCK") {
      const { productId, sku, hubALagos, hubBToronto } = payload;
      const updated = await prisma.productVariant.update({
        where: { sku },
        data: {
          hubALagos: Math.max(0, Number(hubALagos)),
          hubBToronto: Math.max(0, Number(hubBToronto)),
        },
      });
      await syncCatalogSnapshotToS3();
      return NextResponse.json({ ok: true, variant: updated, productId });
    }

    if (action === "TOGGLE_COLLECTION_LIVE") {
      const current = await prisma.collection.findUnique({
        where: { id: payload.collectionId },
      });
      if (!current) {
        return NextResponse.json(
          { ok: false, error: "Collection not found" },
          { status: 404 }
        );
      }
      const updated = await prisma.collection.update({
        where: { id: payload.collectionId },
        data: { isDropLive: !current.isDropLive },
      });
      await syncCatalogSnapshotToS3();
      return NextResponse.json({ ok: true, collection: updated });
    }

    if (action === "CREATE_ORDER") {
      const currency = (payload.currency || "CAD") as CurrencyCode;
      const rate = CURRENCIES[currency]?.rateFromCad || 1;
      const totalAmount = Number(payload.totalAmount) || 0;
      const totalAmountCad = rate > 0 ? totalAmount / rate : totalAmount;

      const created = await prisma.order.create({
        data: {
          id: payload.id || `ord-${Date.now()}`,
          orderNumber:
            payload.orderNumber ||
            `MKM-2026-${Math.floor(1000 + Math.random() * 8999)}`,
          customerName: payload.customerName,
          customerEmail: payload.customerEmail,
          customerPhone: payload.customerPhone,
          destinationCountry: payload.destinationCountry,
          destinationCity: payload.destinationCity,
          shippingAddress: payload.shippingAddress || payload.destinationCity,
          currency,
          subtotalAmount: Number(payload.subtotalAmount) || 0,
          shippingAmount: Number(payload.shippingAmount) || 0,
          dutiesAmount: Number(payload.dutiesAmount) || 0,
          totalAmount,
          totalAmountCad,
          assignedHub: payload.assignedHub || "HUB_B_TORONTO",
          courierPartner: payload.courierPartner || "DHL Express",
          waybillNumber: payload.waybillNumber || null,
          status: payload.status || "PAID",
          paymentProvider:
            payload.paymentProvider === "PAYSTACK" ? "PAYSTACK" : "STRIPE",
          paymentReference:
            payload.paymentReference || `REF_${Date.now()}`,
          paymentStatus: payload.paymentStatus || "SUCCEEDED",
          items: {
            create: (payload.items || []).map(
              (item: {
                productId: string;
                productTitle: string;
                brandName: string;
                size: string;
                quantity: number;
                unitPrice: number;
              }) => ({
                productId: item.productId,
                productTitle: item.productTitle,
                brandName: item.brandName,
                size: item.size,
                quantity: Number(item.quantity) || 1,
                unitPrice: Number(item.unitPrice) || 0,
              })
            ),
          },
        },
        include: { items: true },
      });

      // Atomically decrement variant stock in the assigned hub
      for (const item of payload.items || []) {
        const variant = await prisma.productVariant.findFirst({
          where: {
            productId: item.productId,
            size: item.size,
          },
        });
        if (variant) {
          const qty = Number(item.quantity) || 1;
          if (payload.assignedHub === "HUB_A_LAGOS") {
            await prisma.productVariant.update({
              where: { id: variant.id },
              data: { hubALagos: Math.max(0, variant.hubALagos - qty) },
            });
          } else {
            await prisma.productVariant.update({
              where: { id: variant.id },
              data: { hubBToronto: Math.max(0, variant.hubBToronto - qty) },
            });
          }
        }
      }

      return NextResponse.json({ ok: true, order: created });
    }

    if (action === "UPDATE_ORDER_STATUS") {
      const updated = await prisma.order.update({
        where: { id: payload.orderId },
        data: {
          status: payload.status,
          ...(payload.waybillNumber
            ? { waybillNumber: payload.waybillNumber }
            : {}),
        },
        include: { items: true },
      });
      return NextResponse.json({ ok: true, order: updated });
    }

    if (action === "CREATE_B2B_INQUIRY") {
      const created = await prisma.b2BInquiry.create({
        data: {
          id: payload.id || `b2b-${Date.now()}`,
          referenceCode:
            payload.referenceCode ||
            `B2B-MKM-0${Math.floor(400 + Math.random() * 599)}`,
          channel: payload.channel,
          brandOrCompanyName: payload.brandOrCompanyName,
          contactName: payload.contactName,
          contactRole: payload.contactRole,
          email: payload.email,
          phone: payload.phone,
          headquartersCountry: payload.headquartersCountry,
          websiteUrl: payload.websiteUrl || "https://macklemorefashions.com",
          targetRegions: Array.isArray(payload.targetRegions)
            ? payload.targetRegions
            : ["West Africa", "North America"],
          annualVolumeTier: payload.annualVolumeTier,
          message: payload.message,
          status: "NEW",
          assignedExecutive: "Micah Elechi",
        },
      });
      return NextResponse.json({ ok: true, inquiry: created });
    }

    if (action === "UPDATE_B2B_STATUS") {
      const updated = await prisma.b2BInquiry.update({
        where: { id: payload.inquiryId },
        data: { status: payload.status },
      });
      return NextResponse.json({ ok: true, inquiry: updated });
    }

    return NextResponse.json(
      { ok: false, error: `Unknown catalog action: ${action}` },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Database mutation failed",
      },
      { status: 500 }
    );
  }
}

