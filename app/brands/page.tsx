"use client";

import React from "react";
import Link from "next/link";
import { usePlatform } from "@/lib/platform-context";
import { CurtainReveal, StaggeredText } from "@/components/motion/MotionPrimitives";
import {
  TribalCornerWatermark,
  TribalSectionSeparator,
} from "@/components/vectors/TribalVectors";

export default function BrandsDirectoryPage() {
  const { brands, products } = usePlatform();

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1F1A17]">
      {/* Header */}
      <section className="relative border-b border-[#EADFD0] bg-[#FAF5EE] px-4 sm:px-8 py-12 sm:py-16 overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.05} />
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
              Represented &amp; Partner Houses
            </span>
            <StaggeredText
              text="Our Brands"
              as="h1"
              className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-[#1F1A17]"
            />
            <p className="text-sm sm:text-base text-[#5C5147] max-w-2xl leading-relaxed">
              Macklemore Fashion represents a curated portfolio of international and African fashion brands, supporting their collections in reaching customers across West Africa, East Africa, and global markets.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/partnerships"
              className="px-6 py-3 rounded-md bg-[#1F1A17] hover:bg-[#E31E24] text-white text-xs sm:text-sm font-medium transition-colors shadow-xs"
            >
              Partner With Us →
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Cards */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-10">
        {brands.map((brand, idx) => {
          const brandProducts = products.filter(
            (p) => p.brandSlug === brand.slug
          );

          return (
            <div
              key={brand.id}
              className="group rounded-lg border border-[#EADFD0] bg-white grid grid-cols-1 lg:grid-cols-12 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#D4B895]"
            >
              {/* Left 5 Columns: Lookbook Visual */}
              <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#EADFD0] relative bg-[#FAF5EE] min-h-[320px] overflow-hidden">
                <CurtainReveal
                  delay={idx * 0.05}
                  duration={0.9}
                  className="w-full h-full"
                >
                  <img
                    src={brand.lookbookBannerUrl}
                    alt={brand.name}
                    className="w-full h-full object-cover object-center min-h-[320px] scale-100 group-hover:scale-[1.03] transition-transform duration-700"
                  />
                </CurtainReveal>
                <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-[#FFFDF9]/90 backdrop-blur-xs border border-[#EADFD0] text-xs font-medium text-[#7A491D]">
                  {brand.isProprietary
                    ? "Flagship House"
                    : "Represented Partner Brand"}
                </div>
              </div>

              {/* Right 7 Columns: Brand Story & Link */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#7D7065]">
                    <span className="text-[#7A491D] font-medium">
                      {brand.originCity}
                    </span>
                    <span>
                      Est. {brand.foundedYear} · {brandProducts.length} Pieces Available
                    </span>
                  </div>

                  <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1F1A17]">
                    {brand.name}
                  </h2>

                  <p className="text-sm font-medium text-[#7A491D]">
                    {brand.tagline}
                  </p>

                  <p className="text-sm text-[#5C5147] leading-relaxed">
                    {brand.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F2EAE0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-[#6E6359] space-y-1">
                    <div>
                      <strong className="text-[#1F1A17]">Creative Direction:</strong>{" "}
                      {brand.creativeDirector}
                    </div>
                    <div>
                      <strong className="text-[#1F1A17]">Markets:</strong>{" "}
                      {brand.allocatedRegions.join(" · ")}
                    </div>
                  </div>

                  <Link
                    href={`/brands/${brand.slug}`}
                    className="px-6 py-3 rounded-md bg-[#1F1A17] hover:bg-[#E31E24] text-white text-xs font-medium transition-colors text-center shrink-0 shadow-2xs"
                  >
                    Explore {brand.name} →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        <TribalSectionSeparator label="International Curation · African Market Reach" />
      </section>
    </div>
  );
}
