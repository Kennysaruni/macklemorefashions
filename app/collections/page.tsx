"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePlatform } from "@/lib/platform-context";
import { CurtainReveal, StaggeredText } from "@/components/motion/MotionPrimitives";
import {
  TribalCornerWatermark,
  TribalSectionSeparator,
} from "@/components/vectors/TribalVectors";
import { EditorialProductCard } from "@/components/commerce/EditorialProductCard";

export default function CollectionsPage() {
  const { collections, products } = usePlatform();
  const [selectedSlug, setSelectedSlug] = useState<string>("ALL");

  const activeCollection =
    selectedSlug === "ALL"
      ? null
      : collections.find((c) => c.slug === selectedSlug);

  const displayedProducts =
    selectedSlug === "ALL"
      ? products
      : products.filter((p) => p.collectionSlug === selectedSlug);

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1F1A17]">
      {/* Page Header */}
      <section className="relative border-b border-[#EADFD0] bg-[#FAF5EE] px-4 sm:px-8 py-12 sm:py-16 overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.05} />
        <div className="max-w-[1440px] mx-auto space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
            New Arrivals &amp; Featured Collections
          </span>
          <StaggeredText
            text="Seasonal Campaigns & Capsules"
            as="h1"
            className="font-display text-3xl sm:text-5xl font-semibold tracking-tight max-w-3xl text-[#1F1A17]"
          />
          <p className="text-sm sm:text-base text-[#5C5147] max-w-2xl leading-relaxed">
            Explore our latest seasonal collections, signature lounge sets, and collaborative releases from Macklemore Fashion, LUCA, and partner labels.
          </p>
        </div>
      </section>

      {/* Collection Cards */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {collections.map((col, idx) => {
            const isSelected = selectedSlug === col.slug;
            const colProducts = products.filter(
              (p) => p.collectionSlug === col.slug
            );

            return (
              <div
                key={col.id}
                className={`group rounded-lg overflow-hidden border transition-all duration-300 flex flex-col justify-between bg-white ${
                  isSelected
                    ? "border-[#E31E24] shadow-md"
                    : "border-[#EADFD0] hover:-translate-y-1 hover:shadow-lg hover:border-[#D4B895]"
                }`}
              >
                <div>
                  <CurtainReveal delay={idx * 0.06} duration={0.9}>
                    <div className="aspect-[16/9] relative overflow-hidden bg-[#FAF5EE]">
                      <img
                        src={col.heroImageUrl}
                        alt={col.title}
                        className="w-full h-full object-cover object-center scale-100 group-hover:scale-[1.03] transition-transform duration-700"
                      />
                      <span className="absolute top-3 left-3 bg-[#FFFDF9]/90 backdrop-blur-xs border border-[#EADFD0] rounded-md px-3 py-1 text-xs font-medium text-[#7A491D]">
                        {col.brandName}
                      </span>
                      <span className="absolute top-3 right-3 bg-[#FFFDF9]/90 backdrop-blur-xs border border-[#EADFD0] rounded-md px-3 py-1 text-xs font-medium text-[#2E6B4E]">
                        {colProducts.length} Pieces
                      </span>
                    </div>
                  </CurtainReveal>

                  <div className="p-6 space-y-2.5">
                    <h2 className="font-display text-2xl font-semibold text-[#1F1A17]">
                      {col.title}
                    </h2>
                    <p className="text-sm text-[#5C5147] leading-relaxed">
                      {col.manifesto}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-[#F2EAE0] flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedSlug(isSelected ? "ALL" : col.slug)
                    }
                    className={`px-5 py-2.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#E31E24] border-[#E31E24] text-white"
                        : "border-[#1F1A17] bg-[#1F1A17] text-white hover:bg-[#E31E24] hover:border-[#E31E24]"
                    }`}
                  >
                    {isSelected
                      ? "Showing This Collection (Show All)"
                      : `View Collection Pieces (${colProducts.length})`}
                  </button>

                  <Link
                    href="/shop"
                    className="text-xs font-medium text-[#7A491D] hover:text-[#E31E24] transition-colors"
                  >
                    Open in Shop →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <TribalSectionSeparator
          label={
            activeCollection
              ? `Collection: ${activeCollection.title}`
              : "All Featured Collection Pieces"
          }
        />

        {/* Collection Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProducts.map((product, idx) => (
            <EditorialProductCard
              key={product.id}
              product={product}
              theme="light"
              index={idx}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
