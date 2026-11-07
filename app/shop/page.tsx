"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePlatform } from "@/lib/platform-context";
import { GenderTarget, ProductRecord } from "@/lib/store-data";
import { EditorialProductCard } from "@/components/commerce/EditorialProductCard";
import { StaggeredText } from "@/components/motion/MotionPrimitives";
import { TribalCornerWatermark } from "@/components/vectors/TribalVectors";

const CATEGORIES: { value: "ALL" | ProductRecord["category"]; label: string }[] = [
  { value: "ALL", label: "All Categories" },
  { value: "OUTERWEAR", label: "Outerwear & Layers" },
  { value: "KAFTAN_ARCHIVE", label: "Kaftans & Tailoring" },
  { value: "SHIRTING", label: "Shirts & Tops" },
  { value: "TROUSERS", label: "Trousers & Bottoms" },
  { value: "KNITWEAR", label: "Sets & Knitwear" },
  { value: "ACCESSORIES", label: "Accessories" },
];

const SIZES = ["ALL", "XS", "S", "M", "L", "XL", "XXL"] as const;

export default function ShopCatalogPage() {
  const { products, brands } = usePlatform();

  const [selectedGender, setSelectedGender] = useState<"ALL" | GenderTarget>("ALL");
  const [selectedBrand, setSelectedBrand] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<
    "ALL" | ProductRecord["category"]
  >("ALL");
  const [selectedSize, setSelectedSize] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<
    "FEATURED" | "PRICE_ASC" | "PRICE_DESC"
  >("FEATURED");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const genderParam = params.get("gender");
    if (
      genderParam === "WOMEN" ||
      genderParam === "MEN" ||
      genderParam === "UNISEX"
    ) {
      setSelectedGender(genderParam);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      if (selectedGender !== "ALL" && p.gender !== selectedGender) return false;
      if (selectedBrand !== "ALL" && p.brandSlug !== selectedBrand) return false;
      if (selectedCategory !== "ALL" && p.category !== selectedCategory)
        return false;
      if (selectedSize !== "ALL") {
        const hasSize = p.variants.some(
          (v) =>
            v.size === selectedSize && v.hubALagos + v.hubBToronto > 0
        );
        if (!hasSize) return false;
      }
      return true;
    });

    if (sortBy === "PRICE_ASC") {
      return [...list].sort((a, b) => a.basePriceCad - b.basePriceCad);
    }
    if (sortBy === "PRICE_DESC") {
      return [...list].sort((a, b) => b.basePriceCad - a.basePriceCad);
    }
    return list;
  }, [
    products,
    selectedGender,
    selectedBrand,
    selectedCategory,
    selectedSize,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedGender("ALL");
    setSelectedBrand("ALL");
    setSelectedCategory("ALL");
    setSelectedSize("ALL");
    setSortBy("FEATURED");
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1F1A17]">
      {/* Warm Minimalist Header */}
      <section className="relative border-b border-[#EADFD0] bg-[#FAF5EE] px-4 sm:px-8 py-10 sm:py-14 overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.05} />
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
              Macklemore Fashion &amp; Partner Houses
            </span>
            <StaggeredText
              text="Shop the Collection"
              as="h1"
              className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-[#1F1A17] mt-1"
            />
            <p className="text-sm sm:text-base text-[#5C5147] mt-2 max-w-xl">
              Contemporary ready-to-wear, structured outerwear, and signature sets curated from Macklemore Fashion, LUCA, and partner labels.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium px-3.5 py-2.5 rounded-md border border-[#E2D6C5] bg-white text-[#5C5147]">
              Showing {filteredProducts.length} of {products.length} pieces
            </span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "FEATURED" | "PRICE_ASC" | "PRICE_DESC"
                )
              }
              className="px-3.5 py-2.5 rounded-md border border-[#D4B895] bg-white text-xs font-medium text-[#1F1A17] outline-none cursor-pointer"
            >
              <option value="FEATURED">Sort: Featured</option>
              <option value="PRICE_ASC">Price: Low to High</option>
              <option value="PRICE_DESC">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Clean Minimalist Filter Bar */}
      <section className="border-b border-[#EADFD0] bg-[#FFFDF9] sticky top-20 z-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Segment Pills: All / Women / Men / Unisex */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: "ALL", label: "All" },
                  { id: "WOMEN", label: "Women" },
                  { id: "MEN", label: "Men" },
                  { id: "UNISEX", label: "Unisex" },
                ] as const
              ).map((seg) => (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => setSelectedGender(seg.id)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium border transition-all duration-200 cursor-pointer ${
                    selectedGender === seg.id
                      ? "border-[#1F1A17] bg-[#1F1A17] text-white shadow-2xs"
                      : "border-[#E2D6C5] bg-[#FAF5EE] text-[#5C5147] hover:border-[#7A491D] hover:text-[#1F1A17]"
                  }`}
                >
                  {seg.label}
                </button>
              ))}
            </div>

            {/* Brand & Size Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-3 py-1.5 rounded-md border border-[#E2D6C5] bg-white text-xs font-medium text-[#1F1A17] outline-none cursor-pointer"
              >
                <option value="ALL">All Brands</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1">
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      selectedSize === sz
                        ? "border-[#7A491D] bg-[#7A491D] text-white"
                        : "border-[#E2D6C5] bg-white text-[#5C5147] hover:border-[#7A491D]"
                    }`}
                  >
                    {sz === "ALL" ? "All Sizes" : sz}
                  </button>
                ))}
              </div>

              {(selectedGender !== "ALL" ||
                selectedBrand !== "ALL" ||
                selectedCategory !== "ALL" ||
                selectedSize !== "ALL") && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-3 py-1.5 rounded-md border border-[#E31E24]/40 text-[#E31E24] hover:bg-[#E31E24] hover:text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Quick Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#F2EAE0]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat.value
                    ? "bg-[#FAF5EE] text-[#E31E24] font-semibold border border-[#E31E24]/30"
                    : "text-[#5C5147] hover:text-[#1F1A17] hover:bg-[#FAF5EE]/60"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
        {filteredProducts.length === 0 ? (
          <div className="p-12 rounded-lg border border-[#EADFD0] bg-[#FAF5EE] text-center space-y-4">
            <p className="text-sm text-[#5C5147]">
              No pieces match your current filter selection.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-md bg-[#1F1A17] text-white text-xs font-medium cursor-pointer hover:bg-[#E31E24] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, idx) => (
              <EditorialProductCard
                key={product.id}
                product={product}
                theme="light"
                index={idx}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
