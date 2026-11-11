"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandRecord } from "@/lib/store-data";

interface AdminBrandsTabProps {
  brands: BrandRecord[];
  onAddNewBrand: () => void;
  onEditBrand?: (brand: BrandRecord) => void;
  onDeleteBrand?: (brandId: string, brandName: string) => Promise<void> | void;
}

export function AdminBrandsTab({
  brands,
  onAddNewBrand,
  onEditBrand,
  onDeleteBrand,
}: AdminBrandsTabProps) {
  const [confirmDeleteBrand, setConfirmDeleteBrand] = useState<BrandRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!confirmDeleteBrand || !onDeleteBrand) return;
    setIsDeleting(true);
    try {
      await onDeleteBrand(confirmDeleteBrand.id, confirmDeleteBrand.name);
      setConfirmDeleteBrand(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Action */}
      <div className="rounded-sm border border-[#EADFD0] bg-white p-7 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#1F1A17]">
            Partner Fashion Houses
          </h2>
          <p className="text-xs text-[#6E6A63] mt-0.5">
            Curated African luxury ateliers and commission settlement parameters
          </p>
        </div>

        <button
          onClick={onAddNewBrand}
          type="button"
          className="rounded-sm bg-[#7A491D] px-6 py-3 text-xs font-semibold tracking-wider text-white uppercase shadow-xs hover:bg-[#5C3614] transition-all cursor-pointer flex items-center gap-2"
        >
          <span>+</span>
          <span>Add Partner House</span>
        </button>
      </div>

      {/* Brand Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="rounded-sm border border-[#EADFD0] bg-white overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              {/* Brand Cover / Banner */}
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
                    className={`rounded-sm px-2.5 py-1 text-xs font-medium uppercase ${
                      brand.isProprietary
                        ? "bg-[#7A491D] text-white"
                        : "bg-white/95 text-[#7A491D] border border-[#EADFD0]"
                    }`}
                  >
                    {brand.isProprietary ? "Proprietary Label" : "Partner Atelier"}
                  </span>
                </div>
              </div>

              {/* Brand Details */}
              <div className="p-6 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#1F1A17]">
                    {brand.name}
                  </h3>
                  <span className="text-xs font-mono text-[#7A491D]">
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
                    Slug: <span className="font-mono text-xs text-[#7A491D]">/{brand.slug}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="px-6 py-4 border-t border-[#EADFD0]/60 bg-[#FAF9F6]/50 flex items-center justify-between text-xs">
              <Link
                href={`/brands/${brand.slug}`}
                target="_blank"
                className="text-[#7A491D] font-medium hover:underline flex items-center gap-1"
              >
                <span>View Atelier Page</span>
                <span>→</span>
              </Link>

              <div className="flex items-center gap-3">
                {onEditBrand && (
                  <button
                    type="button"
                    onClick={() => onEditBrand(brand)}
                    className="text-[#6E6A63] hover:text-[#1F1A17] transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                )}

                {onDeleteBrand && !brand.isProprietary && (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteBrand(brand)}
                    className="text-[#E31E24] hover:text-[#9E1015] transition-colors cursor-pointer font-medium"
                  >
                    Delete House
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-sm border border-[#EADFD0] bg-white p-7 shadow-2xl space-y-5">
            <div className="border-b border-[#EADFD0]/60 pb-3">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#1F1A17]">
                Delete Partner House
              </h3>
              <p className="text-xs text-[#6E6A63] mt-1">
                Permanent catalog deletion
              </p>
            </div>

            <div className="text-xs text-[#4A4742] space-y-2 leading-relaxed">
              <p>
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#1F1A17]">
                  {confirmDeleteBrand.name}
                </span>
                ?
              </p>
              <p className="text-[#9E1015] bg-[#FDF2F2] border border-[#E31E24]/20 p-2.5 rounded-sm">
                Warning: Removing this house will remove all associated collections, products, and commission settlement mappings from the active store.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setConfirmDeleteBrand(null)}
                className="rounded-sm border border-[#EADFD0] bg-white px-4 py-2.5 text-xs font-medium text-[#1F1A17] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="rounded-sm bg-[#E31E24] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#B9151A] transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}