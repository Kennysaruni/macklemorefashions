"use client";

import React from "react";
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

export default function BrandsDirectoryPage() {
  const { brands, products } = usePlatform();

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F6F5F1]">
      {/* Masthead */}
      <section className="relative border-b border-stone-800 py-14 sm:py-20 overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.06} />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#D4860B] block">
              [ SOVEREIGN BRAND ROSTER // PROPRIETARY &amp; REPRESENTED HOUSES ]
            </span>
            <StaggeredText
              text="THE BRAND DIRECTORY"
              as="h1"
              className="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight mt-2"
            />
            <p className="text-sm text-stone-400 max-w-2xl mt-4 leading-relaxed">
              Macklemore Fashion represents and distributes a curated portfolio
              of global and African luxury houses across West Africa (Lagos,
              Accra), East Africa (Nairobi), North America (Toronto), and
              Europe.
            </p>
          </div>
          <Link
            href="/partnerships"
            className="px-6 py-3.5 bg-[#E31E24] hover:bg-[#D4860B] hover:text-[#0B0B0C] text-white font-mono text-xs font-bold uppercase tracking-widest transition-colors self-start lg:self-auto"
          >
            [ APPLY FOR BRAND REPRESENTATION → ]
          </Link>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-14 space-y-10">
        <TribalSectionSeparator
          label={`ACTIVE PORTFOLIO // ${brands.length} FASHION HOUSES`}
        />

        <div className="grid grid-cols-1 gap-8">
          {brands.map((brand, idx) => {
            const brandProds = products.filter(
              (p) => p.brandSlug === brand.slug || p.brandId === brand.id
            );
            return (
              <article
                key={brand.id}
                className="grid grid-cols-1 lg:grid-cols-12 border border-stone-800 bg-[#101012]"
              >
                <div className="lg:col-span-5">
                  <CurtainReveal delay={idx * 0.05} duration={1.0}>
                    <div className="aspect-[16/10] lg:h-full w-full overflow-hidden border-b lg:border-b-0 lg:border-r border-stone-800">
                      <img
                        src={brand.lookbookBannerUrl}
                        alt={brand.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CurtainReveal>
                </div>

                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase">
                      <span className="text-[#D4860B]">
                        [ ORIGIN: {brand.originCity} ({brand.originCountry}) ]
                      </span>
                      <span
                        className={`px-2.5 py-1 border ${
                          brand.isProprietary
                            ? "border-[#E31E24] text-[#E31E24]"
                            : "border-[#D4860B] text-[#D4860B]"
                        }`}
                      >
                        {brand.isProprietary
                          ? "[ PROPRIETARY FLAGSHIP LABEL ]"
                          : "[ EXCLUSIVE REPRESENTED PARTNER ]"}
                      </span>
                    </div>

                    <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight">
                      {brand.name}
                    </h2>

                    <p className="font-mono text-xs text-stone-300 uppercase tracking-wider">
                      {brand.tagline}
                    </p>

                    <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                      {brand.bio}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                    <div className="space-y-1 text-[10px] text-stone-400 uppercase">
                      <div>
                        [ TERRITORY ALLOCATION:{" "}
                        {brand.allocatedRegions.join(" // ")} ]
                      </div>
                      <div>
                        [ CREATIVE DIRECTOR: {brand.creativeDirector} // EST.{" "}
                        {brand.foundedYear} // {brandProds.length} ACTIVE SKUS ]
                      </div>
                    </div>

                    <Link
                      href={`/brands/${brand.slug}`}
                      className="px-6 py-3 border border-[#D4860B] text-[#D4860B] hover:bg-[#D4860B] hover:text-[#0B0B0C] font-bold uppercase tracking-widest transition-colors text-center shrink-0"
                    >
                      [ ENTER /BRANDS/{brand.slug.toUpperCase()} → ]
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

