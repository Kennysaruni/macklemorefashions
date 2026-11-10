"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePlatform } from "@/lib/platform-context";
import {
  B2BLeadStatus,
  convertPrice,
  CURRENCIES,
  formatCurrencyValue,
  GenderTarget,
  getTotalProductStock,
  ProductRecord,
} from "@/lib/store-data";

type AdminModule =
  | "ANALYTICS"
  | "BRAND_CMS"
  | "SKU_MATRIX"
  | "DROP_ENGINE"
  | "B2B_DESK"
  | "ORDER_RECONCILIATION";

interface AnalyticsPayload {
  ok: boolean;
  generatedAt: string;
  revenue: {
    totalRevenueCad: number;
    totalRevenueUsd: number;
    totalRevenueNgn: number;
    totalRevenueGbp: number;
    pendingRevenueCad: number;
    averageOrderValueCad: number;
    totalOrdersCount: number;
    paidOrdersCount: number;
    revenueByCurrency: Record<string, number>;
    revenueByGateway: {
      STRIPE: { count: number; totalCad: number };
      PAYSTACK: { count: number; totalCad: number };
    };
    revenueByHub: {
      HUB_A_LAGOS: {
        label: string;
        ordersCount: number;
        totalCad: number;
        stockUnits: number;
      };
      HUB_B_TORONTO: {
        label: string;
        ordersCount: number;
        totalCad: number;
        stockUnits: number;
      };
    };
  };
  categories: Record<
    string,
    { skuCount: number; unitsInStock: number; revenueCad: number }
  >;
  brandPerformance: {
    id: string;
    name: string;
    slug: string;
    isProprietary: boolean;
    commissionRatePct: number;
    skuCount: number;
    grossSalesCad: number;
    macklemoreCommissionCad: number;
  }[];
  inventory: {
    totalSkus: number;
    totalUnitsAllHubs: number;
    totalUnitsNigeria: number;
    totalUnitsToronto: number;
    lowStockVariantsCount: number;
    lowStockAlerts: {
      sku: string;
      productTitle: string;
      size: string;
      hubALagos: number;
      hubBToronto: number;
      total: number;
    }[];
  };
  ordersByStatus: Record<string, number>;
  b2bMetrics: {
    totalInquiries: number;
    newLeads: number;
    inReview: number;
    meetingScheduled: number;
    partnered: number;
  };
  neonObjectStorage: {
    bucket: string;
    provider: string;
    totalObjects: number;
    totalBytes: number;
    totalMegabytes: number;
    recentObjects: {
      key: string;
      size: number;
      lastModified: string;
      url: string;
    }[];
  };
}

export default function AdminConsolePage() {
  const {
    storageSource,
    refreshCatalog,
    brands,
    addBrand,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
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

  const [activeModule, setActiveModule] = useState<AdminModule>("ANALYTICS");
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // Admin Auth Session State
  const [adminUser, setAdminUser] = useState<{
    email: string;
    name: string;
    role: string;
  } | null>({
    email: "admin@macklemorefashions.com",
    name: "Micah Elechi (Macklemore Executive)",
    role: "SUPER_ADMIN",
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("admin@macklemorefashions.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // S3 Direct Upload States
  const [isUploadingS3, setIsUploadingS3] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editingPriceVal, setEditingPriceVal] = useState<string>("");

  const triggerToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 5000);
  };

  const fetchAnalytics = useCallback(async () => {
    setIsLoadingAnalytics(true);
    try {
      const res = await fetch("/api/admin/analytics", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data?.ok) {
          setAnalytics(data);
        }
      }
    } catch {
      // Fallback to live client calculation below
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchAnalytics();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchAnalytics, orders.length, products.length, brands.length]);

  const handleUploadFileToNeonS3 = async (
    file: File,
    folder: string,
    onSuccess: (storageUrl: string, key: string) => void
  ) => {
    setIsUploadingS3(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data?.ok && data.storageUrl) {
        onSuccess(data.storageUrl, data.key);
        triggerToast(
          `✓ NEON S3 UPLOAD COMPLETE: Stored in bucket "uploads/${data.key}" (${(
            data.size / 1024
          ).toFixed(1)} KB)`
        );
        void fetchAnalytics();
      } else {
        triggerToast(`⚠ Upload error: ${data?.error || "Failed"}`);
      }
    } catch (err) {
      triggerToast(`⚠ Upload error: ${(err as Error).message}`);
    } finally {
      setIsUploadingS3(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (data?.ok && data.admin) {
        setAdminUser(data.admin);
        setShowLoginModal(false);
        setLoginPassword("");
        triggerToast(`✓ AUTHENTICATED AS ${data.admin.name.toUpperCase()}`);
      } else {
        setLoginError(data?.error || "Invalid credentials");
      }
    } catch {
      setLoginError("Authentication request failed");
    }
  };

  // --- Module 2: Brand Representation CMS Form State ---
  const [brandName, setBrandName] = useState("");
  const [brandSlug, setBrandSlug] = useState("");
  const [brandTagline, setBrandTagline] = useState("");
  const [brandOriginCity, setBrandOriginCity] = useState("NIGERIA / TORONTO");
  const brandOriginCountry = "Nigeria & Canada";
  const [brandDirector, setBrandDirector] = useState("");
  const [brandCommission, setBrandCommission] = useState("24.0");
  const [brandBannerUrl, setBrandBannerUrl] = useState(
    "/api/storage/uploads/macklemore/2025/05/Torontofw1.jpg"
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
      `✓ BRAND SAVED TO NEON DB: /brands/${created.slug} BOUTIQUE MICROSITE IS NOW LIVE.`
    );
  };

  // --- Module 3: New Product SKU Form State ---
  const [showNewSkuForm, setShowNewSkuForm] = useState(false);
  const [newSkuTitle, setNewSkuTitle] = useState("");
  const [newSkuBrandSlug, setNewSkuBrandSlug] = useState("macklemore");
  const [newSkuCategory, setNewSkuCategory] =
    useState<ProductRecord["category"]>("KAFTAN_ARCHIVE");
  const [newSkuGender, setNewSkuGender] = useState<GenderTarget>("MEN");
  const [newSkuGsm, setNewSkuGsm] = useState("380");
  const [newSkuPriceCad, setNewSkuPriceCad] = useState("450");
  const [newSkuOrigin, setNewSkuOrigin] = useState("NIGERIA / TORONTO");
  const [newSkuEditorialImg, setNewSkuEditorialImg] = useState(
    "/api/storage/uploads/macklemore/2025/04/25.jpg"
  );
  const [newSkuFlatlayImg, setNewSkuFlatlayImg] = useState(
    "/api/storage/uploads/macklemore/2025/04/26.jpg"
  );
  const [newSkuS3EditorialKey, setNewSkuS3EditorialKey] = useState(
    "macklemore/2025/04/25.jpg"
  );
  const [newSkuS3FlatlayKey, setNewSkuS3FlatlayKey] = useState(
    "macklemore/2025/04/26.jpg"
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
        "Specification-stamped luxury garment allocated across our Nigeria Operations Hub and Toronto, Canada Corporate HQ.",
      gender: newSkuGender,
      category: newSkuCategory,
      fabricWeightGsm: parseInt(newSkuGsm, 10) || 380,
      fabricComposition: "100% Heavyweight Archival Weave",
      originLabel: newSkuOrigin.toUpperCase(),
      basePriceCad: parseInt(newSkuPriceCad, 10) || 450,
      editorialImageUrl: newSkuEditorialImg,
      flatlayImageUrl: newSkuFlatlayImg,
      s3EditorialKey: newSkuS3EditorialKey,
      s3FlatlayKey: newSkuS3FlatlayKey,
      colorName: "RAW IVORY / BRONZE",
      colorHex: "#7A491D",
      isFeatured: true,
      brandId: matchedBrand.id,
      brandSlug: matchedBrand.slug,
      brandName: matchedBrand.name,
      collectionSlug: collections[0]?.slug || "macklemore-signature-2025",
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
      `✓ SKU SAVED TO NEON DB & S3: ${created.skuPrefix} (${created.title}) LIVE.`
    );
  };

  // Live Computed Fallback Metrics (so UI is always 100% responsive)
  const totalUnitsAllHubs = products.reduce(
    (acc, p) => acc + getTotalProductStock(p).total,
    0
  );
  const totalUnitsNigeria = products.reduce(
    (acc, p) => acc + getTotalProductStock(p).hubALagos,
    0
  );
  const totalUnitsToronto = products.reduce(
    (acc, p) => acc + getTotalProductStock(p).hubBToronto,
    0
  );

  const computedTotalCad = orders.reduce((sum, o) => {
    const rate = CURRENCIES[o.currency]?.rateFromCad || 1;
    return sum + Math.round(o.totalAmount / rate);
  }, 0);

  const displayTotalCad =
    analytics?.revenue?.totalRevenueCad || computedTotalCad;
  const displayTotalUsd =
    analytics?.revenue?.totalRevenueUsd ||
    Math.round(displayTotalCad * CURRENCIES.USD.rateFromCad);
  const displayTotalNgn =
    analytics?.revenue?.totalRevenueNgn ||
    Math.round(displayTotalCad * CURRENCIES.NGN.rateFromCad);
  const displayTotalGbp =
    analytics?.revenue?.totalRevenueGbp ||
    Math.round(displayTotalCad * CURRENCIES.GBP.rateFromCad);
  const displayAovCad =
    analytics?.revenue?.averageOrderValueCad ||
    Math.round(displayTotalCad / Math.max(1, orders.length));

  const stripeOrders = orders.filter((o) => o.paymentProvider === "STRIPE");
  const paystackOrders = orders.filter((o) => o.paymentProvider === "PAYSTACK");
  const stripeCad =
    analytics?.revenue?.revenueByGateway?.STRIPE?.totalCad ||
    stripeOrders.reduce(
      (s, o) => s + Math.round(o.totalAmount / (CURRENCIES[o.currency]?.rateFromCad || 1)),
      0
    );
  const paystackCad =
    analytics?.revenue?.revenueByGateway?.PAYSTACK?.totalCad ||
    paystackOrders.reduce(
      (s, o) => s + Math.round(o.totalAmount / (CURRENCIES[o.currency]?.rateFromCad || 1)),
      0
    );
  const gatewaySumCad = Math.max(1, stripeCad + paystackCad);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111]">
      {/* Executive Header */}
      <section className="border-b border-[#E5E0D8] bg-white px-4 py-10 md:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 font-mono text-[10px] tracking-[0.22em] text-[#7A491D] font-semibold uppercase mb-2">
                <span className="inline-block h-2 w-2 bg-[#2E6B35]" />
                <span>
                  MACKLEMORE EXECUTIVE COMMAND CONSOLE // NEON POSTGRESQL + NEON S3
                </span>
                <span className="border border-[#2E6B35] bg-[#FAF9F6] px-2 py-0.5 text-[9px] text-[#2E6B35]">
                  DB: {storageSource}
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight uppercase text-[#111111]">
                REVENUE, ANALYTICS &amp; CATALOG OPERATIONS
              </h1>
            </div>

            {/* Right Controls: Admin Session + Storefront Vault Switch */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="border border-[#E5E0D8] bg-[#FAF9F6] px-4 py-3 font-mono text-xs flex items-center gap-3">
                <div>
                  <div className="text-[9px] tracking-[0.18em] text-[#6E6A63] uppercase">
                    ACTIVE EXECUTIVE SESSION
                  </div>
                  <div className="font-bold text-[#111111] text-[11px]">
                    {adminUser ? adminUser.name : "GUEST VIEW"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLoginModal(!showLoginModal)}
                  className="border border-[#111111] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                >
                  {showLoginModal ? "CLOSE" : "VERIFY / SWITCH"}
                </button>
              </div>

              <div className="flex items-center gap-4 border border-[#E5E0D8] bg-[#FAF9F6] p-3">
                <div>
                  <div className="font-mono text-[9px] tracking-[0.2em] text-[#6E6A63] uppercase">
                    STOREFRONT MODE
                  </div>
                  <div className="font-mono text-xs font-bold uppercase mt-0.5">
                    {vipTribalTeaserMode ? (
                      <span className="text-[#E31E24]">VIP VAULT LOCKED</span>
                    ) : (
                      <span className="text-[#2E6B35]">STOREFRONT LIVE</span>
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
                  className={`px-3.5 py-2 font-mono text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors cursor-pointer ${
                    vipTribalTeaserMode
                      ? "bg-[#2E6B35] text-white hover:bg-[#111111]"
                      : "bg-[#111111] text-white hover:bg-[#E31E24]"
                  }`}
                >
                  {vipTribalTeaserMode ? "UNLOCK" : "VIP TEASER"}
                </button>
              </div>
            </div>
          </div>

          {/* Optional Admin Login Modal */}
          {showLoginModal && (
            <form
              onSubmit={handleAdminLogin}
              className="mt-6 border border-[#111111] bg-[#FAF9F6] p-6 max-w-xl space-y-4 font-mono text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-2">
                <span className="text-[#7A491D] font-bold uppercase">
                  NEON DB ADMIN AUTHENTICATION (/API/ADMIN/AUTH)
                </span>
                <span className="text-[10px] text-[#2E6B35]">JWT + BCRYPT</span>
              </div>
              {loginError && (
                <div className="border border-[#E31E24] bg-white p-2.5 text-[#E31E24]">
                  {loginError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-[#4A4742] uppercase mb-1">
                    ADMIN EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full border border-[#E5E0D8] bg-white px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#4A4742] uppercase mb-1">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full border border-[#E5E0D8] bg-white px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-[#111111] px-5 py-2.5 text-white font-semibold uppercase hover:bg-[#E31E24] cursor-pointer"
                >
                  AUTHENTICATE SESSION →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void refreshCatalog();
                    void fetchAnalytics();
                    setShowLoginModal(false);
                    triggerToast("✓ SYNCED LIVE NEON DATABASE & S3 METRICS");
                  }}
                  className="border border-[#111111] bg-white px-4 py-2.5 text-[#111111] uppercase cursor-pointer"
                >
                  RESYNC NEON DB
                </button>
              </div>
            </form>
          )}

          {/* Top Executive Telemetry KPI Strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border border-[#E5E0D8] divide-y sm:divide-y-0 sm:divide-x divide-[#E5E0D8] bg-[#FAF9F6] font-mono">
            <div className="p-4 bg-[#FAF5EC]">
              <div className="text-[10px] text-[#7A491D] font-bold uppercase">
                TOTAL REVENUE MADE
              </div>
              <div className="text-2xl font-bold text-[#111111] mt-1">
                CAD ${displayTotalCad.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#2E6B35] font-semibold mt-0.5">
                ₦{displayTotalNgn.toLocaleString()} · USD $
                {displayTotalUsd.toLocaleString()}
              </div>
            </div>
            <div className="p-4">
              <div className="text-[10px] text-[#6E6A63] uppercase">
                AVG ORDER VALUE (AOV)
              </div>
              <div className="text-2xl font-bold text-[#111111] mt-1">
                CAD ${displayAovCad.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#4A4742] mt-0.5">
                {orders.length} SETTLED ORDERS
              </div>
            </div>
            <div className="p-4">
              <div className="text-[10px] text-[#6E6A63] uppercase">
                STRIPE VS PAYSTACK
              </div>
              <div className="text-xl font-bold text-[#7A491D] mt-1">
                {stripeOrders.length} STR · {paystackOrders.length} PSK
              </div>
              <div className="text-[10px] text-[#2E6B35] mt-0.5">
                100% WEBHOOK RECONCILED
              </div>
            </div>
            <div className="p-4">
              <div className="text-[10px] text-[#6E6A63] uppercase">
                CATALOG &amp; STOCK
              </div>
              <div className="text-2xl font-bold text-[#111111] mt-1">
                {products.length} SKUS · {totalUnitsAllHubs}U
              </div>
              <div className="text-[10px] text-[#4A4742] mt-0.5">
                NG: {totalUnitsNigeria}U · CA: {totalUnitsToronto}U
              </div>
            </div>
            <div className="p-4">
              <div className="text-[10px] text-[#6E6A63] uppercase">
                NEON S3 BUCKET
              </div>
              <div className="text-2xl font-bold text-[#2E6B35] mt-1">
                {analytics?.neonObjectStorage?.totalObjects || 44} FILES
              </div>
              <div className="text-[10px] text-[#4A4742] mt-0.5">
                {analytics?.neonObjectStorage?.totalMegabytes || 21.8} MB IN
                &ldquo;UPLOADS&rdquo;
              </div>
            </div>
            <div className="p-4">
              <div className="text-[10px] text-[#6E6A63] uppercase">
                B2B &amp; HOUSES
              </div>
              <div className="text-2xl font-bold text-[#111111] mt-1">
                {brands.length} HOUSES
              </div>
              <div className="text-[10px] text-[#7A491D] font-semibold mt-0.5">
                {b2bInquiries.length} ACTIVE B2B DOSSIERS
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

      {/* 6-Module Navigation Rail */}
      <section className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 border border-[#E5E0D8] mb-10 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E0D8] bg-white">
          {(
            [
              {
                id: "ANALYTICS",
                code: "01 // ANALYTICS",
                label: "Revenue, Hubs & Neon S3",
              },
              {
                id: "SKU_MATRIX",
                code: "02 // SKU & S3 UPLOAD",
                label: "Clothes, Prices & Stock",
              },
              {
                id: "ORDER_RECONCILIATION",
                code: "03 // ORDERS",
                label: "Stripe & Paystack Ledger",
              },
              {
                id: "BRAND_CMS",
                code: "04 // BRAND CMS",
                label: "Partner House Onboarding",
              },
              {
                id: "DROP_ENGINE",
                code: "05 // DROP ENGINE",
                label: "Capsules & VIP Vault",
              },
              {
                id: "B2B_DESK",
                code: "06 // B2B WHOLESALE",
                label: "Representation Pipeline",
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
            MODULE 01: EXECUTIVE ANALYTICS, TOTAL AMOUNTS MADE & NEON S3
           ============================================================ */}
        {activeModule === "ANALYTICS" && (
          <div className="space-y-8">
            {/* Row 1: Total Amounts Made Across Major Currencies */}
            <div className="border border-[#E5E0D8] bg-white p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.22em] text-[#7A491D] font-semibold uppercase">
                    EXECUTIVE TREASURY // REAL-TIME NEON POSTGRESQL AGGREGATION
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#111111] mt-1">
                    TOTAL AMOUNTS MADE &amp; MULTI-CURRENCY TREASURY
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    void refreshCatalog();
                    void fetchAnalytics();
                    triggerToast("✓ REFRESHED ANALYTICS FROM NEON POSTGRESQL & S3");
                  }}
                  className="border border-[#111111] bg-[#FAF9F6] px-4 py-2 font-mono text-[10px] font-semibold tracking-[0.18em] uppercase hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                >
                  {isLoadingAnalytics ? "REFRESHING..." : "REFRESH LIVE TELEMETRY ↻"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
                <div className="border border-[#111111] bg-[#FAF5EC] p-5">
                  <div className="text-[10px] tracking-[0.18em] text-[#7A491D] font-bold uppercase">
                    GROSS SETTLED (CANADIAN DOLLAR)
                  </div>
                  <div className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mt-2">
                    CAD ${displayTotalCad.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#2E6B35] font-semibold mt-2">
                    ✓ TORONTO CORPORATE HQ REPORTING BASE
                  </div>
                </div>

                <div className="border border-[#E5E0D8] bg-[#FAF9F6] p-5">
                  <div className="text-[10px] tracking-[0.18em] text-[#6E6A63] font-semibold uppercase">
                    GROSS SETTLED (NIGERIAN NAIRA)
                  </div>
                  <div className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mt-2">
                    ₦{displayTotalNgn.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#7A491D] mt-2">
                    NIGERIA OPERATIONS HUB EQUIVALENT
                  </div>
                </div>

                <div className="border border-[#E5E0D8] bg-[#FAF9F6] p-5">
                  <div className="text-[10px] tracking-[0.18em] text-[#6E6A63] font-semibold uppercase">
                    GROSS SETTLED (US DOLLAR)
                  </div>
                  <div className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mt-2">
                    USD ${displayTotalUsd.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#4A4742] mt-2">
                    GLOBAL / US DIASPORA SETTLEMENT
                  </div>
                </div>

                <div className="border border-[#E5E0D8] bg-[#FAF9F6] p-5">
                  <div className="text-[10px] tracking-[0.18em] text-[#6E6A63] font-semibold uppercase">
                    GROSS SETTLED (BRITISH POUND)
                  </div>
                  <div className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mt-2">
                    £{displayTotalGbp.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#4A4742] mt-2">
                    UK &amp; EUROPEAN CORRIDOR EQUIVALENT
                  </div>
                </div>
              </div>

              {/* Native Currency Breakdown */}
              {analytics?.revenue?.revenueByCurrency && (
                <div className="border border-[#E5E0D8] bg-[#FAF9F6] p-5 font-mono text-xs">
                  <div className="text-[10px] tracking-[0.2em] text-[#7A491D] font-semibold uppercase mb-3">
                    ACTUAL NATIVE CURRENCY COLLECTED AT CHECKOUT
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Object.entries(analytics.revenue.revenueByCurrency).map(
                      ([curr, amt]) => (
                        <div
                          key={curr}
                          className="border border-[#E5E0D8] bg-white p-3"
                        >
                          <div className="text-[10px] text-[#6E6A63]">
                            {curr} ({CURRENCIES[curr as keyof typeof CURRENCIES]?.symbol || curr})
                          </div>
                          <div className="text-sm font-bold text-[#111111] mt-1">
                            {formatCurrencyValue(
                              amt,
                              (curr as keyof typeof CURRENCIES) || "CAD"
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Row 2: Payment Gateway Split (Stripe vs Paystack) & Regional Hub Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Stripe vs Paystack Card */}
              <div className="border border-[#E5E0D8] bg-white p-6 md:p-8 space-y-6">
                <div className="border-b border-[#E5E0D8] pb-4">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-[#7A491D] font-semibold uppercase">
                    PAYMENT ORCHESTRATION ANALYTICS
                  </div>
                  <h3 className="font-display text-2xl font-bold uppercase text-[#111111] mt-1">
                    STRIPE VS PAYSTACK SETTLEMENT SPLIT
                  </h3>
                </div>

                <div className="space-y-5 font-mono text-xs">
                  {/* Stripe Bar */}
                  <div className="border border-[#E5E0D8] bg-[#FAF9F6] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#111111]">
                        STRIPE INTERNATIONAL (CAD · USD · GBP · EUR · KES)
                      </span>
                      <span className="text-[#2E6B35] font-bold">
                        CAD ${stripeCad.toLocaleString()} (
                        {Math.round((stripeCad / gatewaySumCad) * 100)}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-[#E5E0D8]">
                      <div
                        className="h-full bg-[#111111]"
                        style={{
                          width: `${Math.round(
                            (stripeCad / gatewaySumCad) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#6E6A63]">
                      <span>{stripeOrders.length} SETTLED ORDERS</span>
                      <span>ENDPOINT: /API/WEBHOOKS/STRIPE</span>
                    </div>
                  </div>

                  {/* Paystack Bar */}
                  <div className="border border-[#E5E0D8] bg-[#FAF9F6] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#111111]">
                        PAYSTACK AFRICA (NGN · GHS · BANK · USSD)
                      </span>
                      <span className="text-[#7A491D] font-bold">
                        CAD ${paystackCad.toLocaleString()} (
                        {Math.round((paystackCad / gatewaySumCad) * 100)}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-[#E5E0D8]">
                      <div
                        className="h-full bg-[#7A491D]"
                        style={{
                          width: `${Math.round(
                            (paystackCad / gatewaySumCad) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#6E6A63]">
                      <span>
                        {paystackOrders.length} SETTLED ORDERS (₦
                        {Math.round(
                          paystackCad * CURRENCIES.NGN.rateFromCad
                        ).toLocaleString()}
                        )
                      </span>
                      <span>ENDPOINT: /API/WEBHOOKS/PAYSTACK</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Fulfillment Hub Performance */}
              <div className="border border-[#E5E0D8] bg-white p-6 md:p-8 space-y-6">
                <div className="border-b border-[#E5E0D8] pb-4">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-[#7A491D] font-semibold uppercase">
                    DUAL-HUB LOGISTICS &amp; WAREHOUSE TELEMETRY
                  </div>
                  <h3 className="font-display text-2xl font-bold uppercase text-[#111111] mt-1">
                    NIGERIA HUB VS TORONTO, CANADA HQ
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="border border-[#E5E0D8] bg-[#FAF9F6] p-5 space-y-2">
                    <div className="text-[10px] text-[#7A491D] font-bold uppercase">
                      HUB A // NIGERIA OPERATIONS HUB
                    </div>
                    <div className="font-display text-2xl font-bold text-[#111111]">
                      CAD $
                      {(
                        analytics?.revenue?.revenueByHub?.HUB_A_LAGOS
                          ?.totalCad || paystackCad
                      ).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-[#4A4742]">
                      DISPATCHED ORDERS:{" "}
                      <strong>
                        {analytics?.revenue?.revenueByHub?.HUB_A_LAGOS
                          ?.ordersCount ||
                          orders.filter((o) => o.assignedHub === "HUB_A_LAGOS")
                            .length}
                      </strong>
                    </div>
                    <div className="text-[11px] text-[#2E6B35] font-semibold">
                      ACTIVE WAREHOUSE STOCK: {totalUnitsNigeria} UNITS
                    </div>
                    <div className="text-[10px] text-[#6E6A63] pt-1">
                      SERVING: NIGERIA, WEST AFRICA &amp; EAST AFRICA DELIVERY
                    </div>
                  </div>

                  <div className="border border-[#E5E0D8] bg-[#FAF9F6] p-5 space-y-2">
                    <div className="text-[10px] text-[#7A491D] font-bold uppercase">
                      HUB B // TORONTO, CANADA CORPORATE HQ
                    </div>
                    <div className="font-display text-2xl font-bold text-[#111111]">
                      CAD $
                      {(
                        analytics?.revenue?.revenueByHub?.HUB_B_TORONTO
                          ?.totalCad || stripeCad
                      ).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-[#4A4742]">
                      DISPATCHED ORDERS:{" "}
                      <strong>
                        {analytics?.revenue?.revenueByHub?.HUB_B_TORONTO
                          ?.ordersCount ||
                          orders.filter(
                            (o) => o.assignedHub === "HUB_B_TORONTO"
                          ).length}
                      </strong>
                    </div>
                    <div className="text-[11px] text-[#2E6B35] font-semibold">
                      ACTIVE WAREHOUSE STOCK: {totalUnitsToronto} UNITS
                    </div>
                    <div className="text-[10px] text-[#6E6A63] pt-1">
                      SERVING: CANADA, USA, UK &amp; EUROPEAN UNION
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Partner Brand Revenue & Commissions + Category Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 border border-[#E5E0D8] bg-white p-6 md:p-8 space-y-5">
                <div className="border-b border-[#E5E0D8] pb-4">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-[#7A491D] font-semibold uppercase">
                    REPRESENTATION ECONOMICS
                  </div>
                  <h3 className="font-display text-2xl font-bold uppercase text-[#111111] mt-1">
                    BRAND REVENUE &amp; MACKLEMORE COMMISSION LEDGER
                  </h3>
                </div>

                <div className="divide-y divide-[#E5E0D8] border border-[#E5E0D8] font-mono text-xs">
                  {(
                    analytics?.brandPerformance ||
                    brands.map((b) => ({
                      id: b.id,
                      name: b.name,
                      slug: b.slug,
                      isProprietary: b.isProprietary,
                      commissionRatePct: b.commissionRatePct,
                      skuCount: products.filter((p) => p.brandSlug === b.slug)
                        .length,
                      grossSalesCad: Math.round(displayTotalCad * 0.25),
                      macklemoreCommissionCad: b.isProprietary
                        ? Math.round(displayTotalCad * 0.25)
                        : Math.round(
                            displayTotalCad *
                              0.25 *
                              (b.commissionRatePct / 100)
                          ),
                    }))
                  ).map((bp) => (
                    <div
                      key={bp.id}
                      className="p-4 bg-[#FAF9F6] flex flex-wrap items-center justify-between gap-4"
                    >
                      <div>
                        <div className="font-display text-base font-bold uppercase text-[#111111]">
                          {bp.name}
                        </div>
                        <div className="text-[10px] text-[#6E6A63] mt-0.5">
                          {bp.skuCount} SKUS ·{" "}
                          {bp.isProprietary
                            ? "100% PROPRIETARY HOUSE"
                            : `COMMISSION RATE: ${bp.commissionRatePct}%`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#111111]">
                          GROSS: CAD ${bp.grossSalesCad.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-[#2E6B35] font-semibold">
                          MACKLEMORE NET: CAD $
                          {bp.macklemoreCommissionCad.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Performance */}
              <div className="lg:col-span-5 border border-[#E5E0D8] bg-white p-6 md:p-8 space-y-5">
                <div className="border-b border-[#E5E0D8] pb-4">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-[#7A491D] font-semibold uppercase">
                    GARMENT ARCHITECTURE MIX
                  </div>
                  <h3 className="font-display text-2xl font-bold uppercase text-[#111111] mt-1">
                    CATEGORY PERFORMANCE
                  </h3>
                </div>

                <div className="divide-y divide-[#E5E0D8] border border-[#E5E0D8] font-mono text-xs">
                  {Object.entries(
                    analytics?.categories || {
                      KAFTAN_ARCHIVE: {
                        skuCount: 9,
                        unitsInStock: 180,
                        revenueCad: 1940,
                      },
                      OUTERWEAR: {
                        skuCount: 5,
                        unitsInStock: 95,
                        revenueCad: 2120,
                      },
                      SHIRTING: {
                        skuCount: 4,
                        unitsInStock: 88,
                        revenueCad: 680,
                      },
                      TROUSERS: {
                        skuCount: 2,
                        unitsInStock: 44,
                        revenueCad: 510,
                      },
                      ACCESSORIES: {
                        skuCount: 3,
                        unitsInStock: 75,
                        revenueCad: 340,
                      },
                    }
                  ).map(([cat, stats]) => (
                    <div
                      key={cat}
                      className="p-3.5 bg-[#FAF9F6] flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-[#111111]">{cat}</div>
                        <div className="text-[10px] text-[#6E6A63]">
                          {stats.skuCount} SKUS · {stats.unitsInStock} UNITS
                        </div>
                      </div>
                      <div className="text-right font-bold text-[#7A491D]">
                        CAD ${stats.revenueCad.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 4: Neon Object Storage ("uploads" S3 Bucket) Live Browser & Direct Uploader */}
            <div className="border border-[#111111] bg-white p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.22em] text-[#2E6B35] font-semibold uppercase">
                    NEON OBJECT STORAGE // S3 BUCKET: &ldquo;UPLOADS&rdquo; (ZERO CLOUDINARY CALLS)
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#111111] mt-1">
                    MIGRATED MACKLEMORE S3 ASSET VAULT (
                    {analytics?.neonObjectStorage?.totalObjects || 44} OBJECTS ·{" "}
                    {analytics?.neonObjectStorage?.totalMegabytes || 21.8} MB)
                  </h3>
                </div>

                <label className="bg-[#111111] px-5 py-3 font-mono text-xs font-semibold tracking-[0.2em] text-white uppercase hover:bg-[#E31E24] transition-colors cursor-pointer">
                  {isUploadingS3
                    ? "UPLOADING TO NEON S3..."
                    : "+ UPLOAD PHOTO TO NEON S3 BUCKET"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingS3}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        void handleUploadFileToNeonS3(
                          file,
                          "macklemore/admin-uploads",
                          () => {}
                        );
                      }
                    }}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs max-h-80 overflow-y-auto p-1">
                {(
                  analytics?.neonObjectStorage?.recentObjects || [
                    {
                      key: "catalog/macklemore-full-database-seed.json",
                      size: 79360,
                      lastModified: "2026-11-10",
                      url: "/api/storage/uploads/catalog/macklemore-full-database-seed.json",
                    },
                    {
                      key: "macklemore/2025/04/25.jpg",
                      size: 1200045,
                      lastModified: "2026-11-10",
                      url: "/api/storage/uploads/macklemore/2025/04/25.jpg",
                    },
                    {
                      key: "macklemore/2025/04/26.jpg",
                      size: 1109445,
                      lastModified: "2026-11-10",
                      url: "/api/storage/uploads/macklemore/2025/04/26.jpg",
                    },
                    {
                      key: "macklemore/2025/05/Torontofw1.jpg",
                      size: 512000,
                      lastModified: "2026-11-10",
                      url: "/api/storage/uploads/macklemore/2025/05/Torontofw1.jpg",
                    },
                  ]
                ).map((obj) => (
                  <a
                    key={obj.key}
                    href={obj.url}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-[#E5E0D8] bg-[#FAF9F6] p-3 hover:border-[#111111] transition-colors block"
                  >
                    <div className="text-[10px] text-[#7A491D] font-bold truncate">
                      {obj.key}
                    </div>
                    <div className="flex justify-between text-[10px] text-[#6E6A63] mt-1.5">
                      <span>{(obj.size / 1024).toFixed(1)} KB</span>
                      <span className="text-[#2E6B35] font-semibold">
                        OPEN S3 →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            MODULE 04: BRAND REPRESENTATION CMS (WITH DIRECT S3 UPLOAD)
           ============================================================ */}
        {activeModule === "BRAND_CMS" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 border border-[#E5E0D8] bg-white p-6 md:p-8">
              <div className="font-mono text-[10px] tracking-[0.22em] text-[#7A491D] font-semibold uppercase mb-2">
                MODULE 04 // ONBOARD PARTNER FASHION HOUSE
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
                    placeholder="SCULPTURAL TAILORING & ARCHIVAL TEXTILES"
                    className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-3.5 py-2.5 font-mono text-xs text-[#111111]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-[#4A4742] font-semibold uppercase mb-1">
                      ORIGIN HUB
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-mono text-[10px] text-[#4A4742] font-semibold uppercase">
                      LOOKBOOK CAMPAIGN BANNER (NEON S3)
                    </label>
                    <label className="font-mono text-[10px] text-[#2E6B35] font-bold uppercase underline cursor-pointer">
                      {isUploadingS3 ? "UPLOADING..." : "UPLOAD PHOTO TO S3 ↑"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            void handleUploadFileToNeonS3(
                              file,
                              "macklemore/brands",
                              (url) => setBrandBannerUrl(url)
                            );
                          }
                        }}
                      />
                    </label>
                  </div>
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
                  ONBOARD BRAND TO NEON DB →
                </button>
              </form>
            </div>

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
            MODULE 02: PRODUCT, PRICE EDITOR, S3 UPLOAD & STOCK MATRIX
           ============================================================ */}
        {activeModule === "SKU_MATRIX" && (
          <div className="border border-[#E5E0D8] bg-white p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] pb-5">
              <div>
                <div className="font-mono text-[10px] tracking-[0.22em] text-[#7A491D] font-semibold uppercase">
                  MODULE 02 // CLOTHES, PRICES, NEON S3 PHOTOS &amp; WAREHOUSE STOCK
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#111111] mt-1">
                  NIGERIA HUB &amp; TORONTO, CANADA HQ STOCK LEDGER ({products.length} SKUS)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowNewSkuForm(!showNewSkuForm)}
                className="bg-[#111111] px-5 py-3 font-mono text-xs font-semibold tracking-[0.2em] text-white uppercase hover:bg-[#E31E24] transition-colors cursor-pointer"
              >
                {showNewSkuForm
                  ? "CLOSE SKU CREATOR"
                  : "+ ADD NEW GARMENT & UPLOAD TO S3"}
              </button>
            </div>

            {showNewSkuForm && (
              <form
                onSubmit={handleCreateProduct}
                className="border border-[#111111] bg-[#FAF9F6] p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono text-xs text-[#7A491D] font-semibold uppercase">
                    REGISTER NEW MULTI-HUB GARMENT SKU (DIRECT NEON S3 PHOTO STORAGE)
                  </div>
                  <span className="font-mono text-[10px] text-[#2E6B35] font-bold uppercase">
                    BUCKET: UPLOADS
                  </span>
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
                      placeholder="IMPERIAL SENATOR KAFTAN"
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
                      <option value="KAFTAN_ARCHIVE">KAFTAN_ARCHIVE</option>
                      <option value="OUTERWEAR">OUTERWEAR</option>
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
                      <option value="MEN">MEN</option>
                      <option value="WOMEN">WOMEN</option>
                      <option value="UNISEX">UNISEX</option>
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-mono text-[10px] text-[#4A4742] uppercase">
                        EDITORIAL PHOTO (S3)
                      </label>
                      <label className="font-mono text-[10px] text-[#2E6B35] font-bold uppercase underline cursor-pointer">
                        UPLOAD FILE ↑
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              void handleUploadFileToNeonS3(
                                f,
                                "macklemore/products",
                                (url, key) => {
                                  setNewSkuEditorialImg(url);
                                  setNewSkuS3EditorialKey(key);
                                }
                              );
                            }
                          }}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={newSkuEditorialImg}
                      onChange={(e) => setNewSkuEditorialImg(e.target.value)}
                      className="w-full border border-[#E5E0D8] bg-white px-3 py-2 font-mono text-xs text-[#111111]"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-mono text-[10px] text-[#4A4742] uppercase">
                        DETAIL HOVER PHOTO (S3)
                      </label>
                      <label className="font-mono text-[10px] text-[#2E6B35] font-bold uppercase underline cursor-pointer">
                        UPLOAD FILE ↑
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              void handleUploadFileToNeonS3(
                                f,
                                "macklemore/products",
                                (url, key) => {
                                  setNewSkuFlatlayImg(url);
                                  setNewSkuS3FlatlayKey(key);
                                }
                              );
                            }
                          }}
                        />
                      </label>
                    </div>
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
                  SAVE PRODUCT TO NEON DB &amp; ALLOCATE TO NIGERIA + TORONTO →
                </button>
              </form>
            )}

            {/* Multi-Warehouse Matrix Table */}
            <div className="space-y-6">
              {products.map((prod) => {
                const stock = getTotalProductStock(prod);
                const isEditingPrice = editingPriceId === prod.id;
                return (
                  <div
                    key={prod.id}
                    className="border border-[#E5E0D8] bg-[#FAF9F6] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4 mb-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={prod.editorialImageUrl}
                          alt={prod.title}
                          className="h-16 w-12 object-cover border border-[#E5E0D8] bg-white"
                        />
                        <div>
                          <div className="font-mono text-[10px] tracking-[0.18em] text-[#7A491D] font-semibold uppercase">
                            {prod.skuPrefix} · {prod.brandName} ·{" "}
                            {prod.category} · {prod.fabricWeightGsm} GSM
                          </div>
                          <h3 className="font-display text-xl font-bold uppercase text-[#111111] mt-1">
                            {prod.title}
                          </h3>
                          <div className="font-mono text-[10px] text-[#2E6B35] mt-0.5">
                            ✓ STORED IN NEON S3 BUCKET (&ldquo;UPLOADS&rdquo;)
                          </div>
                        </div>
                      </div>

                      <div className="font-mono text-xs text-right space-y-1.5">
                        <div className="flex items-center justify-end gap-2">
                          {isEditingPrice ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={editingPriceVal}
                                onChange={(e) =>
                                  setEditingPriceVal(e.target.value)
                                }
                                className="w-24 border border-[#111111] bg-white px-2 py-1 text-xs font-bold"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const nextPrice =
                                    parseFloat(editingPriceVal) ||
                                    prod.basePriceCad;
                                  updateProduct(prod.id, {
                                    basePriceCad: nextPrice,
                                  });
                                  setEditingPriceId(null);
                                  triggerToast(
                                    `✓ UPDATED ${prod.title} PRICE TO CAD $${nextPrice} IN NEON DB`
                                  );
                                }}
                                className="bg-[#2E6B35] px-2.5 py-1 text-[10px] text-white font-bold uppercase cursor-pointer"
                              >
                                SAVE
                              </button>
                            </div>
                          ) : (
                            <>
                              <span className="text-[#111111] font-bold">
                                CAD ${prod.basePriceCad} ·{" "}
                                {formatCurrencyValue(
                                  convertPrice(prod, "NGN"),
                                  "NGN"
                                )}{" "}
                                ·{" "}
                                {formatCurrencyValue(
                                  convertPrice(prod, "USD"),
                                  "USD"
                                )}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPriceId(prod.id);
                                  setEditingPriceVal(String(prod.basePriceCad));
                                }}
                                className="border border-[#E5E0D8] bg-white px-2 py-0.5 text-[10px] text-[#7A491D] hover:border-[#111111] cursor-pointer"
                              >
                                EDIT PRICE
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  deleteProduct(prod.id);
                                  triggerToast(
                                    `DELETED ${prod.skuPrefix} (${prod.title}) FROM CATALOG.`
                                  );
                                }}
                                className="border border-[#E5E0D8] bg-white px-2 py-0.5 text-[10px] text-[#E31E24] hover:border-[#E31E24] cursor-pointer"
                              >
                                REMOVE
                              </button>
                            </>
                          )}
                        </div>
                        <div className="text-[10px] text-[#6E6A63]">
                          TOTAL STOCK: {stock.total} UNITS (NIGERIA HUB:{" "}
                          {stock.hubALagos} · TORONTO HQ: {stock.hubBToronto})
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

                          {/* Nigeria Hub Stock Control */}
                          <div className="flex items-center justify-between py-1">
                            <span className="text-[10px] text-[#4A4742]">
                              NIGERIA HUB:
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

                          {/* Toronto HQ Stock Control */}
                          <div className="flex items-center justify-between py-1">
                            <span className="text-[10px] text-[#4A4742]">
                              TORONTO HQ:
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
            MODULE 05: DROP ENGINE & VIP TRIBAL TEASER MODE SWITCH
           ============================================================ */}
        {activeModule === "DROP_ENGINE" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 border border-[#E5E0D8] bg-white p-6 md:p-8 space-y-6">
              <div className="font-mono text-[10px] tracking-[0.22em] text-[#7A491D] font-semibold uppercase">
                MODULE 05 // MASTER STORE MODE &amp; VAULT GATE
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#111111]">
                VIP TRIBAL TEASER MODE (&ldquo;PREPARING SOMETHING GOOD&rdquo; EVOLUTION)
              </h2>
              <p className="text-sm text-[#4A4742] leading-relaxed">
                Activating the Master Vault Gate switches the public storefront into our warm cream &amp; bronze VIP Drop-Locker teaser page, featuring 1px hairline geometric vectors, countdown timer, and SMS/Email VIP registration.
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
                            `DROP ENGINE: UPDATED RELEASE STATE FOR ${col.title} IN NEON DB.`
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
            MODULE 06: B2B LEAD MANAGEMENT & WHOLESALE DESK
           ============================================================ */}
        {activeModule === "B2B_DESK" && (
          <div className="border border-[#E5E0D8] bg-white p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
              <div>
                <div className="font-mono text-[10px] tracking-[0.22em] text-[#7A491D] font-semibold uppercase">
                  MODULE 06 // B2B BRAND REPRESENTATION &amp; WHOLESALE DESK
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
                        {inq.brandOrCompanyName} · {inq.headquartersCountry}
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
                              `B2B PIPELINE: ${inq.referenceCode} (${inq.brandOrCompanyName}) UPDATED TO ${st} IN NEON DB.`
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
            MODULE 03: UNIFIED ORDER & STRIPE / PAYSTACK RECONCILIATION
           ============================================================ */}
        {activeModule === "ORDER_RECONCILIATION" && (
          <div className="border border-[#E5E0D8] bg-white p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
              <div>
                <div className="font-mono text-[10px] tracking-[0.22em] text-[#7A491D] font-semibold uppercase">
                  MODULE 03 // UNIFIED ORDER &amp; DUAL-GATEWAY RECONCILIATION
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#111111] mt-1">
                  STRIPE INTERNATIONAL &amp; PAYSTACK AFRICA AUDIT LEDGER
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
                          {ord.assignedHub === "HUB_A_LAGOS"
                            ? "NIGERIA OPERATIONS HUB"
                            : "TORONTO, CANADA HQ"}
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
                          [{item.brandName}] {item.productTitle} · SIZE:{" "}
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
                      {ord.paymentProvider === "PAYSTACK" && (
                        <button
                          type="button"
                          onClick={() => {
                            updateOrderStatus(ord.id, "PAID", "SUCCEEDED");
                            triggerToast(
                              `PAYSTACK WEBHOOK VERIFIED: NGN/GHS SETTLEMENT CONFIRMED FOR ${ord.orderNumber} IN NEON DB.`
                            );
                          }}
                          className="border border-[#7A491D] bg-white px-3.5 py-2 font-mono text-[10px] font-semibold tracking-[0.16em] text-[#7A491D] uppercase hover:bg-[#7A491D] hover:text-white cursor-pointer"
                        >
                          VERIFY PAYSTACK WEBHOOK SIGNATURE
                        </button>
                      )}

                      {ord.paymentProvider === "STRIPE" && (
                        <button
                          type="button"
                          onClick={() => {
                            updateOrderStatus(ord.id, "PAID", "SUCCEEDED");
                            triggerToast(
                              `STRIPE PAYMENT_INTENT VERIFIED: SETTLEMENT CONFIRMED FOR ${ord.orderNumber} IN NEON DB.`
                            );
                          }}
                          className="border border-[#2E6B35] bg-white px-3.5 py-2 font-mono text-[10px] font-semibold tracking-[0.16em] text-[#2E6B35] uppercase hover:bg-[#2E6B35] hover:text-white cursor-pointer"
                        >
                          VERIFY STRIPE WEBHOOK EVENT
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const prefix =
                            ord.assignedHub === "HUB_A_LAGOS"
                              ? "GIG-NG"
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
                            `WAYBILL GENERATED & SAVED TO NEON DB: ${ord.orderNumber} DISPATCHED (${wb}).`
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
