"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { usePlatform } from "@/lib/platform-context";
import { CurtainReveal, StaggeredText } from "@/components/motion/MotionPrimitives";
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
    (p) => p.brandSlug.toLowerCase() === brand.slug.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111]">
      {/* Partner Brand Microsite Hero */}
      <section className="relative border-b border-[#E5E0D8] bg-white overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.05} className="text-[#7A491D]" />

        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12">
          {/* Left 7 Columns: Brand Story & Architectural Identity */}
          <div className="lg:col-span-7 p-6 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E5E0D8] bg-[#FAF9F6]">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E0D8] pb-4 font-mono text-[10px] uppercase">
                <Link
                  href="/brands"
                  className="text-[#7A491D] font-semibold hover:text-[#E31E24] transition-colors"
                >
                  ← BACK TO BRAND DIRECTORY
                </Link>
                <span className="text-[#6E6A63]">
                  REPRESENTED BY MACKLEMORE FASHION
                </span>
              </div>

              <div>
                <span className="font-mono text-xs tracking-[0.22em] uppercase text-[#E31E24] font-semibold block">
                  {brand.isProprietary
                    ? "PROPRIETARY HOUSE MICROSITE"
                    : "OFFICIAL PARTNER BRAND BOUTIQUE"}{" "}
                  // {brand.originCity}
                </span>

                <StaggeredText
                  text={brand.name}
                  as="h1"
                  className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-[#111111] mt-2"
                />
              </div>

              <p className="font-mono text-xs sm:text-sm uppercase tracking-wider text-[#7A491D] font-semibold">
                {brand.tagline}
              </p>

              <p className="text-sm sm:text-base text-[#4A4742] leading-relaxed">
                {brand.bio}
              </p>

              <div className="p-5 border border-[#E5E0D8] bg-white space-y-2">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#7A491D] font-semibold block">
                  THE HOUSE MANIFESTO &amp; AFRICAN DISTRIBUTION BRIDGE
                </span>
                <p className="text-xs sm:text-sm text-[#4A4742] leading-relaxed">
                  {brand.story}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8 mt-8 border-t border-[#E5E0D8] font-mono text-xs">
              <div>
                <span className="text-[10px] text-[#6E6A63] block">
                  CREATIVE DIRECTOR
                </span>
                <span className="text-[#111111] font-bold uppercase mt-0.5 block">
                  {brand.creativeDirector}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#6E6A63] block">
                  ORIGIN &amp; FOUNDED
                </span>
                <span className="text-[#111111] font-bold uppercase mt-0.5 block">
                  {brand.originCountry} ({brand.foundedYear})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#6E6A63] block">
                  FULFILLMENT NODES
                </span>
                <span className="text-[#7A491D] font-bold uppercase mt-0.5 block">
                  LAGOS · NAIROBI · TORONTO
                </span>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Campaign Imagery */}
          <div className="lg:col-span-5 relative bg-[#F3EFEA] min-h-[440px]">
            <CurtainReveal duration={1.05} className="w-full h-full">
              <img
                src={brand.lookbookBannerUrl}
                alt={`${brand.name} Campaign`}
                className="w-full h-full object-cover object-center min-h-[440px]"
              />
            </CurtainReveal>
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-xs border border-[#E5E0D8] font-mono text-[10px] uppercase flex items-center justify-between text-[#111111]">
              <span>TERRITORIES: {brand.allocatedRegions.join(" · ")}</span>
              <span className="text-[#2E6B35] font-semibold">● ACTIVE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Catalog Section */}
      <section className="bg-[#FAF9F6] text-[#111111] py-16 sm:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
            <div>
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#7A491D] font-semibold block">
                {brand.name} OFFICIAL BOUTIQUE ARCHIVE
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#111111] mt-1">
                CURRENT SEASON ALLOCATION ({brandProducts.length} PIECES)
              </h2>
            </div>

            <Link
              href="/shop"
              className="px-5 py-2.5 border border-[#111111] bg-white font-mono text-xs uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-colors"
            >
              VIEW ALL BRANDS IN /SHOP →
            </Link>
          </div>

          <TribalSectionSeparator
            label={`AUTHENTICATED & FULFILLED BY MACKLEMORE FASHION (${brand.name})`}
            theme="light"
            className="my-6"
          />

          {brandProducts.length === 0 ? (
            <div className="p-12 border border-[#E5E0D8] bg-white text-center space-y-4">
              <p className="font-mono text-xs uppercase text-[#6E6A63]">
                NEW SEASON SKUS FOR {brand.name} ARE CURRENTLY IN BONDED CUSTOMS CLEARANCE.
              </p>
              <Link
                href="/admin"
                className="inline-block px-6 py-3 bg-[#111111] text-white font-mono text-xs uppercase tracking-widest hover:bg-[#E31E24]"
              >
                ADD SKUS FOR {brand.name} IN /ADMIN
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {brandProducts.map((product, idx) => (
                <EditorialProductCard
                  key={product.id}
                  product={product}
                  theme="light"
                  index={idx}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
