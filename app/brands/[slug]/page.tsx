"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { usePlatform } from "@/lib/platform-context";
import {
  CurtainReveal,
  StaggeredText,
} from "@/components/motion/MotionPrimitives";
import {
  TribalCornerWatermark,
  TribalSectionSeparator,
} from "@/components/vectors/TribalVectors";
import { EditorialProductCard } from "@/components/commerce/EditorialProductCard";

export default function PartnerBrandMicrositePage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "luca";
  const { brands, products } = usePlatform();

  const brand =
    brands.find((b) => b.slug.toLowerCase() === slug.toLowerCase()) ||
    brands.find((b) => b.slug === "luca") ||
    brands[0];

  const brandProducts = products.filter(
    (p) =>
      p.brandSlug.toLowerCase() === brand.slug.toLowerCase() ||
      p.brandId === brand.id
  );

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F6F5F1]">
      {/* Partner Brand Microsite Hero */}
      <section className="relative border-b border-stone-800 overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.07} />

        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-6 p-6 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-800">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
                <Link
                  href="/brands"
                  className="px-2.5 py-1 border border-stone-800 text-stone-400 hover:border-[#D4860B] hover:text-white"
                >
                  [ ← ALL BRANDS ]
                </Link>
                <span className="px-2.5 py-1 border border-[#E31E24] text-[#E31E24]">
                  [ OFFICIAL PARTNER MICROSITE // /BRANDS/{brand.slug.toUpperCase()} ]
                </span>
              </div>

              <StaggeredText
                text={brand.name}
                as="h1"
                className="font-display text-4xl sm:text-6xl xl:text-7xl font-bold uppercase tracking-tight leading-none"
              />

              <p className="font-mono text-xs sm:text-sm text-[#D4860B] uppercase tracking-wider">
                {brand.tagline}
              </p>

              <p className="text-sm text-stone-300 leading-relaxed">
                {brand.story}
              </p>
            </div>

            <div className="pt-10 mt-10 border-t border-stone-800 grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3 border border-stone-800 bg-[#101012]">
                <span className="text-[9px] text-[#D4860B] uppercase block">
                  [ ORIGIN ]
                </span>
                <span className="font-bold mt-1 block">{brand.originCity}</span>
              </div>
              <div className="p-3 border border-stone-800 bg-[#101012]">
                <span className="text-[9px] text-[#D4860B] uppercase block">
                  [ DIRECTOR ]
                </span>
                <span className="font-bold mt-1 block truncate">
                  {brand.creativeDirector}
                </span>
              </div>
              <div className="p-3 border border-stone-800 bg-[#101012] col-span-2 sm:col-span-1">
                <span className="text-[9px] text-[#D4860B] uppercase block">
                  [ DISTRIBUTION ]
                </span>
                <span className="font-bold mt-1 block">
                  MACKLEMORE HUB A &amp; B
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <CurtainReveal duration={1.1} className="h-full">
              <div className="relative h-[440px] lg:h-full min-h-[480px] w-full overflow-hidden">
                <img
                  src={brand.lookbookBannerUrl}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-black/20" />
                <div className="absolute bottom-6 left-6 right-6 p-4 border border-stone-800 bg-[#0B0B0C]/90 font-mono text-[10px] uppercase flex items-center justify-between">
                  <span className="text-[#D4860B]">
                    [ TERRITORIES: {brand.allocatedRegions.join(" · ")} ]
                  </span>
                  <span className="text-stone-300">
                    [ VERIFIED MACKLEMORE REPRESENTATION ]
                  </span>
                </div>
              </div>
            </CurtainReveal>
          </div>
        </div>
      </section>

      {/* Partner Brand Catalog Matrix */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 space-y-10">
        <TribalSectionSeparator
          label={`${brand.name} // OFFICIAL CATALOG ALLOCATION (${brandProducts.length} SKUS)`}
        />

        {brandProducts.length === 0 ? (
          <div className="p-12 border border-stone-800 bg-[#101012] text-center space-y-4 font-mono">
            <p className="text-xs text-stone-400 uppercase">
              [ NEW PARTNER HOUSE ONBOARDED // SEASONAL SKU ALLOCATION IN
              PREPARATION ]
            </p>
            <Link
              href="/admin"
              className="inline-block px-6 py-3 border border-[#D4860B] text-[#D4860B] text-xs uppercase"
            >
              [ ASSIGN SKUS IN /ADMIN CONSOLE → ]
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandProducts.map((product, idx) => (
              <EditorialProductCard
                key={product.id}
                product={product}
                theme="dark"
                index={idx}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

