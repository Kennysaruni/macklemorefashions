"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePlatform } from "@/lib/platform-context";
import {
  B2BLeadStatus,
  convertPrice,
  formatCurrencyValue,
  GenderTarget,
  getTotalProductStock,
  ProductRecord,
} from "@/lib/store-data";

type AdminModule =
  | "BRAND_CMS"
  | "SKU_MATRIX"
  | "DROP_ENGINE"
  | "B2B_DESK"
  | "ORDER_RECONCILIATION";

export default function AdminConsolePage() {
  const {
    brands,
    addBrand,
    products,
    addProduct,
    updateVariantStock,
    collections,
    toggleCollectionLive,
    orders,
    updateOrderStatus,
    b2bInquiries,
    updateB2BStatus,
    vipTribalTeaserMode,
    setVipTribalTeaserMode,
  } = usePlatform();

  const [activeModule, setActiveModule] = useState<AdminModule>("BRAND_CMS");
  const [actionToast, setActionToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 4500);
  };

  // --- Module 1: Brand Representation CMS Form State ---
  const [brandName, setBrandName] = useState("");
  const [brandSlug, setBrandSlug] = useState("");
  const [brandTagline, setBrandTagline] = useState("");
  const [brandOriginCity, setBrandOriginCity] = useState("LAGOS / MILAN");
  const [brandOriginCountry, setBrandOriginCountry] = useState(
    "Nigeria & Italy"
  );
  const [brandDirector, setBrandDirector] = useState("");
  const [brandCommission, setBrandCommission] = useState("24.0");
  const [brandBannerUrl, setBrandBannerUrl] = useState(
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1800&q=85"
  );
  const [brandBio, setBrandBio] = useState("");
  const [brandStory, setBrandStory] = useState("");
  const [brandRegions, setBrandRegions] = useState<string[]>([
    "WEST_AFRICA",
    "EAST_AFRICA",
    "NORTH_AMERICA",
  ]);

  const handleToggleRegion = (region: string) => {
    setBrandRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug =
      brandSlug.trim() ||
      brandName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const created = addBrand({
      slug: cleanSlug,
      name: brandName.trim().toUpperCase(),
      tagline:
        brandTagline.trim().toUpperCase() ||
        "REPRESENTED PARTNER HOUSE // THE COLLECTIVE ARCHIVE",
      bio: brandBio.trim(),
      story: brandStory.trim() || brandBio.trim(),
      originCity: brandOriginCity.trim().toUpperCase(),
      originCountry: brandOriginCountry.trim(),
      creativeDirector: brandDirector.trim() || "House Creative Directorate",
      foundedYear: 2024,
      isProprietary: false,
      lookbookBannerUrl: brandBannerUrl.trim(),
      secondaryBannerUrl: brandBannerUrl.trim(),
      commissionRatePct: parseFloat(brandCommission) || 22.5,
      allocatedRegions: brandRegions,
      isActive: true,
    });
    setBrandName("");
    setBrandSlug("");
    setBrandTagline("");
    setBrandBio("");
    setBrandStory("");
    triggerToast(
      `✓ BRAND ONBOARDED: /brands/${created.slug} BOUTIQUE MICROSITE IS NOW LIVE.`
    );
  };

  // --- Module 2: New Product SKU Form State ---
  const [showNewSkuForm, setShowNewSkuForm] = useState(false);
  const [newSkuTitle, setNewSkuTitle] = useState("");
  const [newSkuBrandSlug, setNewSkuBrandSlug] = useState("macklemore");
  const [newSkuCategory, setNewSkuCategory] =
    useState<ProductRecord["category"]>("OUTERWEAR");
  const [newSkuGender, setNewSkuGender] = useState<GenderTarget>("UNISEX");
  const [newSkuGsm, setNewSkuGsm] = useState("560");
  const [newSkuPriceCad, setNewSkuPriceCad] = useState("640");
  const [newSkuOrigin, setNewSkuOrigin] = useState("LAGOS / TORONTO");
  const [newSkuEditorialImg, setNewSkuEditorialImg] = useState(
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"
  );
  const [newSkuFlatlayImg, setNewSkuFlatlayImg] = useState(
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85"
  );

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedBrand =
      brands.find((b) => b.slug === newSkuBrandSlug) || brands[0];
    const cleanSlug = newSkuTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const prefix = `MKM-${Math.floor(100 + Math.random() * 899)}`;

    const created = addProduct({
      slug: cleanSlug,
      skuPrefix: prefix,
      title: newSkuTitle.trim().toUpperCase(),
      subtitle: `${newSkuGsm} GSM Architectural Allocation`,
      description:
        "Specification-stamped luxury garment allocated across Hub A (Victoria Island, Lagos) and Hub B (Toronto).",
      gender: newSkuGender,
      category: newSkuCategory,
      fabricWeightGsm: parseInt(newSkuGsm, 10) || 540,
      fabricComposition: "100% Heavyweight Archival Weave",
      originLabel: newSkuOrigin.toUpperCase(),
      basePriceCad: parseInt(newSkuPriceCad, 10) || 550,
      editorialImageUrl: newSkuEditorialImg,
      flatlayImageUrl: newSkuFlatlayImg,
      colorName: "RAW IVORY / BRONZE",
      colorHex: "#7A491D",
      isFeatured: true,
      brandId: matchedBrand.id,
      brandSlug: matchedBrand.slug,
      brandName: matchedBrand.name,
      collectionSlug: collections[0]?.slug || "drop-04-harmattan-frost",
      variants: [
        { size: "S", sku: `${prefix}-S`, hubALagos: 6, hubBToronto: 5 },
        { size: "M", sku: `${prefix}-M`, hubALagos: 10, hubBToronto: 8 },
        { size: "L", sku: `${prefix}-L`, hubALagos: 8, hubBToronto: 6 },
        { size: "XL", sku: `${prefix}-XL`, hubALagos: 4, hubBToronto: 4 },
      ],
    });
    setNewSkuTitle("");
    setShowNewSkuForm(false);
    triggerToast(
      `✓ SKU REGISTERED: ${created.skuPrefix} (${created.title}) ALLOCATED TO HUB A & HUB B.`
    );
  };

  const totalUnitsAllHubs = products.reduce(
    (acc, p) => acc + getTotalProductStock(p).total,
    0
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111]">
      {/* Executive Header */}
      <section className="border-b border-[#E5E0D8] bg-white px-4 py-10 md:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.24em] text-[#7A491D] font-semibold uppercase mb-2">
                <span className="inline-block h-2 w-2 bg-[#2E6B35]" />
                <span>
                  MACKLEMORE EXECUTIVE COMMAND CONSOLE // SUPERADMIN PORTAL
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight uppercase text-[#111111]">
                RETAIL, WAREHOUSE &amp; B2B MANAGEMENT
              </h1>
            </div>

            {/* Quick VIP Teaser Mode Master Switch */}
            <div className="flex items-center gap-4 border border-[#E5E0D8] bg-[#FAF9F6] p-4">
              <div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-[#6E6A63] uppercase">
                  STOREFRONT MODE
                </div>
                <div className="font-mono text-xs font-bold uppercase mt-0.5">
                  {vipTribalTeaserMode ? (
                    <span className="text-[#E31E24]">
                      VIP TEASER VAULT (LOCKED)
                    </span>
                  ) : (
                    <span className="text-[#2E6B35]">
                      PUBLIC STOREFRONT LIVE
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !vipTribalTeaserMode;
                  setVipTribalTeaserMode(next);
                  triggerToast(
                    next
                      ? "VAULT ENGAGED: STOREFRONT FLIPPED TO 'VIP TRIBAL TEASER MODE'."
                      : "VAULT DISENGAGED: PUBLIC STOREFRONT UNLOCKED."
                  );
                }}
                className={`px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors cursor-pointer ${
                  vipTribalTeaserMode
                    ? "bg-[#2E6B35] text-white hover:bg-[#111111]"
                    : "bg-[#111111] text-white hover:bg-[#E31E24]"
                }`}
              >
                {vipTribalTeaserMode
                  ? "UNLOCK STOREFRONT"
                  : "ENGAGE VIP TEASER"}
              </button>
            </div>
          </div>

          {/* Telemetry KPI Strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 border border-[#E5E0D8] divide-y sm:divide-y-0 sm:divide-x divide-[#E5E0D8] bg-[#FAF9F6] font-mono">
            <div className="p-4">
              <div className="text-[10px] text-[#6E6A63] uppercase">
                REPRESENTED HOUSES
              </div>
              <div className="text-2xl font-bold text-[#111111] mt-1">
                {brands.length} BRANDS
              </div>
            </div>
            <div className="p-4">
              <div className="text-[10px] text-[#6E6A63] uppercase">
                ACTIVE SKUS &amp; STOCK
              </div>
              <div className="text-2xl font-bold text-[#7A491D] mt-1">
                {products.length} SKUS · {totalUnitsAllHubs}U
              </div>
            </div>
            <div className="p-4">
              <div className="text-[10px] text-[#6E6A63] uppercase">
                SEASONAL CAPSULES
              </div>
              <div className="text-2xl font-bold text-[#111111] mt-1">
                {collections.length} DROPS
              </div>
            </div>
            <div className="p-4">
              <div className="text-[10px] text-[#6E6A63] uppercase">
                B2B PIPELINE LEADS
              </div>
              <div className="text-2xl font-bold text-[#2E6B35] mt-1">
                {b2bInquiries.length} DOSSIERS
              </div>
            </div>
            <div className="p-4">
              <div className="text-[10px] text-[#6E6A63] uppercase">
                UNIFIED ORDERS
              </div>
              <div className="text-2xl font-bold text-[#111111] mt-1">
                {orders.length} LEDGER
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Toast Notification */}
      {actionToast && (
        <div className="mx-auto max-w-[1440px] px-4 pt-6 md:px-8">
          <div className="border border-[#111111] bg-white px-5 py-3.5 font-mono text-xs text-[#111111] font-semibold flex items-center justify-between">
            <span>{actionToast}</span>
            <button
              type="button"
              onClick={() => setActionToast(null)}
              className="text-[#6E6A63] hover:text-[#111111] cursor-pointer"
            >
              DISMISS ×
            </button>
          </div>
        </div>
      )}

      {/* 5-Module Navigation Rail */}
      <section className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-5 border border-[#E5E0D8] mb-10 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E0D8] bg-white">
          {(
            [
              {
                id: "BRAND_CMS",
                code: "01 // BRAND CMS",
                label: "Partner Brand Onboarding",
              },
              {
                id: "SKU_MATRIX",
                code: "02 // SKU MATRIX",
                label: "Hub A & Hub B Warehouse",
              },
              {
                id: "DROP_ENGINE",
                code: "03 // DROP ENGINE",
                label: "Countdown & VIP Vault",
              },
              {
                id: "B2B_DESK",
                code: "04 // B2B WHOLESALE",
                label: "Representation Pipeline",
              },
              {
                id: "ORDER_RECONCILIATION",
                code: "05 // RECONCILIATION",
                label: "Stripe · Paystack · M-Pesa",
              },
            ] as const
          ).map((tab) => {
            const active = activeModule === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveModule(tab.id)}
                className={`p-4 text-left transition-colors cursor-pointer ${
                  active
                    ? "bg-[#111111] text-white"
                    : "bg-white text-[#4A4742] hover:bg-[#FAF9F6] hover:text-[#111111]"
                }`}
              >
                <div
                  className={`font-mono text-[10px] tracking-[0.2em] uppercase font-semibold ${
                    active ? "text-[#E5E0D8]" : "text-[#7A491D]"
                  }`}
                >
                  {tab.code}
                </div>
                <div className="font-display text-sm font-bold uppercase mt-1">
                  {tab.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* ============================================================
            MODULE 1: BRAND REPRESENTATION CMS
           ============================================================ */}
        {activeModule === "BRAND_CMS" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Onboard Partner Brand Form */}
            <div className="lg:col-span-5 border border-[#E5E0D8] bg-white p-6 md:p-8">
              <div className="font-mono text-[10px] tracking-[0.22em] text-[#7A491D] font-semibold uppercase mb-2">
                MODULE 01 // ONBOARD PARTNER FASHION HOUSE
              </div>
              <h2 className="font-display text-2xl font-bold uppercase text-[#111111] mb-6">
                GENERATE /BRANDS/[SLUG] BOUTIQUE
              </h2>

              <form onSubmit={handleCreateBrand} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-[#4A4742] font-semibold uppercase mb-1">
                      BRAND NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g., KORA ATELIER"
                      className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-3.5 py-2.5 font-mono text-xs text-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-[#4A4742] font-semibold uppercase mb-1">
                      URL SLUG (AUTO IF BLANK)
                    </label>
                    <input
                      type="text"
                      value={brandSlug}
                      onChange={(e) => setBrandSlug(e.target.value)}
                      placeholder="kora-atelier"
                      className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-3.5 py-2.5 font-mono text-xs text-[#111111]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#4A4742] font-semibold uppercase mb-1">
                    ARCHITECTURAL TAGLINE *
                  </label>
                  <input
                    type="text"
                    required
                    value={brandTagline}
                    onChange={(e) => setBrandTagline(e.target.value)}
                    placeholder="SCULPTURAL DAKAR TAILORING & RAW SILK"
                    className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-3.5 py-2.5 font-mono text-xs text-[#111111]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-[#4A4742] font-semibold uppercase mb-1">
                      ORIGIN CORRIDOR
                    </label>
                    <input
                      type="text"
                      value={brandOriginCity}
                      onChange={(e) => setBrandOriginCity(e.target.value)}
                      className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-3.5 py-2.5 font-mono text-xs text-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-[#4A4742] font-semibold uppercase mb-1">
                      CREATIVE DIRECTOR
                    </label>
                    <input
                      type="text"
                      value={brandDirector}
                      onChange={(e) => setBrandDirector(e.target.value)}
                      placeholder="Amadou Diop"
                      className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-3.5 py-2.5 font-mono text-xs text-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-[#4A4742] font-semibold uppercase mb-1">
                      COMMISSION %
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={brandCommission}
                      onChange={(e) => setBrandCommission(e.target.value)}
                      className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-3.5 py-2.5 font-mono text-xs text-[#111111]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#4A4742] font-semibold uppercase mb-1">
                    LOOKBOOK CAMPAIGN BANNER URL
                  </label>
                  <input
                    type="text"
                    value={brandBannerUrl}
                    onChange={(e) => setBrandBannerUrl(e.target.value)}
                    className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-3.5 py-2.5 font-mono text-xs text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#4A4742] font-semibold uppercase mb-1">
                    BRAND BIO &amp; MANIFESTO *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={brandBio}
                    onChange={(e) => setBrandBio(e.target.value)}
                    placeholder="Enter house positioning, material philosophy, and continental distribution strategy..."
                    className="w-full border border-[#E5E0D8] bg-[#FAF9F6] p-3 font-mono text-xs text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#4A4742] font-semibold uppercase mb-2">
                    ALLOCATED DISTRIBUTION REGIONS
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "WEST_AFRICA",
                      "EAST_AFRICA",
                      "NORTH_AMERICA",
                      "EUROPE",
                      "UK",
                    ].map((reg) => {
                      const active = brandRegions.includes(reg);
                      return (
                        <button
                          key={reg}
                          type="button"
                          onClick={() => handleToggleRegion(reg)}
                          className={`border px-3 py-1.5 font-mono text-[10px] uppercase cursor-pointer ${
                            active
                              ? "border-[#111111] bg-[#111111] text-white font-bold"
                              : "border-[#E5E0D8] bg-[#FAF9F6] text-[#4A4742]"
                          }`}
                        >
                          {reg}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#111111] py-3.5 font-mono text-xs font-semibold tracking-[0.2em] text-white uppercase hover:bg-[#E31E24] transition-colors cursor-pointer"
                >
                  ONBOARD BRAND &amp; DEPLOY MICROSITE →
                </button>
              </form>
            </div>

            {/* Right: Active Represented Brands Roster */}
            <div className="lg:col-span-7 border border-[#E5E0D8] bg-white p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4 mb-6">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.22em] text-[#7A491D] font-semibold uppercase">
                    ACTIVE REPRESENTATION PORTFOLIO
                  </div>
                  <h3 className="font-display text-2xl font-bold uppercase text-[#111111] mt-1">
                    {brands.length} HOUSES UNDER MANAGEMENT
                  </h3>
                </div>
                <Link
                  href="/brands"
                  className="border border-[#111111] bg-white px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-[#111111] uppercase hover:bg-[#111111] hover:text-white transition-colors"
                >
                  VIEW PUBLIC DIRECTORY →
                </Link>
              </div>

              <div className="divide-y divide-[#E5E0D8] border border-[#E5E0D8]">
                {brands.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 bg-[#FAF9F6] flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-3">
                        <span className="font-display text-xl font-bold uppercase text-[#111111]">
                          {b.name}
                        </span>
                        <span className="border border-[#E5E0D8] bg-white px-2.5 py-0.5 font-mono text-[10px] text-[#7A491D] font-semibold uppercase">
                          {b.isProprietary
                            ? "PROPRIETARY HOUSE"
                            : `COMMISSION: ${b.commissionRatePct}%`}
                        </span>
                      </div>
                      <div className="font-mono text-[10px] tracking-[0.16em] text-[#6E6A63] uppercase">
                        ORIGIN: {b.originCity} · DIRECTOR: {b.creativeDirector}
                      </div>
                      <p className="text-xs text-[#4A4742] line-clamp-2 mt-1">
                        {b.bio}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {b.allocatedRegions.map((r) => (
                          <span
                            key={r}
                            className="border border-[#E5E0D8] bg-white px-2 py-0.5 font-mono text-[9px] text-[#4A4742] uppercase"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={`/brands/${b.slug}`}
                      className="bg-[#111111] px-4 py-2.5 font-mono text-[10px] tracking-[0.18em] text-white uppercase hover:bg-[#E31E24] transition-colors"
                    >
                      OPEN /BRANDS/{b.slug.toUpperCase()} →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            MODULE 2: PRODUCT & MULTI-WAREHOUSE SKU MATRIX
           ============================================================ */}
        {activeModule === "SKU_MATRIX" && (
          <div className="border border-[#E5E0D8] bg-white p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] pb-5">
              <div>
                <div className="font-mono text-[10px] tracking-[0.22em] text-[#7A491D] font-semibold uppercase">
                  MODULE 02 // PRODUCT &amp; MULTI-WAREHOUSE SKU MATRIX
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#111111] mt-1">
                  HUB A (LAGOS) &amp; HUB B (TORONTO) STOCK LEDGER
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowNewSkuForm(!showNewSkuForm)}
                className="bg-[#111111] px-5 py-3 font-mono text-xs font-semibold tracking-[0.2em] text-white uppercase hover:bg-[#E31E24] transition-colors cursor-pointer"
              >
                {showNewSkuForm ? "CLOSE SKU CREATOR" : "+ REGISTER NEW SKU"}
              </button>
            </div>

            {showNewSkuForm && (
              <form
                onSubmit={handleCreateProduct}
                className="border border-[#111111] bg-[#FAF9F6] p-6 space-y-4"
              >
                <div className="font-mono text-xs text-[#7A491D] font-semibold uppercase">
                  REGISTER NEW MULTI-HUB GARMENT SKU
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-[#4A4742] uppercase mb-1">
                      GARMENT TITLE *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSkuTitle}
                      onChange={(e) => setNewSkuTitle(e.target.value)}
                      placeholder="ASO OKE TRENCH MONOLITH"
                      className="w-full border border-[#E5E0D8] bg-white px-3 py-2 font-mono text-xs text-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-[#4A4742] uppercase mb-1">
                      BRAND HOUSE
                    </label>
                    <select
                      value={newSkuBrandSlug}
                      onChange={(e) => setNewSkuBrandSlug(e.target.value)}
                      className="w-full border border-[#E5E0D8] bg-white px-3 py-2 font-mono text-xs text-[#111111]"
                    >
                      {brands.map((b) => (
                        <option key={b.id} value={b.slug}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-[#4A4742] uppercase mb-1">
                      CATEGORY
                    </label>
                    <select
                      value={newSkuCategory}
                      onChange={(e) =>
                        setNewSkuCategory(
                          e.target.value as ProductRecord["category"]
                        )
                      }
                      className="w-full border border-[#E5E0D8] bg-white px-3 py-2 font-mono text-xs text-[#111111]"
                    >
                      <option value="OUTERWEAR">OUTERWEAR</option>
                      <option value="KAFTAN_ARCHIVE">KAFTAN_ARCHIVE</option>
                      <option value="SHIRTING">SHIRTING</option>
                      <option value="TROUSERS">TROUSERS</option>
                      <option value="KNITWEAR">KNITWEAR</option>
                      <option value="ACCESSORIES">ACCESSORIES</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-[#4A4742] uppercase mb-1">
                      GENDER TARGET
                    </label>
                    <select
                      value={newSkuGender}
                      onChange={(e) =>
                        setNewSkuGender(e.target.value as GenderTarget)
                      }
                      className="w-full border border-[#E5E0D8] bg-white px-3 py-2 font-mono text-xs text-[#111111]"
                    >
                      <option value="UNISEX">UNISEX</option>
                      <option value="MEN">MEN</option>
                      <option value="WOMEN">WOMEN</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-[#4A4742] uppercase mb-1">
                      FABRIC WEIGHT (GSM)
                    </label>
                    <input
                      type="number"
                      value={newSkuGsm}
                      onChange={(e) => setNewSkuGsm(e.target.value)}
                      className="w-full border border-[#E5E0D8] bg-white px-3 py-2 font-mono text-xs text-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-[#4A4742] uppercase mb-1">
                      BASE PRICE (CAD $)
                    </label>
                    <input
                      type="number"
                      value={newSkuPriceCad}
                      onChange={(e) => setNewSkuPriceCad(e.target.value)}
                      className="w-full border border-[#E5E0D8] bg-white px-3 py-2 font-mono text-xs text-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-[#4A4742] uppercase mb-1">
                      ORIGIN STAMP
                    </label>
                    <input
                      type="text"
                      value={newSkuOrigin}
                      onChange={(e) => setNewSkuOrigin(e.target.value)}
                      className="w-full border border-[#E5E0D8] bg-white px-3 py-2 font-mono text-xs text-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-[#4A4742] uppercase mb-1">
                      LOOKBOOK IMAGE URL
                    </label>
                    <input
                      type="text"
                      value={newSkuEditorialImg}
                      onChange={(e) => setNewSkuEditorialImg(e.target.value)}
                      className="w-full border border-[#E5E0D8] bg-white px-3 py-2 font-mono text-xs text-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-[#4A4742] uppercase mb-1">
                      DETAIL HOVER IMAGE URL
                    </label>
                    <input
                      type="text"
                      value={newSkuFlatlayImg}
                      onChange={(e) => setNewSkuFlatlayImg(e.target.value)}
                      className="w-full border border-[#E5E0D8] bg-white px-3 py-2 font-mono text-xs text-[#111111]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-[#E31E24] px-6 py-3 font-mono text-xs font-bold tracking-[0.2em] text-white uppercase cursor-pointer"
                >
                  DEPLOY SKU TO HUB A &amp; HUB B →
                </button>
              </form>
            )}

            {/* Multi-Warehouse Matrix Table */}
            <div className="space-y-6">
              {products.map((prod) => {
                const stock = getTotalProductStock(prod);
                return (
                  <div
                    key={prod.id}
                    className="border border-[#E5E0D8] bg-[#FAF9F6] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4 mb-4">
                      <div>
                        <div className="font-mono text-[10px] tracking-[0.18em] text-[#7A491D] font-semibold uppercase">
                          {prod.skuPrefix} · {prod.brandName} ·{" "}
                          {prod.fabricWeightGsm} GSM · ORIGIN:{" "}
                          {prod.originLabel}
                        </div>
                        <h3 className="font-display text-xl font-bold uppercase text-[#111111] mt-1">
                          {prod.title}
                        </h3>
                      </div>

                      <div className="font-mono text-xs text-right">
                        <div className="text-[#111111] font-bold">
                          CAD ${prod.basePriceCad} ·{" "}
                          {formatCurrencyValue(convertPrice(prod, "NGN"), "NGN")}{" "}
                          ·{" "}
                          {formatCurrencyValue(convertPrice(prod, "KES"), "KES")}
                        </div>
                        <div className="text-[10px] text-[#6E6A63] mt-1">
                          TOTAL STOCK: {stock.total} UNITS (HUB A LAGOS:{" "}
                          {stock.hubALagos} · HUB B TORONTO: {stock.hubBToronto})
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {prod.variants.map((v) => (
                        <div
                          key={v.sku}
                          className="border border-[#E5E0D8] bg-white p-3 font-mono text-xs"
                        >
                          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-2 mb-2">
                            <span className="font-bold text-[#111111]">
                              SIZE {v.size}
                            </span>
                            <span className="text-[10px] text-[#6E6A63]">
                              {v.sku}
                            </span>
                          </div>

                          {/* Hub A Lagos Stock Control */}
                          <div className="flex items-center justify-between py-1">
                            <span className="text-[10px] text-[#4A4742]">
                              HUB A (LAGOS):
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  updateVariantStock(
                                    prod.id,
                                    v.size,
                                    "hubALagos",
                                    v.hubALagos - 1
                                  )
                                }
                                className="border border-[#E5E0D8] bg-[#FAF9F6] px-2 py-0.5 text-[#111111] hover:border-[#111111] cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-[#7A491D] font-bold">
                                {v.hubALagos}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateVariantStock(
                                    prod.id,
                                    v.size,
                                    "hubALagos",
                                    v.hubALagos + 1
                                  )
                                }
                                className="border border-[#E5E0D8] bg-[#FAF9F6] px-2 py-0.5 text-[#111111] hover:border-[#111111] cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Hub B Toronto Stock Control */}
                          <div className="flex items-center justify-between py-1">
                            <span className="text-[10px] text-[#4A4742]">
                              HUB B (TORONTO):
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  updateVariantStock(
                                    prod.id,
                                    v.size,
                                    "hubBToronto",
                                    v.hubBToronto - 1
                                  )
                                }
                                className="border border-[#E5E0D8] bg-[#FAF9F6] px-2 py-0.5 text-[#111111] hover:border-[#111111] cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-[#2E6B35] font-bold">
                                {v.hubBToronto}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateVariantStock(
                                    prod.id,
                                    v.size,
                                    "hubBToronto",
                                    v.hubBToronto + 1
                                  )
                                }
                                className="border border-[#E5E0D8] bg-[#FAF9F6] px-2 py-0.5 text-[#111111] hover:border-[#111111] cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================
            MODULE 3: DROP ENGINE & VIP TRIBAL TEASER MODE SWITCH
           ============================================================ */}
        {activeModule === "DROP_ENGINE" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 border border-[#E5E0D8] bg-white p-6 md:p-8 space-y-6">
              <div className="font-mono text-[10px] tracking-[0.22em] text-[#7A491D] font-semibold uppercase">
                MODULE 03 // MASTER STORE MODE &amp; VAULT GATE
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#111111]">
                VIP TRIBAL TEASER MODE (&ldquo;PREPARING SOMETHING GOOD&rdquo; EVOLUTION)
              </h2>
              <p className="text-sm text-[#4A4742] leading-relaxed">
                Activating the Master Vault Gate switches the public storefront into our warm cream &amp; bronze VIP Drop-Locker teaser page—featuring 1px hairline geometric vectors, countdown timer, and SMS/Email VIP registration.
              </p>

              <div className="border border-[#E5E0D8] bg-[#FAF9F6] p-6 space-y-4 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6E6A63]">CURRENT VAULT STATUS:</span>
                  <span
                    className={
                      vipTribalTeaserMode
                        ? "text-[#E31E24] font-bold"
                        : "text-[#2E6B35] font-bold"
                    }
                  >
                    {vipTribalTeaserMode
                      ? "LOCKED // VIP TEASER ACTIVE"
                      : "UNLOCKED // PUBLIC CATALOG LIVE"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6A63]">DEMO VIP PASSCODE:</span>
                  <span className="text-[#7A491D] font-bold">LAGOS2026</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = !vipTribalTeaserMode;
                  setVipTribalTeaserMode(next);
                  triggerToast(
                    next
                      ? "MASTER VAULT ENGAGED: VISIT / OR /SHOP TO EXPERIENCE THE VIP TEASER OVERLAY."
                      : "MASTER VAULT UNLOCKED: STOREFRONT RESTORED TO PUBLIC ACCESS."
                  );
                }}
                className="w-full bg-[#111111] py-4 font-mono text-xs font-semibold tracking-[0.22em] text-white uppercase hover:bg-[#E31E24] transition-colors cursor-pointer"
              >
                {vipTribalTeaserMode
                  ? "DEACTIVATE VIP TEASER VAULT →"
                  : "ACTIVATE VIP TRIBAL TEASER MODE →"}
              </button>
            </div>

            <div className="lg:col-span-7 border border-[#E5E0D8] bg-white p-6 md:p-8 space-y-6">
              <div className="font-mono text-[10px] tracking-[0.22em] text-[#7A491D] font-semibold uppercase">
                SEASONAL CAPSULE DROP SCHEDULER
              </div>
              <h3 className="font-display text-2xl font-bold uppercase text-[#111111]">
                COLLECTION RELEASE GATES
              </h3>

              <div className="divide-y divide-[#E5E0D8] border border-[#E5E0D8]">
                {collections.map((col) => (
                  <div
                    key={col.id}
                    className="p-5 bg-[#FAF9F6] flex flex-wrap items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.18em] text-[#7A491D] font-semibold uppercase">
                        {col.seasonCode} · {col.brandName}
                      </div>
                      <div className="font-display text-xl font-bold uppercase text-[#111111] mt-1">
                        {col.title}
                      </div>
                      <div className="font-mono text-[10px] text-[#6E6A63] mt-1">
                        RELEASE DATE: {col.releaseDate}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`border px-3 py-1 font-mono text-[10px] font-semibold uppercase ${
                          col.isDropLive
                            ? "border-[#2E6B35] bg-white text-[#2E6B35]"
                            : "border-[#E31E24] bg-white text-[#E31E24]"
                        }`}
                      >
                        {col.isDropLive ? "DROP LIVE" : "COUNTDOWN LOCKED"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          toggleCollectionLive(col.id);
                          triggerToast(
                            `DROP ENGINE: UPDATED RELEASE STATE FOR ${col.title}.`
                          );
                        }}
                        className="border border-[#111111] bg-white px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-[#111111] uppercase hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                      >
                        {col.isDropLive ? "LOCK CAPSULE" : "UNLOCK DROP NOW"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            MODULE 4: B2B LEAD MANAGEMENT & WHOLESALE DESK
           ============================================================ */}
        {activeModule === "B2B_DESK" && (
          <div className="border border-[#E5E0D8] bg-white p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
              <div>
                <div className="font-mono text-[10px] tracking-[0.22em] text-[#7A491D] font-semibold uppercase">
                  MODULE 04 // B2B BRAND REPRESENTATION &amp; WHOLESALE DESK
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#111111] mt-1">
                  INCOMING REPRESENTATION &amp; WHOLESALE PIPELINE
                </h2>
              </div>
              <Link
                href="/partnerships"
                className="border border-[#111111] bg-white px-4 py-2.5 font-mono text-[10px] tracking-[0.2em] text-[#111111] uppercase hover:bg-[#111111] hover:text-white transition-colors"
              >
                OPEN PUBLIC /PARTNERSHIPS PORTAL →
              </Link>
            </div>

            <div className="divide-y divide-[#E5E0D8] border border-[#E5E0D8]">
              {b2bInquiries.map((inq) => (
                <div key={inq.id} className="p-6 bg-[#FAF9F6] space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#7A491D]">
                          {inq.referenceCode}
                        </span>
                        <span className="border border-[#E5E0D8] bg-white px-2.5 py-0.5 font-mono text-[10px] text-[#4A4742] uppercase">
                          {inq.channel}
                        </span>
                        <span className="border border-[#E31E24] bg-white px-2.5 py-0.5 font-mono text-[10px] text-[#E31E24] font-semibold uppercase">
                          STATUS: {inq.status}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl font-bold uppercase text-[#111111] mt-2">
                        {inq.brandOrCompanyName} — {inq.headquartersCountry}
                      </h3>
                      <div className="font-mono text-xs text-[#4A4742] mt-1">
                        CONTACT: {inq.contactName} ({inq.contactRole}) ·{" "}
                        {inq.email} · {inq.phone}
                      </div>
                    </div>

                    <div className="font-mono text-right text-xs">
                      <div className="text-[#7A491D] font-semibold">
                        TIER: {inq.annualVolumeTier}
                      </div>
                      <div className="text-[#6E6A63] text-[11px] mt-1">
                        DESK: {inq.assignedExecutive}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#111111] leading-relaxed border-l-2 border-[#7A491D] pl-4 py-1 bg-white">
                    {inq.message}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#E5E0D8]">
                    <div className="flex flex-wrap gap-1.5">
                      {inq.targetRegions.map((reg) => (
                        <span
                          key={reg}
                          className="border border-[#E5E0D8] bg-white px-2.5 py-1 font-mono text-[10px] text-[#4A4742] uppercase"
                        >
                          TARGET: {reg}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] text-[#6E6A63] uppercase mr-1">
                        ADVANCE STAGE:
                      </span>
                      {(
                        [
                          "NEW",
                          "IN_REVIEW",
                          "MEETING_SCHEDULED",
                          "PARTNERED",
                        ] as B2BLeadStatus[]
                      ).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            updateB2BStatus(inq.id, st);
                            triggerToast(
                              `B2B PIPELINE: ${inq.referenceCode} (${inq.brandOrCompanyName}) UPDATED TO ${st}.`
                            );
                          }}
                          className={`border px-3 py-1.5 font-mono text-[10px] uppercase transition-colors cursor-pointer ${
                            inq.status === st
                              ? "border-[#111111] bg-[#111111] text-white font-bold"
                              : "border-[#E5E0D8] bg-white text-[#4A4742] hover:border-[#111111]"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            MODULE 5: UNIFIED ORDER & PAYMENT RECONCILIATION
           ============================================================ */}
        {activeModule === "ORDER_RECONCILIATION" && (
          <div className="border border-[#E5E0D8] bg-white p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
              <div>
                <div className="font-mono text-[10px] tracking-[0.22em] text-[#7A491D] font-semibold uppercase">
                  MODULE 05 // UNIFIED ORDER &amp; MULTI-GATEWAY RECONCILIATION
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#111111] mt-1">
                  STRIPE · PAYSTACK · M-PESA DARAJA 2.0 AUDIT LEDGER
                </h2>
              </div>
              <Link
                href="/checkout"
                className="bg-[#111111] px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.2em] text-white uppercase hover:bg-[#E31E24]"
              >
                SIMULATE NEW CHECKOUT →
              </Link>
            </div>

            <div className="divide-y divide-[#E5E0D8] border border-[#E5E0D8]">
              {orders.map((ord) => (
                <div key={ord.id} className="p-6 bg-[#FAF9F6] space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-sm font-bold text-[#111111]">
                          {ord.orderNumber}
                        </span>
                        <span className="border border-[#E5E0D8] bg-white px-2.5 py-0.5 font-mono text-[10px] text-[#7A491D] font-semibold uppercase">
                          {ord.paymentProvider}
                        </span>
                        <span
                          className={`border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase bg-white ${
                            ord.paymentStatus === "SUCCEEDED" ||
                            ord.paymentStatus === "RECONCILED_MANUALLY"
                              ? "border-[#2E6B35] text-[#2E6B35]"
                              : "border-[#E05C1A] text-[#E05C1A]"
                          }`}
                        >
                          PAYMENT: {ord.paymentStatus}
                        </span>
                        <span className="border border-[#E5E0D8] bg-white px-2.5 py-0.5 font-mono text-[10px] text-[#4A4742] uppercase">
                          ORDER: {ord.status}
                        </span>
                      </div>

                      <div className="font-mono text-xs text-[#111111] mt-2">
                        CLIENT: <strong>{ord.customerName}</strong> (
                        {ord.customerEmail} · {ord.customerPhone})
                      </div>
                      <div className="font-mono text-[11px] text-[#4A4742] mt-0.5">
                        DESTINATION: {ord.destinationCity},{" "}
                        {ord.destinationCountry} · ASSIGNED HUB:{" "}
                        <span className="text-[#7A491D] font-semibold">
                          {ord.assignedHub}
                        </span>{" "}
                        ({ord.courierPartner})
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-lg font-bold text-[#111111]">
                        {formatCurrencyValue(ord.totalAmount, ord.currency)}
                      </div>
                      <div className="text-[10px] text-[#6E6A63] mt-1">
                        REF: {ord.paymentReference}
                      </div>
                      {ord.mpesaReceiptNumber && (
                        <div className="text-[10px] text-[#2E6B35] font-semibold">
                          M-PESA RECEIPT: {ord.mpesaReceiptNumber}
                        </div>
                      )}
                      {ord.waybillNumber && (
                        <div className="text-[10px] text-[#111111] font-semibold mt-0.5">
                          WAYBILL: {ord.waybillNumber}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="border border-[#E5E0D8] bg-white p-3 font-mono text-xs divide-y divide-[#E5E0D8]">
                    {ord.items.map((item, i) => (
                      <div
                        key={i}
                        className="py-1.5 flex items-center justify-between text-[#111111]"
                      >
                        <span>
                          [{item.brandName}] {item.productTitle} — SIZE:{" "}
                          {item.size} × {item.quantity}
                        </span>
                        <span className="font-semibold">
                          {formatCurrencyValue(
                            item.unitPrice * item.quantity,
                            ord.currency
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Reconciliation & Logistics Action Triggers */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex flex-wrap gap-2">
                      {ord.paymentProvider === "MPESA_DARAJA" && (
                        <button
                          type="button"
                          onClick={() => {
                            const receipt = `SJK${Math.floor(
                              10 + Math.random() * 89
                            )}DAR2`;
                            updateOrderStatus(
                              ord.id,
                              "PAID",
                              "RECONCILED_MANUALLY",
                              ord.waybillNumber,
                              receipt
                            );
                            triggerToast(
                              `DARAJA 2.0 STK PUSH RETRY: CALLBACK VERIFIED FOR ${ord.orderNumber}. RECEIPT: ${receipt}`
                            );
                          }}
                          className="border border-[#2E6B35] bg-white px-3.5 py-2 font-mono text-[10px] font-semibold tracking-[0.16em] text-[#2E6B35] uppercase hover:bg-[#2E6B35] hover:text-white cursor-pointer"
                        >
                          TRIGGER M-PESA STK PUSH RETRY / RECONCILE
                        </button>
                      )}

                      {ord.paymentProvider === "PAYSTACK" && (
                        <button
                          type="button"
                          onClick={() => {
                            updateOrderStatus(ord.id, "PAID", "SUCCEEDED");
                            triggerToast(
                              `PAYSTACK WEBHOOK VERIFY: NGN/GHS SETTLEMENT CONFIRMED FOR ${ord.orderNumber}.`
                            );
                          }}
                          className="border border-[#7A491D] bg-white px-3.5 py-2 font-mono text-[10px] font-semibold tracking-[0.16em] text-[#7A491D] uppercase hover:bg-[#7A491D] hover:text-white cursor-pointer"
                        >
                          VERIFY PAYSTACK WEBHOOK SIGNATURE
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const prefix =
                            ord.assignedHub === "HUB_A_LAGOS"
                              ? "GIG-LOS"
                              : "DHL-YYZ";
                          const wb = `${prefix}-${Math.floor(
                            100000 + Math.random() * 900000
                          )}`;
                          updateOrderStatus(
                            ord.id,
                            "DISPATCHED",
                            "SUCCEEDED",
                            wb
                          );
                          triggerToast(
                            `WAYBILL GENERATED: ${ord.orderNumber} DISPATCHED VIA ${ord.courierPartner} (WAYBILL: ${wb}).`
                          );
                        }}
                        className="border border-[#111111] bg-[#111111] px-3.5 py-2 font-mono text-[10px] font-semibold tracking-[0.16em] text-white uppercase hover:bg-[#E31E24] hover:border-[#E31E24] cursor-pointer"
                      >
                        GENERATE WAYBILL &amp; DISPATCH NOTE
                      </button>
                    </div>

                    <div className="font-mono text-[10px] text-[#6E6A63] uppercase">
                      DATE: {ord.createdAt.slice(0, 10)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
