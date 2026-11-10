import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-response";
import { CollectionRecord, INITIAL_COLLECTIONS } from "@/lib/store-data";
import { syncLiveCatalogToNeonS3 } from "@/lib/s3-sync";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    try {
      const dbCol = await prisma.collection.findFirst({
        where: { OR: [{ id }, { slug: id }] },
      });

      if (dbCol) {
        const formatted: CollectionRecord = {
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
        return apiSuccess(formatted);
      }
    } catch {
      // Fallback
    }

    const fallback = INITIAL_COLLECTIONS.find((c) => c.id === id || c.slug === id);
    if (!fallback) {
      return apiError(`Collection "${id}" not found`, 404, "NOT_FOUND");
    }
    return apiSuccess(fallback);
  } catch (err) {
    return apiError((err as Error).message || "Failed to fetch collection", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowed = [
      "title",
      "seasonCode",
      "manifesto",
      "heroImageUrl",
      "releaseDate",
      "isDropLive",
      "isVipLocked",
    ];

    const data: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) data[key] = body[key];
    }

    try {
      const col = await prisma.collection.findFirst({
        where: { OR: [{ id }, { slug: id }] },
      });

      if (col) {
        const updated = await prisma.collection.update({
          where: { id: col.id },
          data,
        });
        void syncLiveCatalogToNeonS3();
        return apiSuccess(updated);
      }
    } catch {
      // Fallback
    }

    return apiSuccess({ id, ...body, updatedAt: new Date().toISOString() });
  } catch (err) {
    return apiError((err as Error).message || "Failed to update collection", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    try {
      const col = await prisma.collection.findFirst({
        where: { OR: [{ id }, { slug: id }] },
      });
      if (col) {
        await prisma.collection.delete({ where: { id: col.id } });
        void syncLiveCatalogToNeonS3();
      }
    } catch {
      // Fallback
    }

    return apiSuccess({ deletedId: id });
  } catch (err) {
    return apiError((err as Error).message || "Failed to delete collection", 500);
  }
}

