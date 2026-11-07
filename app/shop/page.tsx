"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePlatform } from "@/lib/platform-context";
import { GenderTarget, ShopCategory } from "@/lib/store-data";
import { EditorialProductCard } from "@/components/commerce/EditorialProductCard";
import {
  CatalogGridSuspenseFallback,
  DrawDivider,
  TextReveal,
} from "@/components/motion/MotionPrimitives";
import { TribalCornerWatermark } from "@/components/vectors/TribalVectors";

const CATEGORIES: { value: "ALL" | ShopCategory; label: string }[] = [
  { value: "ALL", label: "All Categories" },
  { value: "Men Wears", label: "Men Wears" },
  { value: "Male Accessories", label: "Male Accessories" },
  { value: "Women Wears", label: "Women Wears" },
  { value: "Female Accessories", label: "Female Accessories" },
  { value: "Kids Wears", label: "Kids Wears" },
  { value: "Fabrics", label: "Prints & Fabrics" },
];

const SIZES = ["ALL", "XS", "S", "M", "L", "XL", "XXL"] as const;

export default function ShopCatalogPage() {
  const { products, brands } = usePlatform();

  const [selectedGender, setSelectedGender] = useState<"ALL" | GenderTarget>("ALL");
  const [selectedBrand, setSelectedBrand] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | ShopCategory>("ALL");
  const [selectedSize, setSelectedSize] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<
    "FEATURED" | "PRICE_ASC" | "PRICE_DESC"
  >("FEATURED");
  const [showMobileSecondaryFilters, setShowMobileSecondaryFilters] =
    useState(false);

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const genderParam = params.get("gender");
      const categoryParam = params.get("category");

      if (
        genderParam === "WOMEN" ||
        genderParam === "MEN" ||
        genderParam === "KIDS" ||
        genderParam === "UNISEX"
      ) {
        setSelectedGender(genderParam);
      }
      if (categoryParam) {
        const match = CATEGORIES.find(
          (c) => c.value.toLowerCase() === categoryParam.toLowerCase()
        );
        if (match) {
          setSelectedCategory(match.value);
        }
      }
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
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
              Macklemore Fashion · Ready-to-Wear, Accessories &amp; Fabrics
            </span>
            <TextReveal
              key={selectedCategory}
              text={
                selectedCategory === "ALL"
                  ? "Shop the Collection"
                  : selectedCategory
              }
              as="h1"
              className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-[#1F1A17] mt-1"
            />
            <p className="text-sm sm:text-base text-[#5C5147] mt-2 max-w-2xl">
              Explore our complete collection of Men Wears, Women Wears, Male &amp; Female Accessories, Kids Wears, African Fabrics, and Partner Brands.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium px-3.5 py-2.5 rounded-md border border-[#E2D6C5] bg-white text-[#5C5147]">
              Showing {filteredProducts.length} of {products.length} items
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

      {/* Clean Minimalist Filter Bar (Non-Sticky so it never covers the screen on mobile) */}
      <section
        id="shop-filters"
        className="border-b border-[#EADFD0] bg-[#FFFDF9]"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3.5 space-y-2.5">
          {/* Primary Category Pills: Single horizontal scroll row on mobile, wrapped on desktop */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap sm:overflow-visible no-scrollbar flex-1">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`relative shrink-0 px-3.5 py-2 rounded-md text-xs font-medium border transition-colors duration-200 cursor-pointer overflow-hidden ${
                      isActive
                        ? "border-[#1F1A17] text-white shadow-2xs"
                        : "border-[#E2D6C5] bg-[#FAF5EE] text-[#5C5147] hover:border-[#7A491D] hover:text-[#1F1A17]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="shop-category-tab"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                        className="absolute inset-0 bg-[#1F1A17] rounded-[5px]"
                      />
                    )}
                    <span className="relative z-10">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Compact Mobile Toggle for Secondary Filters */}
            <button
              type="button"
              onClick={() =>
                setShowMobileSecondaryFilters(!showMobileSecondaryFilters)
              }
              className="md:hidden shrink-0 px-3 py-2 rounded-md border border-[#D4B895] bg-white text-xs font-medium text-[#7A491D] cursor-pointer"
            >
              {showMobileSecondaryFilters ? "Hide Filters ▴" : "Filters ▾"}
            </button>
          </div>

          {/* Secondary Filter Row: Collapsible on Mobile, Always Visible on Desktop */}
          <div
            className={`${
              showMobileSecondaryFilters ? "block" : "hidden md:block"
            } space-y-2.5`}
          >
            <DrawDivider className="h-[1px] w-full bg-[#F2EAE0]" />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: "ALL", label: "All Segments" },
                    { id: "MEN", label: "Men" },
                    { id: "WOMEN", label: "Women" },
                    { id: "KIDS", label: "Kids" },
                    { id: "UNISEX", label: "Unisex & Fabrics" },
                  ] as const
                ).map((seg) => {
                  const isActive = selectedGender === seg.id;
                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => setSelectedGender(seg.id)}
                      className={`relative px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer overflow-hidden ${
                        isActive
                          ? "text-[#E31E24] font-semibold"
                          : "text-[#5C5147] hover:text-[#1F1A17] hover:bg-[#FAF5EE]/60"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="shop-gender-tab"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                          }}
                          className="absolute inset-0 bg-[#FAF5EE] border border-[#E31E24]/30 rounded-md"
                        />
                      )}
                      <span className="relative z-10">{seg.label}</span>
                    </button>
                  );
                })}
              </div>

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

                <div className="flex items-center gap-1 overflow-x-auto">
                  {SIZES.map((sz) => {
                    const isActive = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`relative shrink-0 px-2 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer overflow-hidden ${
                          isActive
                            ? "border-[#7A491D] text-white"
                            : "border-[#E2D6C5] bg-white text-[#5C5147] hover:border-[#7A491D]"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="shop-size-tab"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 32,
                            }}
                            className="absolute inset-0 bg-[#7A491D] rounded-[5px]"
                          />
                        )}
                        <span className="relative z-10">
                          {sz === "ALL" ? "All Sizes" : sz}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {(selectedGender !== "ALL" ||
                  selectedBrand !== "ALL" ||
                  selectedCategory !== "ALL" ||
                  selectedSize !== "ALL") && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-3 py-1 rounded-md border border-[#E31E24]/40 text-[#E31E24] hover:bg-[#E31E24] hover:text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid with React Suspense & Hero Curtain Reveal */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <Suspense fallback={<CatalogGridSuspenseFallback count={6} />}>
          {filteredProducts.length === 0 ? (
            <div className="p-12 rounded-lg border border-[#EADFD0] bg-[#FAF5EE] text-center space-y-4">
              <p className="text-sm text-[#5C5147]">
                No items match your current filter selection.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-md bg-[#1F1A17] text-white text-xs font-medium cursor-pointer hover:bg-[#E31E24] transition-colors"
              >
                Show All {products.length} Items
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <EditorialProductCard
                  key={`${selectedCategory}-${selectedGender}-${selectedBrand}-${selectedSize}-${product.id}`}
                  product={product}
                  theme="light"
                  index={idx}
                />
              ))}
            </div>
          )}
        </Suspense>
      </section>
    </div>
  );
}
