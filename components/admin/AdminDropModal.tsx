"use client";

import React, { useState } from "react";
import { BrandRecord, CollectionRecord } from "@/lib/store-data";

interface AdminDropModalProps {
  isOpen: boolean;
  onClose: () => void;
  brands: BrandRecord[];
  onSave: (data: Omit<CollectionRecord, "id">) => Promise<void> | void;
}

export function AdminDropModal({
  isOpen,
  onClose,
  brands,
  onSave,
}: AdminDropModalProps) {
  if (!isOpen) return null;

  return (
    <AdminDropModalContent
      onClose={onClose}
      brands={brands}
      onSave={onSave}
    />
  );
}

function AdminDropModalContent({
  onClose,
  brands,
  onSave,
}: {
  onClose: () => void;
  brands: BrandRecord[];
  onSave: (data: Omit<CollectionRecord, "id">) => Promise<void> | void;
}) {
  const defaultBrand = brands[0] || {
    id: "brand-macklemore",
    name: "Macklemore Fashion",
  };

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [seasonCode, setSeasonCode] = useState("AW26");
  const [brandId, setBrandId] = useState(defaultBrand.id);
  const [manifesto, setManifesto] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState(
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80"
  );
  const [releaseDate, setReleaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isDropLive, setIsDropLive] = useState(true);
  const [isVipLocked, setIsVipLocked] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, "-")) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "drops");

    setIsUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data?.url) {
        setHeroImageUrl(data.url);
      }
    } catch {
      // Fallback
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedBrand = brands.find((b) => b.id === brandId) || defaultBrand;

    setIsSubmitting(true);
    try {
      await onSave({
        title: title.trim(),
        slug:
          slug.trim() ||
          title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
        seasonCode: seasonCode.trim() || "CAPSULE",
        manifesto:
          manifesto.trim() ||
          "Curated African couture release blending traditional craftsmanship with contemporary elegance.",
        heroImageUrl,
        releaseDate: new Date(releaseDate).toISOString(),
        isDropLive,
        isVipLocked,
        brandId: selectedBrand.id,
        brandName: selectedBrand.name,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl rounded-sm border border-[#EADFD0] bg-white p-7 sm:p-8 shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-[#EADFD0]/60 pb-4 mb-6">
          <div>
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-[#1F1A17]">
              Publish New Capsule Drop
            </h3>
            <p className="text-xs text-[#6E6A63] mt-0.5">
              Launch seasonal lookbooks, campaign stories, and inventory capsules
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-lg text-[#6E6A63] hover:text-[#1F1A17] transition-colors cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-[#4A4742] mb-1">
                Drop Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Harmattan Royal Gala 2026"
                className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] placeholder:text-[#A8A29E] focus:border-[#7A491D] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#4A4742] mb-1">
                URL Slug
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. harmattan-royal-gala-2026"
                className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs font-mono text-[#1F1A17] placeholder:text-[#A8A29E] focus:border-[#7A491D] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#4A4742] mb-1">
                Season Code
              </label>
              <input
                type="text"
                required
                value={seasonCode}
                onChange={(e) => setSeasonCode(e.target.value)}
                placeholder="e.g. AW26, SS26, RESORT"
                className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs uppercase font-mono text-[#1F1A17] placeholder:text-[#A8A29E] focus:border-[#7A491D] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#4A4742] mb-1">
                Partner Fashion House
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#4A4742] mb-1">
                Release Date
              </label>
              <input
                type="date"
                required
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#4A4742] mb-1">
              Editorial Manifesto &amp; Storyline
            </label>
            <textarea
              rows={3}
              value={manifesto}
              onChange={(e) => setManifesto(e.target.value)}
              placeholder="Describe the cultural inspiration, textile selection, and artisanal techniques behind this release..."
              className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] placeholder:text-[#A8A29E] focus:border-[#7A491D] focus:bg-white focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#4A4742] mb-1">
              Hero Campaign Image
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2 text-xs font-mono text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
              />

              <div className="flex items-center gap-3">
                <label className="rounded-sm border border-[#EADFD0] bg-white px-3 py-1.5 text-xs font-medium text-[#7A491D] hover:bg-[#FAF9F6] transition-colors cursor-pointer">
                  {isUploading ? "Uploading to S3..." : "Upload Lookbook Cover"}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleFileUpload(file);
                    }}
                  />
                </label>
                <span className="text-[11px] text-[#8C887B]">
                  JPEG, PNG, or WebP up to 10MB
                </span>
              </div>

              {heroImageUrl && (
                <div className="relative aspect-16/9 w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] overflow-hidden">
                  <img
                    src={heroImageUrl}
                    alt="Drop Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <label className="flex items-center gap-2.5 rounded-sm border border-[#EADFD0] p-3 bg-[#FAF9F6]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={isDropLive}
                onChange={(e) => setIsDropLive(e.target.checked)}
                className="rounded-sm border-[#EADFD0] text-[#7A491D] focus:ring-0"
              />
              <div className="text-xs">
                <div className="font-semibold text-[#1F1A17]">
                  Publish Live Immediately
                </div>
                <div className="text-[#6E6A63] text-[11px]">
                  Visible on public storefront collections
                </div>
              </div>
            </label>

            <label className="flex items-center gap-2.5 rounded-sm border border-[#EADFD0] p-3 bg-[#FAF9F6]/50 cursor-pointer">
              <input
                type="checkbox"
                checked={isVipLocked}
                onChange={(e) => setIsVipLocked(e.target.checked)}
                className="rounded-sm border-[#EADFD0] text-[#7A491D] focus:ring-0"
              />
              <div className="text-xs">
                <div className="font-semibold text-[#1F1A17]">
                  VIP Invitation Only
                </div>
                <div className="text-[#6E6A63] text-[11px]">
                  Require VIP client credentials to view
                </div>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EADFD0]/60">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="rounded-sm border border-[#EADFD0] bg-white px-5 py-2.5 text-xs font-medium text-[#1F1A17] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="rounded-sm bg-[#7A491D] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#5C3614] shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Publishing..." : "Publish Capsule Drop"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}