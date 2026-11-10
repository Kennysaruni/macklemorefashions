import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-response";
import { BrandRecord, INITIAL_BRANDS } from "@/lib/store-data";
import { syncLiveCatalogToNeonS3 } from "@/lib/s3-sync";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    try {
      const dbBrand = await prisma.brand.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
      });

      if (dbBrand) {
        const formatted: BrandRecord = {
          id: dbBrand.id,
          slug: dbBrand.slug,
          name: dbBrand.name,
          tagline: dbBrand.tagline,
          bio: dbBrand.bio,
          story: dbBrand.story,
          originCity: dbBrand.originCity,
          originCountry: dbBrand.originCountry,
          creativeDirector: dbBrand.creativeDirector,
          foundedYear: dbBrand.foundedYear,
          isProprietary: dbBrand.isProprietary,
          lookbookBannerUrl: dbBrand.lookbookBannerUrl,
          secondaryBannerUrl: dbBrand.secondaryBannerUrl,
          commissionRatePct: dbBrand.commissionRatePct,
          allocatedRegions: dbBrand.allocatedRegions,
          isActive: dbBrand.isActive,
        };
        return apiSuccess(formatted);
      }
    } catch {
      // Fallback
    }

    const fallback = INITIAL_BRANDS.find((b) => b.id === id || b.slug === id);
    if (!fallback) {
      return apiError(`Brand "${id}" not found`, 404, "NOT_FOUND");
    }
    return apiSuccess(fallback);
  } catch (err) {
    return apiError((err as Error).message || "Failed to fetch brand", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowed = [
      "name",
      "tagline",
      "bio",
      "story",
      "originCity",
      "originCountry",
      "creativeDirector",
      "lookbookBannerUrl",
      "secondaryBannerUrl",
      "commissionRatePct",
      "allocatedRegions",
      "isActive",
    ];

    const data: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) data[key] = body[key];
    }

    try {
      const brand = await prisma.brand.findFirst({
        where: { OR: [{ id }, { slug: id }] },
      });
      if (brand) {
        const updated = await prisma.brand.update({
          where: { id: brand.id },
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
    return apiError((err as Error).message || "Failed to update brand", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    try {
      const brand = await prisma.brand.findFirst({
        where: { OR: [{ id }, { slug: id }] },
      });
      if (brand) {
        await prisma.brand.delete({ where: { id: brand.id } });
        void syncLiveCatalogToNeonS3();
      }
    } catch {
      // Fallback
    }

    return apiSuccess({ deletedId: id });
  } catch (err) {
    return apiError((err as Error).message || "Failed to delete brand", 500);
  }
}

