"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { usePlatform } from "@/lib/platform-context";
import {
  CurtainImage,
  TextReveal,
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
    (p) => p.brandSlug.toLowerCase() === brand.slug.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1F1A17]">
      {/* Partner Brand Hero */}
      <section className="relative border-b border-[#EADFD0] bg-[#FAF5EE] overflow-hidden py-8 sm:py-12">
        <TribalCornerWatermark position="top-right" opacity={0.05} />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="rounded-lg border border-[#EADFD0] bg-white overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
            {/* Left 7 Columns: Brand Story */}
            <div className="lg:col-span-7 p-6 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EADFD0]">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F2EAE0] text-xs">
                  <Link
                    href="/brands"
                    className="text-[#7A491D] font-medium hover:text-[#E31E24] transition-colors"
                  >
                    ← Back to All Brands
                  </Link>
                  <span className="text-[#7D7065]">
                    Represented by Macklemore Fashion
                  </span>
                </div>

                <div>
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#E31E24] block">
                    {brand.originCity}
                  </span>

                  <TextReveal
                    key={brand.name}
                    text={brand.name}
                    as="h1"
                    className="font-display text-4xl sm:text-6xl font-semibold tracking-tight text-[#1F1A17] mt-1"
                  />
                </div>

                <p className="text-sm sm:text-base font-medium text-[#7A491D]">
                  {brand.tagline}
                </p>

                <p className="text-sm sm:text-base text-[#5C5147] leading-relaxed">
                  {brand.bio}
                </p>

                <div className="p-4 rounded-md border border-[#EADFD0] bg-[#FAF5EE]/60 space-y-1.5">
                  <span className="text-xs font-semibold text-[#7A491D] block">
                    Brand Story &amp; Partnership
                  </span>
                  <p className="text-xs sm:text-sm text-[#5C5147] leading-relaxed">
                    {brand.story}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 mt-8 border-t border-[#F2EAE0] text-xs">
                <div>
                  <span className="text-[#7D7065] block">Creative Direction</span>
                  <span className="text-[#1F1A17] font-semibold mt-0.5 block">
                    {brand.creativeDirector}
                  </span>
                </div>
                <div>
                  <span className="text-[#7D7065] block">Origin</span>
                  <span className="text-[#1F1A17] font-semibold mt-0.5 block">
                    {brand.originCountry} ({brand.foundedYear})
                  </span>
                </div>
                <div>
                  <span className="text-[#7D7065] block">Active Markets</span>
                  <span className="text-[#7A491D] font-semibold mt-0.5 block">
                    {brand.allocatedRegions.join(" · ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Campaign Imagery with CurtainImage */}
            <div className="lg:col-span-5 relative bg-[#FAF5EE] min-h-[420px] overflow-hidden">
              <CurtainImage
                key={brand.lookbookBannerUrl}
                src={brand.lookbookBannerUrl}
                secondarySrc={brand.secondaryBannerUrl}
                alt={`${brand.name} Campaign`}
                aspectClass="h-full w-full min-h-[420px]"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
                className="!absolute inset-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Catalog Section */}
      <section className="py-14 sm:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
                {brand.name} Collection
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1F1A17] mt-1">
                Available Pieces ({brandProducts.length})
              </h2>
            </div>

            <Link
              href="/shop"
              className="px-5 py-2.5 rounded-md border border-[#D4B895] bg-white text-xs font-medium text-[#1F1A17] hover:bg-[#1F1A17] hover:text-white transition-colors"
            >
              Browse Full Catalog →
            </Link>
          </div>

          <TribalSectionSeparator
            label={`Curated & Distributed by Macklemore Fashion`}
            className="my-6"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {brandProducts.map((product, idx) => (
              <EditorialProductCard
                key={product.id}
                product={product}
                theme="light"
                index={idx}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
