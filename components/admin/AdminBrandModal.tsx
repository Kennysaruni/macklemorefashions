"use client";

import React, { useState } from "react";
import { BrandRecord } from "@/lib/store-data";

interface AdminBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand?: BrandRecord | null;
  onSave: (brandData: Partial<BrandRecord>) => void;
}

export function AdminBrandModal({
  isOpen,
  onClose,
  brand,
  onSave,
}: AdminBrandModalProps) {
  if (!isOpen) return null;

  return (
    <AdminBrandModalContent
      key={brand?.id || "new-brand"}
      onClose={onClose}
      brand={brand}
      onSave={onSave}
    />
  );
}

function AdminBrandModalContent({
  onClose,
  brand,
  onSave,
}: {
  onClose: () => void;
  brand?: BrandRecord | null;
  onSave: (brandData: Partial<BrandRecord>) => void;
}) {
  const [name, setName] = useState(brand?.name || "");
  const [slug, setSlug] = useState(brand?.slug || "");
  const [tagline, setTagline] = useState(brand?.tagline || "");
  const [originCountry, setOriginCountry] = useState(brand?.originCountry || "Nigeria");
  const [commissionRatePct, setCommissionRatePct] = useState(brand?.commissionRatePct ?? 15);
  const [lookbookBannerUrl, setLookbookBannerUrl] = useState(
    brand?.lookbookBannerUrl ||
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
  );
  const [bio, setBio] = useState(brand?.bio || "");
  const [isProprietary, setIsProprietary] = useState(brand?.isProprietary || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(brand ? { id: brand.id } : {}),
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      tagline: tagline || "Afro-Luxury Curation",
      originCountry,
      commissionRatePct,
      lookbookBannerUrl,
      secondaryBannerUrl: lookbookBannerUrl,
      bio,
      story: bio,
      isProprietary,
      allocatedRegions: ["NG", "CA", "GH", "KE", "US", "GB"],
      isActive: true,
      originCity: "Nigeria",
      creativeDirector: "Atelier Collective",
      foundedYear: 2024,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl border border-[#EADFD0] bg-white p-6 sm:p-8 shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-[#EADFD0]/60 pb-4 mb-6">
          <div>
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-[#1F1A17]">
              {brand ? "Edit Partner House" : "Add Partner Fashion House"}
            </h3>
            <p className="text-xs text-[#6E6A63]">
              Configure atelier profile and storefront commission rate
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF9F6] border border-[#EADFD0] text-sm text-[#6E6A63] hover:text-[#1F1A17] hover:bg-white flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#4A4742]">Atelier / Brand Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!brand) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                }
              }}
              placeholder="e.g. Deji & Kola"
              className="w-full rounded-xl border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#4A4742]">URL Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="deji-and-kola"
                className="w-full rounded-xl border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#4A4742]">Origin Country</label>
              <input
                type="text"
                required
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                placeholder="Nigeria"
                className="w-full rounded-xl border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#4A4742]">
                Commission Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={commissionRatePct}
                onChange={(e) => setCommissionRatePct(Number(e.target.value))}
                className="w-full rounded-xl border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#4A4742]">Classification</label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is-proprietary"
                  checked={isProprietary}
                  onChange={(e) => setIsProprietary(e.target.checked)}
                  className="rounded border-[#EADFD0] text-[#7A491D] focus:ring-[#7A491D]"
                />
                <label htmlFor="is-proprietary" className="text-xs text-[#1F1A17] cursor-pointer">
                  In-House Label
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#4A4742]">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Modern African Tailoring"
              className="w-full rounded-xl border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#4A4742]">Lookbook Banner Image URL</label>
            <input
              type="text"
              value={lookbookBannerUrl}
              onChange={(e) => setLookbookBannerUrl(e.target.value)}
              className="w-full rounded-xl border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#4A4742]">Atelier Bio &amp; Story</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Atelier heritage, bespoke tailoring..."
              className="w-full rounded-xl border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EADFD0]/60">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#EADFD0] bg-[#FAF9F6] px-5 py-2.5 text-xs font-medium text-[#6E6A63] hover:text-[#1F1A17] hover:bg-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#7A491D] px-6 py-2.5 text-xs font-semibold text-white uppercase shadow-sm hover:bg-[#5C3614] transition-all cursor-pointer"
            >
              Save Partner House
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
