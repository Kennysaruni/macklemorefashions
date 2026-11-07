"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ProductRecord,
  convertPrice,
  formatCurrencyValue,
  getTotalProductStock,
} from "@/lib/store-data";
import { usePlatform } from "@/lib/platform-context";
import { CurtainReveal } from "@/components/motion/MotionPrimitives";

export function EditorialProductCard({
  product,
  theme = "light",
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
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <article
      data-theme={theme}
      className="group relative flex flex-col justify-between rounded-lg overflow-hidden border border-[#EADFD0] bg-white text-[#1F1A17] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#D4B895]"
    >
      {/* Image Viewport with Soft Hover Zoom & Crossfade */}
      <div>
        <CurtainReveal delay={(index % 4) * 0.05} duration={0.85}>
          <div
            className={`relative w-full ${aspectClass} overflow-hidden bg-[#FAF5EE]`}
          >
            {/* Primary Lookbook Image */}
            <img
              src={product.editorialImageUrl}
              alt={product.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center scale-100 group-hover:scale-[1.04] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-100 group-hover:opacity-0"
            />
            {/* Secondary Detail Image on Hover */}
            <img
              src={product.flatlayImageUrl}
              alt={`${product.title} detail`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center scale-100 group-hover:scale-[1.04] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 group-hover:opacity-100"
            />

            {/* Subtle Category Tag */}
            <div className="absolute top-3 left-3 bg-[#FFFDF9]/90 backdrop-blur-xs border border-[#EADFD0] rounded-md px-2.5 py-1 text-[11px] font-medium text-[#5C5147]">
              {product.category}
            </div>

            {/* Subtle Low Stock Indicator */}
            {stockInfo.total <= 15 && (
              <div className="absolute top-3 right-3 bg-[#FFFDF9]/90 backdrop-blur-xs border border-[#E05C1A]/40 rounded-md px-2.5 py-1 text-[11px] font-medium text-[#E05C1A]">
                Limited Edition
              </div>
            )}
          </div>
        </CurtainReveal>
      </div>

      {/* Minimalist Product Details & Size Selector */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-4 bg-white">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <Link
              href={`/brands/${product.brandSlug}`}
              className="text-xs font-medium text-[#7A491D] hover:text-[#E31E24] transition-colors"
            >
              {product.brandName}
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-[#7D7065]">
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/15 inline-block"
                style={{ backgroundColor: product.colorHex || "#7A491D" }}
              />
              <span>{product.colorName}</span>
            </div>
          </div>

          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-base font-semibold text-[#1F1A17] leading-snug group-hover:text-[#7A491D] transition-colors">
              {product.title}
            </h3>
            <span className="text-sm font-semibold text-[#1F1A17] shrink-0">
              {formatCurrencyValue(convertPrice(product, currency), currency)}
            </span>
          </div>

          <p className="text-xs text-[#6E6359] mt-1 line-clamp-1">
            {product.subtitle}
          </p>
        </div>

        {/* Clean Size Buttons & Add to Bag */}
        <div className="pt-3 border-t border-[#F2EAE0] space-y-2.5">
          <div className="grid grid-cols-5 gap-1.5">
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
                  className={`h-8 rounded-md text-xs font-medium border transition-all duration-200 cursor-pointer ${
                    isOut
                      ? "border-[#EFE7DC] bg-[#FAF5EE] text-[#C5B9AC] line-through cursor-not-allowed"
                      : isSelected
                      ? "border-[#1F1A17] bg-[#1F1A17] text-white shadow-2xs"
                      : "border-[#E2D6C5] bg-white hover:border-[#7A491D] hover:bg-[#FAF5EE] text-[#1F1A17]"
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
            className={`w-full py-2.5 px-4 rounded-md text-xs font-medium tracking-wide border transition-all duration-200 cursor-pointer ${
              justAdded
                ? "bg-[#2E6B4E] border-[#2E6B4E] text-white"
                : variantTotalStock <= 0
                ? "border-[#EADFD0] bg-[#FAF5EE] text-[#A89B8E] cursor-not-allowed"
                : "border-[#1F1A17] bg-[#1F1A17] text-white hover:bg-[#E31E24] hover:border-[#E31E24] shadow-2xs hover:shadow-sm"
            }`}
          >
            {justAdded
              ? `Added (${selectedSize}) ✓`
              : variantTotalStock <= 0
              ? "Out of Stock"
              : `Add to Bag · ${selectedSize}`}
          </button>
        </div>
      </div>
    </article>
  );
}
