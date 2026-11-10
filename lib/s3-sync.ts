import { prisma } from "@/lib/prisma";
import { putS3Object } from "@/lib/s3-storage";

export async function syncLiveCatalogToNeonS3(): Promise<void> {
  try {
    const [brands, collections, products] = await Promise.all([
      prisma.brand.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.collection.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.product.findMany({
        include: { variants: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const snapshot = {
      updatedAt: new Date().toISOString(),
      counts: {
        brands: brands.length,
        collections: collections.length,
        products: products.length,
      },
      brands,
      collections,
      products,
    };

    await putS3Object({
      bucket: "uploads",
      key: "catalog/macklemore-catalog-live.json",
      body: JSON.stringify(snapshot, null, 2),
      contentType: "application/json",
    });
  } catch {
    // Non-blocking background sync to S3
  }
}

