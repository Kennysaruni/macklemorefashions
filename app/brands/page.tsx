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
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111]">
      {/* Header */}
      <section className="relative border-b border-[#E5E0D8] bg-white px-4 sm:px-8 py-14 sm:py-20 overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.05} className="text-[#7A491D]" />
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-[#7A491D] font-semibold block">
              THE COLLECTIVE BRAND DIRECTORY // REPRESENTED FASHION HOUSES
            </span>
            <StaggeredText
              text="THE CONTINENTAL BRAND ROSTER"
              as="h1"
              className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[0.98] text-[#111111]"
            />
            <p className="text-sm sm:text-base text-[#4A4742] max-w-2xl leading-relaxed">
              Macklemore Fashion operates as both a flagship creative label and the premier distribution &amp; representation house for contemporary luxury and streetwear labels across West Africa, East Africa (254), North America, and Europe.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/partnerships"
              className="px-6 py-3.5 bg-[#111111] hover:bg-[#E31E24] text-white font-mono text-xs uppercase tracking-[0.2em] font-bold transition-colors"
            >
              APPLY FOR REPRESENTATION →
            </Link>
            <Link
              href="/admin"
              className="px-5 py-3.5 border border-[#111111] bg-white hover:bg-[#111111] hover:text-white font-mono text-xs uppercase tracking-[0.18em] text-[#111111] transition-colors"
            >
              ONBOARD BRAND IN /ADMIN
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Roster Cards */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-12">
        {brands.map((brand, idx) => {
          const brandProducts = products.filter(
            (p) => p.brandSlug === brand.slug
          );

          return (
            <div
              key={brand.id}
              className="border border-[#E5E0D8] bg-white grid grid-cols-1 lg:grid-cols-12 overflow-hidden"
            >
              {/* Left 5 Columns: Lookbook Visual */}
              <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#E5E0D8] relative bg-[#F3EFEA] min-h-[340px]">
                <CurtainReveal
                  delay={idx * 0.06}
                  duration={1.0}
                  className="w-full h-full"
                >
                  <img
                    src={brand.lookbookBannerUrl}
                    alt={brand.name}
                    className="w-full h-full object-cover object-center min-h-[340px]"
                  />
                </CurtainReveal>
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/95 border border-[#E5E0D8] font-mono text-[10px] tracking-widest uppercase text-[#7A491D] font-semibold">
                  {brand.isProprietary
                    ? "FLAGSHIP PROPRIETARY LABEL"
                    : "REPRESENTED PARTNER HOUSE"}
                </div>
              </div>

              {/* Right 7 Columns: Dossier & Microsite Entry */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E0D8] pb-3 font-mono text-[10px] uppercase">
                    <span className="text-[#7A491D] font-semibold">
                      ORIGIN: {brand.originCity} ({brand.originCountry})
                    </span>
                    <span className="text-[#6E6A63]">
                      EST. {brand.foundedYear} · {brandProducts.length} ACTIVE SKUS
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#111111]">
                      {brand.name}
                    </h2>
                    <span className="font-mono text-xs text-[#E31E24] font-semibold uppercase">
                      /brands/{brand.slug}
                    </span>
                  </div>

                  <p className="font-mono text-xs text-[#7A491D] font-semibold uppercase tracking-wider">
                    {brand.tagline}
                  </p>

                  <p className="text-sm text-[#4A4742] leading-relaxed">
                    {brand.bio}
                  </p>

                  <p className="text-xs text-[#6E6A63] leading-relaxed">
                    {brand.story}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E5E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="font-mono text-[10px] text-[#6E6A63] uppercase space-y-1">
                    <div>
                      CREATIVE DIRECTOR:{" "}
                      <span className="text-[#111111] font-semibold">
                        {brand.creativeDirector}
                      </span>
                    </div>
                    <div>
                      DISTRIBUTION CORRIDORS:{" "}
                      <span className="text-[#7A491D] font-semibold">
                        {brand.allocatedRegions.join(" · ")}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/brands/${brand.slug}`}
                    className="px-6 py-3.5 bg-[#111111] hover:bg-[#E31E24] text-white font-mono text-xs tracking-[0.2em] uppercase font-bold transition-colors text-center shrink-0"
                  >
                    ENTER {brand.name} BOUTIQUE →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        <TribalSectionSeparator
          label="CONTINENTAL DISTRIBUTION & REPRESENTATION"
          theme="light"
        />
      </section>
    </div>
  );
}
