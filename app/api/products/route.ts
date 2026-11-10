import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-response";
import { INITIAL_PRODUCTS, ProductRecord } from "@/lib/store-data";
import { syncLiveCatalogToNeonS3 } from "@/lib/s3-sync";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const gender = searchParams.get("gender");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search")?.toLowerCase().trim();
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));

    try {
      const where: Record<string, unknown> = { isActive: true };
      if (category) where.category = category;
      if (brand) {
        where.OR = [{ brandSlug: brand }, { brandId: brand }];
      }
      if (gender) where.gender = gender;
      if (featured === "true") where.isFeatured = true;
      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { subtitle: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { skuPrefix: { contains: search, mode: "insensitive" } },
        ];
      }

      const [dbProducts, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: { variants: true },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: offset,
        }),
        prisma.product.count({ where }),
      ]);

      if (dbProducts.length > 0 || total > 0) {
        const formatted: ProductRecord[] = dbProducts.map((p) => ({
          id: p.id,
          slug: p.slug,
          skuPrefix: p.skuPrefix,
          title: p.title,
          subtitle: p.subtitle,
          description: p.description,
          gender: p.gender as ProductRecord["gender"],
          category: p.category as ProductRecord["category"],
          fabricWeightGsm: p.fabricWeightGsm,
          fabricComposition: p.fabricComposition,
          originLabel: p.originLabel,
          basePriceCad: p.basePriceCad,
          priceRangeLabel: p.priceRangeLabel || undefined,
          editorialImageUrl: p.editorialImageUrl,
          flatlayImageUrl: p.flatlayImageUrl,
          s3EditorialKey: p.s3EditorialKey || undefined,
          s3FlatlayKey: p.s3FlatlayKey || undefined,
          colorName: p.colorName,
          colorHex: p.colorHex,
          isFeatured: p.isFeatured,
          brandId: p.brandId,
          brandSlug: p.brandSlug,
          brandName: p.brandName,
          collectionSlug: p.collectionSlug,
          variants: p.variants.map((v) => ({
            size: v.size as "XS" | "S" | "M" | "L" | "XL" | "XXL",
            sku: v.sku,
            hubALagos: v.hubALagos,
            hubBToronto: v.hubBToronto,
          })),
        }));

        return apiSuccess(formatted, { total, count: formatted.length, limit });
      }
    } catch {
      // Fallback below
    }

    // In-memory fallback
    let filtered = [...INITIAL_PRODUCTS];
    if (category) filtered = filtered.filter((p) => p.category === category);
    if (brand) filtered = filtered.filter((p) => p.brandSlug === brand || p.brandId === brand);
    if (gender) filtered = filtered.filter((p) => p.gender === gender);
    if (featured === "true") filtered = filtered.filter((p) => p.isFeatured);
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.subtitle.toLowerCase().includes(search) ||
          p.skuPrefix.toLowerCase().includes(search)
      );
    }
    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);
    return apiSuccess(paginated, { total, count: paginated.length, limit });
  } catch (err) {
    return apiError((err as Error).message || "Failed to fetch products", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      subtitle = "Archival Garment Allocation",
      description = "Crafted luxury garment allocated across Nigeria Operations Hub and Toronto HQ.",
      gender = "UNISEX",
      category = "KAFTAN_ARCHIVE",
      fabricWeightGsm = 380,
      fabricComposition = "100% Archival Heavyweight Weave",
      originLabel = "NIGERIA / TORONTO",
      basePriceCad,
      editorialImageUrl,
      flatlayImageUrl,
      s3EditorialKey,
      s3FlatlayKey,
      colorName = "BRONZE / RAW IVORY",
      colorHex = "#7A491D",
      isFeatured = true,
      brandId,
      brandSlug,
      brandName,
      collectionSlug = "macklemore-signature-2025",
      variants = [],
    } = body;

    if (!title || typeof basePriceCad !== "number" || basePriceCad <= 0) {
      return apiError("Missing required product fields: title, positive basePriceCad", 400);
    }

    const cleanSlug =
      body.slug?.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const id = body.id || `prod-${Date.now()}`;
    const skuPrefix = body.skuPrefix || `MKM-${Math.floor(100 + Math.random() * 899)}`;

    const defaultVariants =
      Array.isArray(variants) && variants.length > 0
        ? variants
        : [
            { size: "S", sku: `${skuPrefix}-S`, hubALagos: 6, hubBToronto: 5 },
            { size: "M", sku: `${skuPrefix}-M`, hubALagos: 10, hubBToronto: 8 },
            { size: "L", sku: `${skuPrefix}-L`, hubALagos: 8, hubBToronto: 6 },
            { size: "XL", sku: `${skuPrefix}-XL`, hubALagos: 4, hubBToronto: 4 },
          ];

    let createdProduct: ProductRecord;

    try {
      const dbProduct = await prisma.product.create({
        data: {
          id,
          slug: cleanSlug,
          skuPrefix,
          title: title.trim().toUpperCase(),
          subtitle,
          description,
          gender,
          category,
          fabricWeightGsm: Number(fabricWeightGsm) || 380,
          fabricComposition,
          originLabel,
          basePriceCad: Number(basePriceCad),
          editorialImageUrl: editorialImageUrl || "/api/storage/uploads/macklemore/2025/04/25.jpg",
          flatlayImageUrl: flatlayImageUrl || "/api/storage/uploads/macklemore/2025/04/26.jpg",
          s3EditorialKey: s3EditorialKey || null,
          s3FlatlayKey: s3FlatlayKey || null,
          colorName,
          colorHex,
          isFeatured: Boolean(isFeatured),
          brandId: brandId || "brand-macklemore",
          brandSlug: brandSlug || "macklemore",
          brandName: brandName || "Macklemore Fashion",
          collectionSlug,
          variants: {
            create: defaultVariants.map(
              (v: { size: string; sku?: string; hubALagos?: number; hubBToronto?: number }) => ({
                size: v.size,
                sku: v.sku || `${skuPrefix}-${v.size}`,
                hubALagos: Math.max(0, Number(v.hubALagos) || 0),
                hubBToronto: Math.max(0, Number(v.hubBToronto) || 0),
              })
            ),
          },
        },
        include: { variants: true },
      });

      createdProduct = {
        id: dbProduct.id,
        slug: dbProduct.slug,
        skuPrefix: dbProduct.skuPrefix,
        title: dbProduct.title,
        subtitle: dbProduct.subtitle,
        description: dbProduct.description,
        gender: dbProduct.gender as ProductRecord["gender"],
        category: dbProduct.category as ProductRecord["category"],
        fabricWeightGsm: dbProduct.fabricWeightGsm,
        fabricComposition: dbProduct.fabricComposition,
        originLabel: dbProduct.originLabel,
        basePriceCad: dbProduct.basePriceCad,
        editorialImageUrl: dbProduct.editorialImageUrl,
        flatlayImageUrl: dbProduct.flatlayImageUrl,
        s3EditorialKey: dbProduct.s3EditorialKey || undefined,
        s3FlatlayKey: dbProduct.s3FlatlayKey || undefined,
        colorName: dbProduct.colorName,
        colorHex: dbProduct.colorHex,
        isFeatured: dbProduct.isFeatured,
        brandId: dbProduct.brandId,
        brandSlug: dbProduct.brandSlug,
        brandName: dbProduct.brandName,
        collectionSlug: dbProduct.collectionSlug,
        variants: dbProduct.variants.map((v) => ({
          size: v.size as "XS" | "S" | "M" | "L" | "XL" | "XXL",
          sku: v.sku,
          hubALagos: v.hubALagos,
          hubBToronto: v.hubBToronto,
        })),
      };

      void syncLiveCatalogToNeonS3();
    } catch {
      // Fallback
      createdProduct = {
        id,
        slug: cleanSlug,
        skuPrefix,
        title: title.trim().toUpperCase(),
        subtitle,
        description,
        gender,
        category,
        fabricWeightGsm: Number(fabricWeightGsm) || 380,
        fabricComposition,
        originLabel,
        basePriceCad: Number(basePriceCad),
        editorialImageUrl: editorialImageUrl || "/api/storage/uploads/macklemore/2025/04/25.jpg",
        flatlayImageUrl: flatlayImageUrl || "/api/storage/uploads/macklemore/2025/04/26.jpg",
        s3EditorialKey,
        s3FlatlayKey,
        colorName,
        colorHex,
        isFeatured: Boolean(isFeatured),
        brandId: brandId || "brand-macklemore",
        brandSlug: brandSlug || "macklemore",
        brandName: brandName || "Macklemore Fashion",
        collectionSlug,
        variants: defaultVariants,
      };
    }

    return apiSuccess(createdProduct, undefined, 201);
  } catch (err) {
    return apiError((err as Error).message || "Failed to create product", 500);
  }
}

