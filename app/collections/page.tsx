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
import { EditorialProductCard } from "@/components/commerce/EditorialProductCard";

export default function CollectionsPage() {
  const { collections, products } = usePlatform();

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F6F5F1]">
      {/* Masthead */}
      <section className="relative border-b border-stone-800 py-14 sm:py-20 overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.06} />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#D4860B] block">
            [ SEASONAL LOOKBOOKS &amp; LIMITED CAPSULE RELEASES ]
          </span>
          <StaggeredText
            text="CURATED DROPS & ARCHIVES"
            as="h1"
            className="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight mt-2"
          />
          <p className="text-sm text-stone-400 max-w-2xl mt-4 leading-relaxed">
            Each Macklemore Fashion and partner capsule is produced in strictly
            numbered allocations, split across Hub A (Victoria Island, Lagos)
            and Hub B (Toronto) for simultaneous trans-Atlantic release.
          </p>
        </div>
      </section>

      {/* Collections Feed */}
      <div className="divide-y divide-stone-800">
        {collections.map((col, idx) => {
          const colProducts = products.filter(
            (p) => p.collectionSlug === col.slug
          );

          return (
            <section
              key={col.id}
              className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 space-y-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 border border-stone-800 bg-[#101012]">
                <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-800">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase">
                      <span className="text-[#D4860B]">{col.seasonCode}</span>
                      <span
                        className={`px-2.5 py-1 border ${
                          col.isDropLive
                            ? "border-[#E31E24] bg-[#E31E24]/15 text-[#E31E24]"
                            : "border-[#D4860B] bg-[#D4860B]/15 text-[#D4860B]"
                        }`}
                      >
                        {col.isDropLive
                          ? "[ STATUS: DROP LIVE ]"
                          : "[ STATUS: VIP COUNTDOWN LOCKED ]"}
                      </span>
                    </div>

                    <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight">
                      {col.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      {col.manifesto}
                    </p>
                  </div>

                  <div className="pt-8 mt-8 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs uppercase">
                    <span className="text-stone-400">
                      [ HOUSE: {col.brandName} // {colProducts.length} SKUS ]
                    </span>
                    <Link
                      href="/shop"
                      className="px-5 py-2.5 bg-[#E31E24] hover:bg-[#D4860B] hover:text-[#0B0B0C] text-white font-bold tracking-widest transition-colors"
                    >
                      [ ACQUIRE CAPSULE → ]
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <CurtainReveal delay={idx * 0.05} duration={1.05}>
                    <div className="aspect-[16/10] w-full h-full overflow-hidden">
                      <img
                        src={col.heroImageUrl}
                        alt={col.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CurtainReveal>
                </div>
              </div>

              {colProducts.length > 0 && (
                <>
                  <TribalSectionSeparator
                    label={`${col.title} // LOOKBOOK PIECES`}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {colProducts.map((prod, pIdx) => (
                      <EditorialProductCard
                        key={prod.id}
                        product={prod}
                        theme="dark"
                        index={pIdx}
                      />
                    ))}
                  </div>
                </>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

