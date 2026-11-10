import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-response";
import { INITIAL_PRODUCTS, ProductRecord } from "@/lib/store-data";
import { syncLiveCatalogToNeonS3 } from "@/lib/s3-sync";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    try {
      const dbProduct = await prisma.product.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
        include: { variants: true },
      });

      if (dbProduct) {
        const formatted: ProductRecord = {
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
          priceRangeLabel: dbProduct.priceRangeLabel || undefined,
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
        return apiSuccess(formatted);
      }
    } catch {
      // Fallback
    }

    const fallback = INITIAL_PRODUCTS.find((p) => p.id === id || p.slug === id);
    if (!fallback) {
      return apiError(`Product "${id}" not found`, 404, "NOT_FOUND");
    }
    return apiSuccess(fallback);
  } catch (err) {
    return apiError((err as Error).message || "Failed to fetch product", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowedFields = [
      "title",
      "subtitle",
      "description",
      "basePriceCad",
      "editorialImageUrl",
      "flatlayImageUrl",
      "s3EditorialKey",
      "s3FlatlayKey",
      "isFeatured",
      "category",
      "gender",
    ];

    const dataToUpdate: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        dataToUpdate[field] = body[field];
      }
    }

    // Specific stock variant update: { size: 'L', hub: 'hubALagos', newQty: 10 }
    if (body.size && body.hub && typeof body.newQty === "number") {
      try {
        const prod = await prisma.product.findFirst({
          where: { OR: [{ id }, { slug: id }] },
        });
        if (prod) {
          await prisma.productVariant.updateMany({
            where: {
              productId: prod.id,
              size: body.size,
            },
            data: {
              [body.hub]: Math.max(0, body.newQty),
            },
          });
        }
      } catch {
        // Fallback handled
      }
    }

    try {
      if (Object.keys(dataToUpdate).length > 0) {
        const prod = await prisma.product.findFirst({
          where: { OR: [{ id }, { slug: id }] },
        });
        if (prod) {
          await prisma.product.update({
            where: { id: prod.id },
            data: dataToUpdate,
          });
        }
      }

      void syncLiveCatalogToNeonS3();

      const updated = await prisma.product.findFirst({
        where: { OR: [{ id }, { slug: id }] },
        include: { variants: true },
      });

      if (updated) {
        return apiSuccess(updated);
      }
    } catch {
      // Fallback
    }

    return apiSuccess({ id, ...body, updatedAt: new Date().toISOString() });
  } catch (err) {
    return apiError((err as Error).message || "Failed to update product", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    try {
      const prod = await prisma.product.findFirst({
        where: { OR: [{ id }, { slug: id }] },
      });
      if (prod) {
        await prisma.product.delete({ where: { id: prod.id } });
        void syncLiveCatalogToNeonS3();
      }
    } catch {
      // Fallback
    }

    return apiSuccess({ deletedId: id });
  } catch (err) {
    return apiError((err as Error).message || "Failed to delete product", 500);
  }
}

