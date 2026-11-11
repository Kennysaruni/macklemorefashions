import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import {
  INITIAL_B2B_INQUIRIES,
  INITIAL_BRANDS,
  INITIAL_COLLECTIONS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  CURRENCIES,
} from "../lib/store-data";
import { putS3Object } from "../lib/s3-storage";

const prisma = new PrismaClient();

interface S3ManifestEntry {
  s3Key: string;
  storageUrl: string;
  bytes: number;
  contentType: string;
}

interface S3Manifest {
  migratedAt: string;
  bucket: string;
  totalImagesMigrated: number;
  urlMapping: Record<string, S3ManifestEntry>;
}

async function main() {
  console.log("🚀 Starting Macklemore Fashion Neon PostgreSQL + Neon S3 Seed...");

  // 1. Load S3 Image Manifest and ensure any remaining URLs are uploaded
  const manifestPath = path.join(process.cwd(), "lib", "s3-image-manifest.json");
  let manifest: S3Manifest = {
    migratedAt: new Date().toISOString(),
    bucket: "uploads",
    totalImagesMigrated: 0,
    urlMapping: {},
  };

  if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  }

  const extraUrls = [
    {
      url: "https://macklemorefashions.com/wp-content/uploads/2025/05/Torontofw1.jpg",
      key: "macklemore/2025/05/Torontofw1.jpg",
    },
    {
      url: "https://macklemorefashions.com/wp-content/uploads/2025/05/Micah-sewing-.jpg",
      key: "macklemore/2025/05/Micah-sewing-.jpg",
    },
    {
      url: "https://macklemorefashions.com/wp-content/uploads/2025/04/dejiandkola_africa_1712608765_3341927002288432016_30014923707.jpg",
      key: "macklemore/2025/04/dejiandkola_africa_1712608765_3341927002288432016_30014923707.jpg",
    },
  ];

  for (const item of extraUrls) {
    if (!manifest.urlMapping[item.url]) {
      try {
        const resp = await fetch(item.url);
        if (resp.ok) {
          const buf = Buffer.from(await resp.arrayBuffer());
          const contentType = resp.headers.get("content-type") || "image/jpeg";
          const res = await putS3Object({
            bucket: "uploads",
            key: item.key,
            body: buf,
            contentType,
          });
          manifest.urlMapping[item.url] = {
            s3Key: res.key,
            storageUrl: res.storageUrl,
            bytes: res.size,
            contentType,
          };
          console.log(`✓ Uploaded missing asset to S3: ${res.key}`);
        }
      } catch (err) {
        console.warn(`⚠ Could not upload ${item.url}:`, (err as Error).message);
      }
    }
  }

  manifest.totalImagesMigrated = Object.keys(manifest.urlMapping).length;
  manifest.migratedAt = new Date().toISOString();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  // 2. Seed SuperAdmin User
  const adminEmail = (
    process.env.ADMIN_INITIAL_EMAIL || "admin@macklemorefashions.com"
  )
    .trim()
    .toLowerCase();
  const adminPassword =
    process.env.ADMIN_INITIAL_PASSWORD || "Macklemore2026#";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "Micah Elechi (Macklemore Executive)",
      role: "SUPER_ADMIN",
    },
    create: {
      email: adminEmail,
      name: "Micah Elechi (Macklemore Executive)",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log(`✓ Seeded AdminUser (${adminEmail})`);

  // 3. Seed Brands
  for (const brand of INITIAL_BRANDS) {
    await prisma.brand.upsert({
      where: { id: brand.id },
      update: {
        slug: brand.slug,
        name: brand.name,
        tagline: brand.tagline,
        bio: brand.bio,
        story: brand.story,
        originCity: brand.originCity,
        originCountry: brand.originCountry,
        creativeDirector: brand.creativeDirector,
        foundedYear: brand.foundedYear,
        isProprietary: brand.isProprietary,
        lookbookBannerUrl: brand.lookbookBannerUrl,
        secondaryBannerUrl: brand.secondaryBannerUrl,
        commissionRatePct: brand.commissionRatePct,
        allocatedRegions: brand.allocatedRegions,
        isActive: brand.isActive,
      },
      create: {
        id: brand.id,
        slug: brand.slug,
        name: brand.name,
        tagline: brand.tagline,
        bio: brand.bio,
        story: brand.story,
        originCity: brand.originCity,
        originCountry: brand.originCountry,
        creativeDirector: brand.creativeDirector,
        foundedYear: brand.foundedYear,
        isProprietary: brand.isProprietary,
        lookbookBannerUrl: brand.lookbookBannerUrl,
        secondaryBannerUrl: brand.secondaryBannerUrl,
        commissionRatePct: brand.commissionRatePct,
        allocatedRegions: brand.allocatedRegions,
        isActive: brand.isActive,
      },
    });
  }
  console.log(`✓ Seeded ${INITIAL_BRANDS.length} Brands`);

  // 4. Seed Collections
  for (const col of INITIAL_COLLECTIONS) {
    await prisma.collection.upsert({
      where: { id: col.id },
      update: {
        slug: col.slug,
        title: col.title,
        seasonCode: col.seasonCode,
        manifesto: col.manifesto,
        heroImageUrl: col.heroImageUrl,
        releaseDate: col.releaseDate,
        isDropLive: col.isDropLive,
        isVipLocked: col.isVipLocked,
        brandId: col.brandId,
        brandName: col.brandName,
      },
      create: {
        id: col.id,
        slug: col.slug,
        title: col.title,
        seasonCode: col.seasonCode,
        manifesto: col.manifesto,
        heroImageUrl: col.heroImageUrl,
        releaseDate: col.releaseDate,
        isDropLive: col.isDropLive,
        isVipLocked: col.isVipLocked,
        brandId: col.brandId,
        brandName: col.brandName,
      },
    });
  }
  console.log(`✓ Seeded ${INITIAL_COLLECTIONS.length} Collections`);

  // 5. Seed Products & Variants (with Neon S3 Object Storage keys)
  for (const prod of INITIAL_PRODUCTS) {
    const s3Editorial = manifest.urlMapping[prod.editorialImageUrl];
    const s3Flatlay = manifest.urlMapping[prod.flatlayImageUrl];

    await prisma.product.upsert({
      where: { id: prod.id },
      update: {
        slug: prod.slug,
        skuPrefix: prod.skuPrefix,
        title: prod.title,
        subtitle: prod.subtitle,
        description: prod.description,
        gender: prod.gender,
        category: prod.category,
        fabricWeightGsm: prod.fabricWeightGsm,
        fabricComposition: prod.fabricComposition,
        originLabel: prod.originLabel,
        basePriceCad: prod.basePriceCad,
        priceRangeLabel: prod.priceRangeLabel || null,
        editorialImageUrl: prod.editorialImageUrl,
        flatlayImageUrl: prod.flatlayImageUrl,
        s3EditorialKey: s3Editorial?.s3Key || null,
        s3FlatlayKey: s3Flatlay?.s3Key || null,
        colorName: prod.colorName,
        colorHex: prod.colorHex,
        isFeatured: prod.isFeatured,
        isActive: true,
        brandId: prod.brandId,
        brandSlug: prod.brandSlug,
        brandName: prod.brandName,
        collectionSlug: prod.collectionSlug,
      },
      create: {
        id: prod.id,
        slug: prod.slug,
        skuPrefix: prod.skuPrefix,
        title: prod.title,
        subtitle: prod.subtitle,
        description: prod.description,
        gender: prod.gender,
        category: prod.category,
        fabricWeightGsm: prod.fabricWeightGsm,
        fabricComposition: prod.fabricComposition,
        originLabel: prod.originLabel,
        basePriceCad: prod.basePriceCad,
        priceRangeLabel: prod.priceRangeLabel || null,
        editorialImageUrl: prod.editorialImageUrl,
        flatlayImageUrl: prod.flatlayImageUrl,
        s3EditorialKey: s3Editorial?.s3Key || null,
        s3FlatlayKey: s3Flatlay?.s3Key || null,
        colorName: prod.colorName,
        colorHex: prod.colorHex,
        isFeatured: prod.isFeatured,
        isActive: true,
        brandId: prod.brandId,
        brandSlug: prod.brandSlug,
        brandName: prod.brandName,
        collectionSlug: prod.collectionSlug,
      },
    });

    for (const v of prod.variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          productId: prod.id,
          size: v.size,
          hubALagos: v.hubALagos,
          hubBToronto: v.hubBToronto,
        },
        create: {
          productId: prod.id,
          size: v.size,
          sku: v.sku,
          hubALagos: v.hubALagos,
          hubBToronto: v.hubBToronto,
        },
      });
    }
  }
  console.log(
    `✓ Seeded ${INITIAL_PRODUCTS.length} Products & ${INITIAL_PRODUCTS.reduce(
      (s, p) => s + p.variants.length,
      0
    )} Warehouse Variants`
  );

  // 6. Seed Orders & OrderItems
  for (const ord of INITIAL_ORDERS) {
    const rateToCad = CURRENCIES[ord.currency]?.rateFromCad || 1;
    const totalAmountCad = Math.round(ord.totalAmount / rateToCad);

    await prisma.order.upsert({
      where: { id: ord.id },
      update: {
        orderNumber: ord.orderNumber,
        customerName: ord.customerName,
        customerEmail: ord.customerEmail,
        customerPhone: ord.customerPhone,
        destinationCountry: ord.destinationCountry,
        destinationCity: ord.destinationCity,
        currency: ord.currency,
        subtotalAmount: ord.subtotalAmount,
        shippingAmount: ord.shippingAmount,
        dutiesAmount: ord.dutiesAmount,
        totalAmount: ord.totalAmount,
        totalAmountCad,
        assignedHub: ord.assignedHub,
        courierPartner: ord.courierPartner,
        waybillNumber: ord.waybillNumber || null,
        status: ord.status,
        paymentProvider: ord.paymentProvider,
        paymentReference: ord.paymentReference,
        paymentStatus: ord.paymentStatus,
      },
      create: {
        id: ord.id,
        orderNumber: ord.orderNumber,
        customerName: ord.customerName,
        customerEmail: ord.customerEmail,
        customerPhone: ord.customerPhone,
        destinationCountry: ord.destinationCountry,
        destinationCity: ord.destinationCity,
        currency: ord.currency,
        subtotalAmount: ord.subtotalAmount,
        shippingAmount: ord.shippingAmount,
        dutiesAmount: ord.dutiesAmount,
        totalAmount: ord.totalAmount,
        totalAmountCad,
        assignedHub: ord.assignedHub,
        courierPartner: ord.courierPartner,
        waybillNumber: ord.waybillNumber || null,
        status: ord.status,
        paymentProvider: ord.paymentProvider,
        paymentReference: ord.paymentReference,
        paymentStatus: ord.paymentStatus,
        createdAt: new Date(ord.createdAt),
      },
    });

    await prisma.orderItem.deleteMany({ where: { orderId: ord.id } });
    for (const item of ord.items) {
      await prisma.orderItem.create({
        data: {
          orderId: ord.id,
          productId: item.productId,
          productTitle: item.productTitle,
          brandName: item.brandName,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        },
      });
    }
  }
  console.log(`✓ Seeded ${INITIAL_ORDERS.length} Orders (Stripe & Paystack)`);

  // 7. Seed B2B Inquiries
  for (const b2b of INITIAL_B2B_INQUIRIES) {
    await prisma.b2BInquiry.upsert({
      where: { id: b2b.id },
      update: {
        referenceCode: b2b.referenceCode,
        channel: b2b.channel,
        brandOrCompanyName: b2b.brandOrCompanyName,
        contactName: b2b.contactName,
        contactRole: b2b.contactRole,
        email: b2b.email,
        phone: b2b.phone,
        headquartersCountry: b2b.headquartersCountry,
        websiteUrl: b2b.websiteUrl,
        targetRegions: b2b.targetRegions,
        annualVolumeTier: b2b.annualVolumeTier,
        message: b2b.message,
        status: b2b.status,
        assignedExecutive: b2b.assignedExecutive,
      },
      create: {
        id: b2b.id,
        referenceCode: b2b.referenceCode,
        channel: b2b.channel,
        brandOrCompanyName: b2b.brandOrCompanyName,
        contactName: b2b.contactName,
        contactRole: b2b.contactRole,
        email: b2b.email,
        phone: b2b.phone,
        headquartersCountry: b2b.headquartersCountry,
        websiteUrl: b2b.websiteUrl,
        targetRegions: b2b.targetRegions,
        annualVolumeTier: b2b.annualVolumeTier,
        message: b2b.message,
        status: b2b.status,
        assignedExecutive: b2b.assignedExecutive,
        createdAt: new Date(b2b.createdAt),
      },
    });
  }
  console.log(`✓ Seeded ${INITIAL_B2B_INQUIRIES.length} B2B Inquiries`);

  // 8. Upload full catalog JSON archive to Neon S3 bucket ("uploads")
  const fullCatalogArchive = {
    exportedAt: new Date().toISOString(),
    sourceWebsite: "https://macklemorefashions.com",
    storageBucket: "uploads",
    hubs: [
      { id: "HUB_A_LAGOS", label: "Nigeria Operations Hub" },
      { id: "HUB_B_TORONTO", label: "Toronto, Canada Corporate HQ" },
    ],
    paymentGateways: ["STRIPE", "PAYSTACK"],
    currencies: CURRENCIES,
    brands: INITIAL_BRANDS,
    collections: INITIAL_COLLECTIONS,
    products: INITIAL_PRODUCTS.map((p) => ({
      ...p,
      s3Editorial: manifest.urlMapping[p.editorialImageUrl] || null,
      s3Flatlay: manifest.urlMapping[p.flatlayImageUrl] || null,
    })),
    orders: INITIAL_ORDERS,
    b2bInquiries: INITIAL_B2B_INQUIRIES,
    s3ImageManifest: manifest,
  };

  const archiveBuffer = Buffer.from(
    JSON.stringify(fullCatalogArchive, null, 2),
    "utf8"
  );
  await putS3Object({
    bucket: "uploads",
    key: "catalog/macklemore-full-database-seed.json",
    body: archiveBuffer,
    contentType: "application/json",
  });
  await putS3Object({
    bucket: "uploads",
    key: "catalog/macklemore-catalog-live.json",
    body: archiveBuffer,
    contentType: "application/json",
  });
  console.log(
    `✓ Uploaded complete catalog JSON archive (${(
      archiveBuffer.byteLength / 1024
    ).toFixed(1)} KB) to Neon S3 bucket "uploads/catalog/"`
  );

  console.log("✅ Neon PostgreSQL + Neon S3 Seed Complete!");
}

main()
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
