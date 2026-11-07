"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ProductRecord,
  convertPrice,
  formatCurrencyValue,
  getTotalProductStock,
} from "@/lib/store-data";
import { usePlatform } from "@/lib/platform-context";
import {
  CurtainImage,
  DrawDivider,
} from "@/components/motion/MotionPrimitives";

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
  >(product.variants[0]?.size || "M");
  const [justAdded, setJustAdded] = useState(false);

  const stockInfo = getTotalProductStock(product);
  const selectedVariant =
    product.variants.find((v) => v.size === selectedSize) ||
    product.variants[0];
  const variantTotalStock = selectedVariant
    ? selectedVariant.hubALagos + selectedVariant.hubBToronto
    : 0;

  const isFabric = product.category === "Fabrics";

  // For fabrics: M = 3 Yards (1x base price), L = 6 Yards (2x base price)
  const effectiveProduct =
    isFabric && selectedSize === "L"
      ? { ...product, basePriceCad: product.basePriceCad * 2 }
      : product;

  const displayPrice = formatCurrencyValue(
    convertPrice(effectiveProduct, currency),
    currency
  );

  const aspectClass =
    priorityAspect === "tall"
      ? "aspect-[3/4] sm:aspect-[4/5]"
      : priorityAspect === "square"
      ? "aspect-square"
      : "aspect-[3/4]";

  const formatOptionLabel = (size: string) => {
    if (isFabric) {
      return size === "M" ? "3 Yards" : size === "L" ? "6 Yards" : size;
    }
    return size;
  };

  const handleAdd = () => {
    if (variantTotalStock <= 0) return;
    addToCart(effectiveProduct, selectedSize, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <article
      data-theme={theme}
      className="group relative flex flex-col justify-between rounded-lg overflow-hidden border border-[#EADFD0] bg-white text-[#1F1A17] transform-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#D4B895]"
    >
      {/* Image Viewport with CurtainImage (Clip-Path Reveal, Next/Image, Hover Crossfade & Fallback) */}
      <div>
        <CurtainImage
          src={product.editorialImageUrl}
          secondarySrc={product.flatlayImageUrl}
          alt={product.title}
          aspectClass={aspectClass}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          delay={(index % 3) * 0.05}
          duration={1.1}
        >
          {/* Category Tag */}
          <div className="absolute top-3 left-3 z-10 bg-[#FFFDF9]/90 backdrop-blur-xs border border-[#EADFD0] rounded-md px-2.5 py-1 text-[11px] font-medium text-[#5C5147]">
            {product.category}
          </div>

          {/* Price Range or Limited Badge */}
          {product.priceRangeLabel && currency === "CAD" ? (
            <div className="absolute top-3 right-3 z-10 bg-[#FFFDF9]/90 backdrop-blur-xs border border-[#D4860B]/40 rounded-md px-2.5 py-1 text-[11px] font-medium text-[#7A491D]">
              {product.priceRangeLabel}
            </div>
          ) : stockInfo.total <= 18 ? (
            <div className="absolute top-3 right-3 z-10 bg-[#FFFDF9]/90 backdrop-blur-xs border border-[#E05C1A]/40 rounded-md px-2.5 py-1 text-[11px] font-medium text-[#E05C1A]">
              Custom &amp; Ready-to-Wear
            </div>
          ) : null}
        </CurtainImage>
      </div>

      {/* Minimalist Product Details & Size / Yard Selector */}
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
              <span className="truncate max-w-[120px]">{product.colorName}</span>
            </div>
          </div>

          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-base font-semibold text-[#1F1A17] leading-snug group-hover:text-[#7A491D] transition-colors">
              {product.title}
            </h3>
            <span className="text-sm font-semibold text-[#E31E24] shrink-0">
              {displayPrice}
            </span>
          </div>

          <p className="text-xs text-[#6E6359] mt-1 line-clamp-2 leading-relaxed">
            {product.subtitle}
          </p>
        </div>

        {/* Clean Size / Yard Buttons with layoutId Spring Indicator & Add to Bag */}
        <div className="space-y-2.5">
          <DrawDivider className="h-[1px] w-full bg-[#F2EAE0]" />

          <div
            className={`grid gap-1.5 pt-1 ${
              isFabric
                ? "grid-cols-2"
                : product.variants.length <= 3
                ? "grid-cols-3"
                : "grid-cols-5"
            }`}
          >
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
                  className={`relative h-8 rounded-md text-xs font-medium border transition-colors duration-200 cursor-pointer overflow-hidden ${
                    isOut
                      ? "border-[#EFE7DC] bg-[#FAF5EE] text-[#C5B9AC] line-through cursor-not-allowed"
                      : isSelected
                      ? "border-[#1F1A17] text-white shadow-2xs"
                      : "border-[#E2D6C5] bg-white hover:border-[#7A491D] hover:bg-[#FAF5EE] text-[#1F1A17]"
                  }`}
                >
                  {isSelected && !isOut && (
                    <motion.span
                      layoutId={`size-pill-${product.id}`}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="absolute inset-0 bg-[#1F1A17] rounded-[5px]"
                    />
                  )}
                  <span className="relative z-10">
                    {formatOptionLabel(v.size)}
                  </span>
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
              ? `Added (${formatOptionLabel(selectedSize)}) ✓`
              : variantTotalStock <= 0
              ? "Out of Stock"
              : `Add to Bag · ${formatOptionLabel(selectedSize)} (${displayPrice})`}
          </button>
        </div>
      </div>
    </article>
  );
}
