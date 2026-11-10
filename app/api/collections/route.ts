import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-response";
import { CollectionRecord, INITIAL_COLLECTIONS } from "@/lib/store-data";
import { syncLiveCatalogToNeonS3 } from "@/lib/s3-sync";

export async function GET() {
  try {
    try {
      const dbCollections = await prisma.collection.findMany({
        orderBy: { createdAt: "asc" },
      });

      if (dbCollections.length > 0) {
        const formatted: CollectionRecord[] = dbCollections.map((c) => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          seasonCode: c.seasonCode,
          manifesto: c.manifesto,
          heroImageUrl: c.heroImageUrl,
          releaseDate: c.releaseDate,
          isDropLive: c.isDropLive,
          isVipLocked: c.isVipLocked,
          brandId: c.brandId,
          brandName: c.brandName,
        }));
        return apiSuccess(formatted, { total: formatted.length });
      }
    } catch {
      // Fallback
    }

    return apiSuccess(INITIAL_COLLECTIONS, { total: INITIAL_COLLECTIONS.length });
  } catch (err) {
    return apiError((err as Error).message || "Failed to fetch collections", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      seasonCode = "Capsule Drop",
      manifesto = "",
      heroImageUrl = "/api/storage/uploads/macklemore/2025/04/25.jpg",
      releaseDate = new Date().toISOString(),
      isDropLive = true,
      isVipLocked = false,
      brandId = "brand-macklemore",
      brandName = "Macklemore Fashion",
    } = body;

    if (!title) {
      return apiError("Collection title is required", 400);
    }

    const cleanSlug =
      body.slug?.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const id = body.id || `col-${Date.now()}`;

    let created: CollectionRecord;

    try {
      const dbCol = await prisma.collection.create({
        data: {
          id,
          slug: cleanSlug,
          title: title.trim(),
          seasonCode,
          manifesto,
          heroImageUrl,
          releaseDate,
          isDropLive: Boolean(isDropLive),
          isVipLocked: Boolean(isVipLocked),
          brandId,
          brandName,
        },
      });

      created = {
        id: dbCol.id,
        slug: dbCol.slug,
        title: dbCol.title,
        seasonCode: dbCol.seasonCode,
        manifesto: dbCol.manifesto,
        heroImageUrl: dbCol.heroImageUrl,
        releaseDate: dbCol.releaseDate,
        isDropLive: dbCol.isDropLive,
        isVipLocked: dbCol.isVipLocked,
        brandId: dbCol.brandId,
        brandName: dbCol.brandName,
      };

      void syncLiveCatalogToNeonS3();
    } catch {
      created = {
        id,
        slug: cleanSlug,
        title: title.trim(),
        seasonCode,
        manifesto,
        heroImageUrl,
        releaseDate,
        isDropLive: Boolean(isDropLive),
        isVipLocked: Boolean(isVipLocked),
        brandId,
        brandName,
      };
    }

    return apiSuccess(created, undefined, 201);
  } catch (err) {
    return apiError((err as Error).message || "Failed to create collection", 500);
  }
}

