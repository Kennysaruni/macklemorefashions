"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ProductRecord,
  convertPrice,
  formatCurrencyValue,
  formatMultiCurrencyBracket,
  getTotalProductStock,
} from "@/lib/store-data";
import { usePlatform } from "@/lib/platform-context";
import { CurtainReveal } from "@/components/motion/MotionPrimitives";

export function EditorialProductCard({
  product,
  theme = "dark",
  index = 0,
  priorityAspect = "portrait",
}: {
  product: ProductRecord;
  theme?: "dark" | "light";
  index?: number;
  priorityAspect?: "portrait" | "tall" | "square";
}) {
  const { currency, addToCart } = usePlatform();
  const [selectedSize, setSelectedSize] = useState<
    "XS" | "S" | "M" | "L" | "XL" | "XXL"
  >(product.variants[1]?.size || product.variants[0]?.size || "M");
  const [justAdded, setJustAdded] = useState(false);

  const stockInfo = getTotalProductStock(product);
  const selectedVariant =
    product.variants.find((v) => v.size === selectedSize) ||
    product.variants[0];
  const variantTotalStock = selectedVariant
    ? selectedVariant.hubALagos + selectedVariant.hubBToronto
    : 0;

  const isDark = theme === "dark";
  const borderClass = isDark ? "border-stone-800" : "border-neutral-300";
  const bgClass = isDark ? "bg-[#0B0B0C]" : "bg-[#F6F5F1]";
  const textPrimary = isDark ? "text-[#F6F5F1]" : "text-[#0B0B0C]";
  const textMuted = isDark ? "text-stone-400" : "text-neutral-600";

  const aspectClass =
    priorityAspect === "tall"
      ? "aspect-[3/4] sm:aspect-[4/5]"
      : priorityAspect === "square"
      ? "aspect-square"
      : "aspect-[3/4]";

  const handleAdd = () => {
    if (variantTotalStock <= 0) return;
    addToCart(product, selectedSize, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <article
      className={`group relative flex flex-col justify-between border ${borderClass} ${bgClass} ${textPrimary} transition-colors duration-500`}
    >
      {/* Top Technical Metadata Rail */}
      <div>
        <div
          className={`px-3.5 py-2 border-b ${borderClass} flex items-center justify-between gap-2 font-mono text-[10px] tracking-wider uppercase`}
        >
          <Link
            href={`/brands/${product.brandSlug}`}
            className="text-[#D4860B] hover:text-[#E31E24] transition-colors truncate"
          >
            [ {product.brandName} ]
          </Link>
          <span className={textMuted}>[ {product.fabricWeightGsm} GSM ]</span>
        </div>

        {/* Editorial Image Viewport with Masked Curtain Reveal & 700ms Hover Crossfade */}
        <CurtainReveal delay={(index % 4) * 0.08} duration={1.0}>
          <div className={`relative w-full ${aspectClass} overflow-hidden bg-stone-950`}>
            {/* Primary Editorial Lookbook Shot */}
            <img
              src={product.editorialImageUrl}
              alt={`${product.title} — Editorial Lookbook`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center scale-100 group-hover:scale-[1.03] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-100 group-hover:opacity-0"
            />
            {/* Secondary Garment Flat-Lay / Detail Shot (Crossfades in on Hover) */}
            <img
              src={product.flatlayImageUrl}
              alt={`${product.title} — Garment Detail`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center scale-100 group-hover:scale-[1.03] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 group-hover:opacity-100"
            />

            {/* Subtle Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 pointer-events-none" />

            {/* Top-Left Origin Telemetry */}
            <div className="absolute top-3 left-3 font-mono text-[10px] tracking-widest uppercase bg-[#0B0B0C]/85 text-[#F6F5F1] px-2 py-1 border border-stone-800">
              [ ORIGIN: {product.originLabel} ]
            </div>

            {/* Bottom-Left Allocation Scarcity Telemetry */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] tracking-wider uppercase">
              <span
                className={`px-2 py-1 border ${
                  stockInfo.total <= 12
                    ? "bg-[#0B0B0C]/90 border-[#E05C1A] text-[#E05C1A]"
                    : "bg-[#0B0B0C]/85 border-stone-800 text-stone-300"
                }`}
              >
                [ ALLOCATION: {stockInfo.total} UNITS REMAINING ]
              </span>
              <span className="hidden sm:inline-block bg-[#0B0B0C]/85 border border-stone-800 text-stone-400 px-2 py-1">
                [ LOS:{stockInfo.hubALagos} // YYZ:{stockInfo.hubBToronto} ]
              </span>
            </div>
          </div>
        </CurtainReveal>
      </div>

      {/* Product Specification & Commerce Console */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-base sm:text-lg font-bold tracking-tight uppercase leading-snug">
              {product.title}
            </h3>
            <span className="font-mono text-xs sm:text-sm font-semibold text-[#D4860B] shrink-0">
              {formatCurrencyValue(
                convertPrice(product, currency),
                currency
              )}
            </span>
          </div>

          <p className={`text-xs ${textMuted} mt-1 line-clamp-2 leading-relaxed`}>
            {product.subtitle}
          </p>

          {/* Raw Multi-Currency Bracket Spec */}
          <div className="mt-2.5 font-mono text-[10px] tracking-wider text-stone-400 break-words">
            {formatMultiCurrencyBracket(product, currency)}
          </div>
        </div>

        {/* Square Size Matrix & Action */}
        <div className={`pt-3 border-t ${borderClass} space-y-3`}>
          <div className="flex items-center justify-between gap-2">
            <span className={`font-mono text-[10px] uppercase ${textMuted}`}>
              [ SIZE MATRIX ]
            </span>
            {selectedVariant && (
              <span className="font-mono text-[10px] uppercase text-[#D4860B]">
                [ LAGOS: {selectedVariant.hubALagos} // TORONTO:{" "}
                {selectedVariant.hubBToronto} ]
              </span>
            )}
          </div>

          <div className="grid grid-cols-5 gap-1">
            {product.variants.map((v) => {
              const total = v.hubALagos + v.hubBToronto;
              const isSelected = selectedSize === v.size;
              const isOut = total <= 0;
              return (
                <button
                  key={v.sku}
                  type="button"
                  disabled={isOut}
                  onClick={() => setSelectedSize(v.size)}
                  className={`h-8 font-mono text-[11px] uppercase border transition-colors cursor-pointer ${
                    isOut
                      ? "border-stone-800/40 text-stone-600 line-through cursor-not-allowed"
                      : isSelected
                      ? "border-[#E31E24] bg-[#E31E24] text-white font-bold"
                      : `${borderClass} hover:border-[#D4860B] ${textPrimary}`
                  }`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={variantTotalStock <= 0}
            className={`w-full py-2.5 px-4 font-mono text-xs tracking-[0.18em] uppercase border transition-all cursor-pointer ${
              justAdded
                ? "bg-[#D4860B] border-[#D4860B] text-[#0B0B0C] font-bold"
                : variantTotalStock <= 0
                ? "border-stone-800 text-stone-600 cursor-not-allowed"
                : isDark
                ? "border-stone-700 bg-transparent text-[#F6F5F1] hover:bg-[#E31E24] hover:border-[#E31E24] hover:text-white"
                : "border-neutral-800 bg-[#0B0B0C] text-[#F6F5F1] hover:bg-[#E31E24] hover:border-[#E31E24]"
            }`}
          >
            {justAdded
              ? `[ ALLOCATED SIZE ${selectedSize} TO BAG ]`
              : variantTotalStock <= 0
              ? "[ ALLOCATION EXHAUSTED ]"
              : `[ ACQUIRE // SIZE ${selectedSize} ]`}
          </button>
        </div>
      </div>
    </article>
  );
}

