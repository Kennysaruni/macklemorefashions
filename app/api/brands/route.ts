import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-response";
import { BrandRecord, INITIAL_BRANDS } from "@/lib/store-data";
import { syncLiveCatalogToNeonS3 } from "@/lib/s3-sync";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");
    const active = searchParams.get("active");

    try {
      const where: Record<string, unknown> = {};
      if (active === "true") where.isActive = true;
      if (region) where.allocatedRegions = { has: region };

      const dbBrands = await prisma.brand.findMany({
        where,
        orderBy: { foundedYear: "asc" },
      });

      if (dbBrands.length > 0) {
        const formatted: BrandRecord[] = dbBrands.map((b) => ({
          id: b.id,
          slug: b.slug,
          name: b.name,
          tagline: b.tagline,
          bio: b.bio,
          story: b.story,
          originCity: b.originCity,
          originCountry: b.originCountry,
          creativeDirector: b.creativeDirector,
          foundedYear: b.foundedYear,
          isProprietary: b.isProprietary,
          lookbookBannerUrl: b.lookbookBannerUrl,
          secondaryBannerUrl: b.secondaryBannerUrl,
          commissionRatePct: b.commissionRatePct,
          allocatedRegions: b.allocatedRegions,
          isActive: b.isActive,
        }));
        return apiSuccess(formatted, { total: formatted.length });
      }
    } catch {
      // Fallback
    }

    let filtered = [...INITIAL_BRANDS];
    if (active === "true") filtered = filtered.filter((b) => b.isActive);
    if (region) filtered = filtered.filter((b) => b.allocatedRegions.includes(region));
    return apiSuccess(filtered, { total: filtered.length });
  } catch (err) {
    return apiError((err as Error).message || "Failed to fetch brands", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      tagline = "REPRESENTED PARTNER HOUSE // THE COLLECTIVE ARCHIVE",
      bio = "",
      story = "",
      originCity = "NIGERIA / TORONTO",
      originCountry = "Nigeria & Canada",
      creativeDirector = "House Directorate",
      foundedYear = 2024,
      isProprietary = false,
      lookbookBannerUrl = "/api/storage/uploads/macklemore/2025/05/Torontofw1.jpg",
      secondaryBannerUrl = "/api/storage/uploads/macklemore/2025/05/Torontofw1.jpg",
      commissionRatePct = 20.0,
      allocatedRegions = ["WEST_AFRICA", "NORTH_AMERICA"],
      isActive = true,
    } = body;

    if (!name || typeof name !== "string") {
      return apiError("Brand name is required", 400);
    }

    const cleanSlug =
      body.slug?.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const id = body.id || `brand-${Date.now()}`;

    let createdBrand: BrandRecord;

    try {
      const dbBrand = await prisma.brand.create({
        data: {
          id,
          slug: cleanSlug,
          name: name.trim().toUpperCase(),
          tagline,
          bio,
          story: story || bio,
          originCity,
          originCountry,
          creativeDirector,
          foundedYear: Number(foundedYear) || 2024,
          isProprietary: Boolean(isProprietary),
          lookbookBannerUrl,
          secondaryBannerUrl,
          commissionRatePct: Number(commissionRatePct) || 20.0,
          allocatedRegions,
          isActive: Boolean(isActive),
        },
      });

      createdBrand = {
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

      void syncLiveCatalogToNeonS3();
    } catch {
      createdBrand = {
        id,
        slug: cleanSlug,
        name: name.trim().toUpperCase(),
        tagline,
        bio,
        story: story || bio,
        originCity,
        originCountry,
        creativeDirector,
        foundedYear: Number(foundedYear) || 2024,
        isProprietary: Boolean(isProprietary),
        lookbookBannerUrl,
        secondaryBannerUrl,
        commissionRatePct: Number(commissionRatePct) || 20.0,
        allocatedRegions,
        isActive: Boolean(isActive),
      };
    }

    return apiSuccess(createdBrand, undefined, 201);
  } catch (err) {
    return apiError((err as Error).message || "Failed to create brand", 500);
  }
}

