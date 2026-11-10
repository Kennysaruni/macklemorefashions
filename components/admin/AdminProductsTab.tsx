"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CurrencyCode,
  formatCurrencyValue,
  getTotalProductStock,
  ProductRecord,
} from "@/lib/store-data";

interface AdminProductsTabProps {
  products: ProductRecord[];
  onAddNewProduct: () => void;
  onEditProduct: (product: ProductRecord) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateStock: (
    productId: string,
    size: string,
    hub: "hubALagos" | "hubBToronto",
    newQty: number
  ) => void;
}

const CATEGORIES = [
  "ALL",
  "Men Wears",
  "Male Accessories",
  "Women Wears",
  "Female Accessories",
  "Kids Wears",
  "Fabrics",
];

export function AdminProductsTab({
  products,
  onAddNewProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateStock,
}: AdminProductsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [displayCurrency] = useState<CurrencyCode>("CAD");
  const [expandedSizesProductId, setExpandedSizesProductId] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Top Filter & Action Bar */}
      <div className="rounded-sm border border-[#EADFD0] bg-white p-7 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#1F1A17]">
              Clothes &amp; Stock Vault
            </h2>
            <p className="text-xs text-[#6E6A63] mt-0.5">
              Manage pieces, lookbooks, and dual-hub inventory with instant auto-save
            </p>
          </div>

          <button
            onClick={onAddNewProduct}
            type="button"
            className="rounded-sm bg-[#7A491D] px-6 py-3 text-xs font-semibold tracking-wider text-white uppercase shadow-xs hover:bg-[#5C3614] transition-all cursor-pointer flex items-center gap-2"
          >
            <span>+</span>
            <span>Add New Piece</span>
          </button>
        </div>

        {/* Search Bar & Category Filter Buttons */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 pt-1">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by garment title, brand, or collection..."
              className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-4 py-3 text-xs text-[#1F1A17] placeholder:text-[#A8A29E] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#A8A29E] hover:text-[#1F1A17]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-sm px-3.5 py-2 text-xs font-medium transition-all whitespace-nowrap cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#7A491D] text-white shadow-xs"
                      : "bg-[#FAF9F6] border border-[#EADFD0] text-[#6E6A63] hover:text-[#1F1A17] hover:bg-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-sm border border-[#EADFD0] bg-white p-16 text-center text-xs text-[#6E6A63]">
          No garments match your search criteria. Try choosing another category or clearing the search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const totalStock = getTotalProductStock(product);
            const isSizesOpen = expandedSizesProductId === product.id;

            return (
              <div
                key={product.id}
                className="rounded-sm border border-[#EADFD0] bg-white overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo Thumbnail */}
                  <div className="relative aspect-4/3 w-full bg-[#FAF9F6] overflow-hidden border-b border-[#EADFD0]/60">
                    <img
                      src={product.editorialImageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-sm bg-white/95 px-2.5 py-1 text-xs font-medium text-[#7A491D] border border-[#EADFD0]">
                        {product.brandName}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="rounded-sm bg-white/95 px-2.5 py-1 text-xs font-mono text-[#1F1A17] border border-[#EADFD0]">
                        {totalStock.total} units
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-base font-bold uppercase tracking-tight text-[#1F1A17]">
                          {product.title}
                        </h3>
                        <p className="text-xs text-[#6E6A63] line-clamp-1 mt-0.5">
                          {product.category} · {product.fabricWeightGsm} GSM
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-base font-bold text-[#7A491D]">
                          {formatCurrencyValue(product.basePriceCad, displayCurrency)}
                        </span>
                      </div>
                    </div>

                    {/* Quick Stock Summary Bar */}
                    <div className="rounded-sm border border-[#EADFD0] bg-[#FAF9F6] p-3.5 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div>
                          <span className="text-[11px] text-[#6E6A63] block">Lagos Hub</span>
                          <span className="font-semibold text-sm text-[#1F1A17]">
                            {product.variants.reduce((acc, v) => acc + (v.hubALagos || 0), 0)}
                          </span>
                        </div>
                        <div className="h-7 w-[1px] bg-[#EADFD0]" />
                        <div>
                          <span className="text-[11px] text-[#6E6A63] block">Toronto HQ</span>
                          <span className="font-semibold text-sm text-[#1F1A17]">
                            {product.variants.reduce((acc, v) => acc + (v.hubBToronto || 0), 0)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSizesProductId(isSizesOpen ? null : product.id)
                        }
                        className="rounded-sm bg-white border border-[#EADFD0] px-3 py-1.5 text-xs font-medium text-[#7A491D] hover:bg-[#FAF5EE] transition-colors cursor-pointer"
                      >
                        {isSizesOpen ? "Hide Sizes" : "Adjust Stock"}
                      </button>
                    </div>

                    {/* Expandable Size Steppers */}
                    {isSizesOpen && (
                      <div className="rounded-sm border border-[#EADFD0] bg-white p-3.5 space-y-2 mt-2">
                        <div className="text-xs font-medium text-[#6E6A63] border-b border-[#EADFD0]/60 pb-2 flex justify-between">
                          <span>Size</span>
                          <span>Lagos Hub · Toronto HQ</span>
                        </div>

                        {product.variants.map((variant) => (
                          <div
                            key={variant.size}
                            className="flex items-center justify-between text-xs py-1.5"
                          >
                            <span className="font-semibold text-[#1F1A17] w-8">
                              {variant.size}
                            </span>

                            <div className="flex items-center gap-3">
                              {/* Lagos Stepper */}
                              <div className="flex items-center gap-1 bg-[#FAF9F6] border border-[#EADFD0] rounded-sm p-0.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateStock(
                                      product.id,
                                      variant.size,
                                      "hubALagos",
                                      Math.max(0, (variant.hubALagos || 0) - 1)
                                    )
                                  }
                                  className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#6E6A63] hover:text-[#1F1A17] hover:bg-white rounded-xs transition-colors cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="w-7 text-center font-mono text-xs font-semibold text-[#1F1A17]">
                                  {variant.hubALagos || 0}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateStock(
                                      product.id,
                                      variant.size,
                                      "hubALagos",
                                      (variant.hubALagos || 0) + 1
                                    )
                                  }
                                  className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#6E6A63] hover:text-[#1F1A17] hover:bg-white rounded-xs transition-colors cursor-pointer"
                                >
                                  +
                                </button>
                              </div>

                              {/* Toronto Stepper */}
                              <div className="flex items-center gap-1 bg-[#FAF9F6] border border-[#EADFD0] rounded-sm p-0.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateStock(
                                      product.id,
                                      variant.size,
                                      "hubBToronto",
                                      Math.max(0, (variant.hubBToronto || 0) - 1)
                                    )
                                  }
                                  className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#6E6A63] hover:text-[#1F1A17] hover:bg-white rounded-xs transition-colors cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="w-7 text-center font-mono text-xs font-semibold text-[#1F1A17]">
                                  {variant.hubBToronto || 0}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateStock(
                                      product.id,
                                      variant.size,
                                      "hubBToronto",
                                      (variant.hubBToronto || 0) + 1
                                    )
                                  }
                                  className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#6E6A63] hover:text-[#1F1A17] hover:bg-white rounded-xs transition-colors cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-6 py-4 border-t border-[#EADFD0]/60 bg-[#FAF9F6]/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onEditProduct(product)}
                      className="text-[#7A491D] font-medium hover:underline cursor-pointer"
                    >
                      Edit Details
                    </button>
                    <span>·</span>
                    <Link
                      href="/shop"
                      target="_blank"
                      className="text-[#6E6A63] hover:text-[#1F1A17] transition-colors"
                    >
                      View in Shop →
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete "${product.title}" from catalog?`)) {
                        onDeleteProduct(product.id);
                      }
                    }}
                    className="text-[#9E1015] hover:underline cursor-pointer text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
