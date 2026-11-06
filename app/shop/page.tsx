"use client";

import React, { useMemo, useState } from "react";
import { usePlatform } from "@/lib/platform-context";
import { EditorialProductCard } from "@/components/commerce/EditorialProductCard";
import {
  TribalCornerWatermark,
  TribalSectionSeparator,
} from "@/components/vectors/TribalVectors";
import { StaggeredText } from "@/components/motion/MotionPrimitives";

export default function ShopCatalogPage() {
  const { products, brands } = usePlatform();

  const [selectedGender, setSelectedGender] = useState<string>("ALL");
  const [selectedBrand, setSelectedBrand] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSize, setSelectedSize] = useState<string>("ALL");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("ALL");
  const [minGsm, setMinGsm] = useState<number>(0);
  const [canvasTheme, setCanvasTheme] = useState<"dark" | "light">("dark");

  const categories = [
    "ALL",
    "OUTERWEAR",
    "KAFTAN_ARCHIVE",
    "KNITWEAR",
    "SHIRTING",
    "TROUSERS",
  ];
  const sizes = ["ALL", "XS", "S", "M", "L", "XL"];
  const origins = ["ALL", "LAGOS", "TORONTO", "MILAN", "ACCRA", "NAIROBI"];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedGender !== "ALL" && p.gender !== selectedGender) return false;
      if (selectedBrand !== "ALL" && p.brandSlug !== selectedBrand)
        return false;
      if (selectedCategory !== "ALL" && p.category !== selectedCategory)
        return false;
      if (
        selectedSize !== "ALL" &&
        !p.variants.some(
          (v) => v.size === selectedSize && v.hubALagos + v.hubBToronto > 0
        )
      )
        return false;
      if (
        selectedOrigin !== "ALL" &&
        !p.originLabel.toUpperCase().includes(selectedOrigin)
      )
        return false;
      if (p.fabricWeightGsm < minGsm) return false;
      return true;
    });
  }, [
    products,
    selectedGender,
    selectedBrand,
    selectedCategory,
    selectedSize,
    selectedOrigin,
    minGsm,
  ]);

  const resetFilters = () => {
    setSelectedGender("ALL");
    setSelectedBrand("ALL");
    setSelectedCategory("ALL");
    setSelectedSize("ALL");
    setSelectedOrigin("ALL");
    setMinGsm(0);
  };

  const isDark = canvasTheme === "dark";

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark ? "bg-[#0B0B0C] text-[#F6F5F1]" : "bg-[#F6F5F1] text-[#0B0B0C]"
      }`}
    >
      {/* Catalog Masthead */}
      <section
        className={`relative border-b ${
          isDark ? "border-stone-800" : "border-neutral-300"
        } py-12 sm:py-16 overflow-hidden`}
      >
        <TribalCornerWatermark position="top-right" opacity={0.06} />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#D4860B] block">
                [ MULTI-BRAND LUXURY &amp; STREETWEAR ARCHIVE // HUB A &amp; HUB
                B STOCK ]
              </span>
              <StaggeredText
                text="THE CATALOG // ALL ALLOCATIONS"
                as="h1"
                className="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight mt-2"
              />
            </div>

            {/* Canvas Lighting Toggle (Obsidian Night vs Bone Daytime Editorial) */}
            <div className="flex items-center gap-2 font-mono text-xs uppercase">
              <span className="text-[10px] text-stone-400 mr-2">
                [ EDITORIAL CANVAS ]:
              </span>
              <button
                type="button"
                onClick={() => setCanvasTheme("dark")}
                className={`px-3.5 py-2 border cursor-pointer ${
                  isDark
                    ? "border-[#E31E24] bg-[#E31E24] text-white font-bold"
                    : "border-neutral-400 text-[#0B0B0C]"
                }`}
              >
                [ #0B0B0C OBSIDIAN ]
              </button>
              <button
                type="button"
                onClick={() => setCanvasTheme("light")}
                className={`px-3.5 py-2 border cursor-pointer ${
                  !isDark
                    ? "border-[#0B0B0C] bg-[#0B0B0C] text-[#F6F5F1] font-bold"
                    : "border-stone-800 text-stone-400"
                }`}
              >
                [ #F6F5F1 RAW BONE ]
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Faceted Filter Console */}
      <section
        className={`border-b ${
          isDark
            ? "border-stone-800 bg-[#101012]"
            : "border-neutral-300 bg-[#EAE8E1]"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 space-y-5 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* 1. Gender */}
            <div>
              <label className="text-[10px] text-[#D4860B] uppercase block mb-1.5">
                [ 01 // GENDER ]
              </label>
              <div className="grid grid-cols-4 gap-1">
                {["ALL", "MEN", "WOMEN", "UNISEX"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGender(g)}
                    className={`py-2 text-[10px] border cursor-pointer ${
                      selectedGender === g
                        ? "border-[#E31E24] bg-[#E31E24] text-white font-bold"
                        : isDark
                        ? "border-stone-800 bg-[#0B0B0C] text-stone-300"
                        : "border-neutral-300 bg-[#F6F5F1] text-[#0B0B0C]"
                    }`}
                  >
                    {g === "UNISEX" ? "UNI" : g}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Brand House */}
            <div>
              <label className="text-[10px] text-[#D4860B] uppercase block mb-1.5">
                [ 02 // REPRESENTED HOUSE ]
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className={`w-full h-9 px-2.5 border text-xs uppercase focus:outline-none ${
                  isDark
                    ? "border-stone-800 bg-[#0B0B0C] text-white"
                    : "border-neutral-300 bg-[#F6F5F1] text-[#0B0B0C]"
                }`}
              >
                <option value="ALL">ALL BRANDS ({brands.length})</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Category */}
            <div>
              <label className="text-[10px] text-[#D4860B] uppercase block mb-1.5">
                [ 03 // GARMENT CATEGORY ]
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full h-9 px-2.5 border text-xs uppercase focus:outline-none ${
                  isDark
                    ? "border-stone-800 bg-[#0B0B0C] text-white"
                    : "border-neutral-300 bg-[#F6F5F1] text-[#0B0B0C]"
                }`}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Size Matrix */}
            <div>
              <label className="text-[10px] text-[#D4860B] uppercase block mb-1.5">
                [ 04 // SIZE AVAILABILITY ]
              </label>
              <div className="grid grid-cols-6 gap-1">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 text-[10px] border cursor-pointer ${
                      selectedSize === sz
                        ? "border-[#E31E24] bg-[#E31E24] text-white font-bold"
                        : isDark
                        ? "border-stone-800 bg-[#0B0B0C] text-stone-300"
                        : "border-neutral-300 bg-[#F6F5F1] text-[#0B0B0C]"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Origin Corridor */}
            <div>
              <label className="text-[10px] text-[#D4860B] uppercase block mb-1.5">
                [ 05 // ORIGIN HUB ]
              </label>
              <select
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className={`w-full h-9 px-2.5 border text-xs uppercase focus:outline-none ${
                  isDark
                    ? "border-stone-800 bg-[#0B0B0C] text-white"
                    : "border-neutral-300 bg-[#F6F5F1] text-[#0B0B0C]"
                }`}
              >
                {origins.map((orig) => (
                  <option key={orig} value={orig}>
                    {orig === "ALL" ? "ALL ORIGINS" : `ORIGIN: ${orig}`}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Fabric Weight (GSM) */}
            <div>
              <label className="text-[10px] text-[#D4860B] uppercase block mb-1.5">
                [ 06 // FABRIC WEIGHT (GSM) ]
              </label>
              <select
                value={minGsm}
                onChange={(e) => setMinGsm(Number(e.target.value))}
                className={`w-full h-9 px-2.5 border text-xs uppercase focus:outline-none ${
                  isDark
                    ? "border-stone-800 bg-[#0B0B0C] text-white"
                    : "border-neutral-300 bg-[#F6F5F1] text-[#0B0B0C]"
                }`}
              >
                <option value={0}>ALL WEIGHTS (300–620 GSM)</option>
                <option value={400}>HEAVYWEIGHT (400+ GSM)</option>
                <option value={500}>MONOLITH GRADE (500+ GSM)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Status Bar */}
          <div
            className={`pt-4 border-t ${
              isDark ? "border-stone-800" : "border-neutral-300"
            } flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase`}
          >
            <div>
              [ DISPLAYING {filteredProducts.length} OF {products.length}{" "}
              ARCHITECTURAL GARMENTS ]
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="text-[#E31E24] hover:underline cursor-pointer"
            >
              [ RESET ALL FILTER PARAMETERS ]
            </button>
          </div>
        </div>
      </section>

      {/* Catalog Masonry Product Grid */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <TribalSectionSeparator
          theme={canvasTheme}
          label={`ACTIVE ALLOCATION // ${filteredProducts.length} PIECES`}
          className="mb-8"
        />

        {filteredProducts.length === 0 ? (
          <div
            className={`p-16 border ${
              isDark ? "border-stone-800" : "border-neutral-300"
            } text-center space-y-4 font-mono`}
          >
            <p className="text-sm uppercase">
              [ NO GARMENTS MATCH THE SELECTED SPECIFICATION MATRIX ]
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-6 py-3 bg-[#E31E24] text-white text-xs uppercase tracking-widest cursor-pointer"
            >
              [ CLEAR FILTERS ]
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, idx) => (
              <EditorialProductCard
                key={product.id}
                product={product}
                theme={canvasTheme}
                index={idx}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

