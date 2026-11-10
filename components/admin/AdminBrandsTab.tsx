"use client";

import React from "react";
import Link from "next/link";
import { BrandRecord } from "@/lib/store-data";

interface AdminBrandsTabProps {
  brands: BrandRecord[];
  onAddNewBrand: () => void;
  onEditBrand?: (brand: BrandRecord) => void;
}

export function AdminBrandsTab({
  brands,
  onAddNewBrand,
  onEditBrand,
}: AdminBrandsTabProps) {
  return (
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="rounded-3xl border border-[#EADFD0] bg-white p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold uppercase tracking-tight text-[#1F1A17]">
            Partner Fashion Houses
          </h2>
          <p className="text-xs text-[#6E6A63]">
            Curated African luxury ateliers and commission settlement parameters
          </p>
        </div>

        <button
          onClick={onAddNewBrand}
          type="button"
          className="rounded-xl bg-[#7A491D] px-5 py-3 text-xs font-semibold tracking-wider text-white uppercase shadow-sm hover:bg-[#5C3614] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
        >
          <span className="text-base leading-none">+</span>
          <span>Add Partner House</span>
        </button>
      </div>

      {/* Brand Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="rounded-3xl border border-[#EADFD0] bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Brand Cover / Logo */}
              <div className="relative aspect-16/9 w-full bg-[#FAF9F6] overflow-hidden border-b border-[#EADFD0]/60">
                <img
                  src={brand.lookbookBannerUrl}
                  alt={brand.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-semibold tracking-wider uppercase ${
                      brand.isProprietary
                        ? "bg-[#7A491D] text-white"
                        : "bg-white/90 backdrop-blur-xs text-[#7A491D] border border-[#EADFD0]"
                    }`}
                  >
                    {brand.isProprietary ? "Proprietary Label" : "Partner Atelier"}
                  </span>
                </div>
              </div>

              {/* Brand Details */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#1F1A17]">
                    {brand.name}
                  </h3>
                  <span className="rounded-full bg-[#FAF5EE] border border-[#EADFD0] px-2.5 py-0.5 text-[10px] font-mono text-[#7A491D]">
                    {brand.commissionRatePct}% Commission
                  </span>
                </div>

                <p className="text-xs text-[#6E6A63] line-clamp-2 leading-relaxed">
                  {brand.bio || brand.story || "Contemporary African luxury curation, artisanal fabrics, and signature silhouettes."}
                </p>

                <div className="pt-2 text-xs text-[#6E6A63] space-y-1">
                  <div>
                    Origin: <span className="font-medium text-[#1F1A17]">{brand.originCountry}</span>
                  </div>
                  <div>
                    Slug: <span className="font-mono text-[11px] text-[#7A491D]">/{brand.slug}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="px-6 py-3 border-t border-[#EADFD0]/60 bg-[#FAF9F6]/50 flex items-center justify-between text-xs">
              <Link
                href={`/brands/${brand.slug}`}
                target="_blank"
                className="text-[#7A491D] font-medium hover:underline flex items-center gap-1"
              >
                <span>View Atelier Page</span>
                <span>↗</span>
              </Link>

              {onEditBrand && (
                <button
                  type="button"
                  onClick={() => onEditBrand(brand)}
                  className="text-[#6E6A63] hover:text-[#1F1A17] transition-colors cursor-pointer"
                >
                  Edit Commission
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

