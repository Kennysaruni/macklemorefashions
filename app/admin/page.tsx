"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePlatform } from "@/lib/platform-context";
import {
  B2BLeadStatus,
  BrandRecord,
  OrderRecord,
  ProductRecord,
} from "@/lib/store-data";
import { MacklemoreLogo, TribalPatternRibbon } from "@/components/vectors/TribalVectors";
import { AdminOverviewTab } from "@/components/admin/AdminOverviewTab";
import { AdminProductsTab } from "@/components/admin/AdminProductsTab";
import { AdminOrdersTab } from "@/components/admin/AdminOrdersTab";
import { AdminBrandsTab } from "@/components/admin/AdminBrandsTab";
import { AdminDropsTab } from "@/components/admin/AdminDropsTab";
import { AdminB2BTab } from "@/components/admin/AdminB2BTab";
import { AdminMediaTab } from "@/components/admin/AdminMediaTab";
import { AdminProductModal } from "@/components/admin/AdminProductModal";
import { AdminBrandModal } from "@/components/admin/AdminBrandModal";
import { AdminDropModal } from "@/components/admin/AdminDropModal";
import { CollectionRecord } from "@/lib/store-data";

export type AdminTab =
  | "OVERVIEW"
  | "PRODUCTS"
  | "ORDERS"
  | "BRANDS"
  | "DROPS"
  | "B2B"
  | "MEDIA";

interface AnalyticsPayload {
  ok: boolean;
  revenue: {
    totalRevenueCad: number;
    totalRevenueUsd: number;
    totalRevenueNgn: number;
    totalRevenueGbp: number;
    pendingRevenueCad: number;
    totalOrdersCount: number;
    paidOrdersCount: number;
    revenueByGateway: {
      STRIPE: { count: number; totalCad: number };
      PAYSTACK: { count: number; totalCad: number };
    };
    revenueByHub: {
      HUB_A_LAGOS: { label: string; ordersCount: number; totalCad: number; stockUnits: number };
      HUB_B_TORONTO: { label: string; ordersCount: number; totalCad: number; stockUnits: number };
    };
  };
  inventory: {
    totalSkus: number;
    totalUnitsAllHubs: number;
    totalUnitsNigeria: number;
    totalUnitsToronto: number;
    lowStockAlerts: {
      sku: string;
      productTitle: string;
      size: string;
      hubALagos: number;
      hubBToronto: number;
      total: number;
    }[];
  };
  neonObjectStorage: {
    bucket: string;
    totalObjects: number;
    totalMegabytes: number;
    recentObjects?: {
      key: string;
      size: number;
      lastModified: string;
      url: string;
    }[];
  };
}

export default function AdminConsolePage() {
  const router = useRouter();

  // Authentication & Session Guard
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data?.authenticated) {
          setIsAuthenticated(true);
          setAdminUser(data.user);
        } else {
          setIsAuthenticated(false);
          router.replace("/admin/login");
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setIsAuthenticated(false);
        router.replace("/admin/login");
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Platform Store State
  const {
    storageSource,
    brands,
    addBrand,
    deleteBrand,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateVariantStock,
    collections,
    addCollection,
    deleteCollection,
    toggleCollectionLive,
    orders,
    updateOrderStatus,
    b2bInquiries,
    updateB2BStatus,
  } = usePlatform();

  // Analytics Telemetry
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const json = await res.json();
        if (json.ok) {
          setAnalytics(json);
        }
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    let ignore = false;

    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((json) => {
        if (!ignore && json?.ok) {
          setAnalytics(json);
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  // Tab State
  const [activeTab, setActiveTab] = useState<AdminTab>("OVERVIEW");

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null);

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandRecord | null>(null);

  const [isDropModalOpen, setIsDropModalOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.replace("/admin/login");
    } catch {
      router.replace("/admin/login");
    }
  };

  // Handlers
  const handleSaveProduct = async (productData: Partial<ProductRecord>) => {
    if (productData.id) {
      await updateProduct(productData.id, productData);
      showToast("Garment details updated in vault.");
    } else {
      await addProduct(productData as Omit<ProductRecord, "id">);
      showToast("New piece published to vault.");
    }
    fetchAnalytics();
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
    showToast("Piece removed from vault.");
    fetchAnalytics();
  };

  const handleUpdateStock = async (
    productId: string,
    size: string,
    hub: "hubALagos" | "hubBToronto",
    newQty: number
  ) => {
    updateVariantStock(productId, size, hub, newQty);
    showToast(`Stock updated: Size ${size} (${newQty} units)`);
    fetchAnalytics();
  };

  const handleSaveBrand = async (brandData: Partial<BrandRecord>) => {
    await addBrand(brandData as Omit<BrandRecord, "id">);
    showToast("Partner house saved.");
    fetchAnalytics();
  };

  const handleDeleteBrand = async (brandId: string, brandName: string) => {
    await deleteBrand(brandId);
    showToast(`Partner house "${brandName}" deleted.`);
    fetchAnalytics();
  };

  const handleSaveDrop = async (dropData: Omit<CollectionRecord, "id">) => {
    await addCollection(dropData);
    showToast(`Drop "${dropData.title}" published.`);
    fetchAnalytics();
  };

  const handleDeleteDrop = async (dropId: string, dropTitle: string) => {
    await deleteCollection(dropId);
    showToast(`Drop "${dropTitle}" removed.`);
    fetchAnalytics();
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus as OrderRecord["status"]);
    showToast(`Order status updated: ${newStatus.replace(/_/g, " ")}`);
    fetchAnalytics();
  };

  const handleUpdateB2BStatus = async (inquiryId: string, newStatus: B2BLeadStatus) => {
    updateB2BStatus(inquiryId, newStatus);
    showToast(`B2B inquiry status updated: ${newStatus.replace(/_/g, " ")}`);
    fetchAnalytics();
  };

  // Fast minimal fallback without blocking splash animation
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#7A491D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const ADMIN_TABS: { id: AdminTab; label: string; count?: number }[] = [
    { id: "OVERVIEW", label: "Overview" },
    { id: "PRODUCTS", label: "Products", count: products.length },
    { id: "ORDERS", label: "Orders", count: orders.length },
    { id: "BRANDS", label: "Brands", count: brands.length },
    { id: "DROPS", label: "Drops", count: collections.length },
    {
      id: "B2B",
      label: "B2B Inquiries",
      count: b2bInquiries.filter((i) => i.status === "NEW").length,
    },
    {
      id: "MEDIA",
      label: "Media Vault",
      count: analytics?.neonObjectStorage?.totalObjects,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1F1A17] flex flex-col selection:bg-[#EADFD0] selection:text-[#7A491D]">
      {/* 1. Multi-Color Tribal Pattern Ribbon at Top Border */}
      <TribalPatternRibbon className="h-2.5 sm:h-3 w-full shrink-0" />

      {/* 2. Compact Status Ribbon (matches EditorialShell exactly) */}
      <div className="w-full bg-[#FAF5EE] text-[#5C5147] border-b border-[#EADFD0] px-4 sm:px-8 py-1.5 text-[11px] sm:text-xs flex items-center justify-between gap-2 z-30">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-block w-1.5 h-1.5 rotate-45 bg-[#E31E24] shrink-0" />
          <span className="font-medium text-[#1F1A17] truncate">
            Toronto, Canada · Nigeria
          </span>
          <span className="hidden md:inline text-[#7D7065] truncate">
            · Executive Studio &amp; Multi-Hub Inventory Vault
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#7A491D] shrink-0">
          <span className="hidden sm:inline">
            {storageSource === "neon_s3" ? "Neon S3 Storage" : "Local Mock Storage"}
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="font-medium text-[#1F1A17]">
            {adminUser?.name || "Executive Admin"}
          </span>
        </div>
      </div>

      {/* 3. Single Unified Sticky Afro-Luxury Header (Matches EditorialShell primary navigation) */}
      <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EADFD0]">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 h-18 sm:h-20 flex items-center justify-between gap-6">
          {/* Left: Official Macklemore Logo */}
          <Link
            href="/admin"
            className="shrink-0 transition-transform duration-200 hover:scale-[1.02]"
          >
            <MacklemoreLogo theme="light" showSubline={false} />
          </Link>

          {/* Center: Admin Tabs Navigation with LayoutId Gliding Red Indicator */}
          <nav aria-label="Admin Navigation" className="hidden xl:flex items-center gap-7">
            {ADMIN_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative text-sm font-medium transition-colors py-2 cursor-pointer ${
                    isActive
                      ? "text-[#E31E24] font-semibold"
                      : "text-[#1F1A17] hover:text-[#7A491D]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="text-xs text-[#7A491D] ml-1.5 font-normal">
                      ({tab.count})
                    </span>
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="admin-primary-nav-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[#E31E24]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Actions with sharp tailored borders */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-sm border border-[#EADFD0] bg-[#FAF5EE] hover:bg-white text-xs font-semibold text-[#1F1A17] transition-colors"
            >
              Storefront →
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-sm border border-[#E31E24]/30 bg-white hover:bg-[#FDF2F2] text-xs font-semibold text-[#9E1015] transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Sub-Bar for Tab Navigation */}
        <div className="xl:hidden border-t border-[#F0E6D8] bg-[#FAF5EE]/70 overflow-x-auto scrollbar-none px-4 py-2 flex items-center gap-5 text-xs">
          {ADMIN_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-1 transition-colors cursor-pointer ${
                  isActive
                    ? "text-[#E31E24] font-semibold border-b-2 border-[#E31E24]"
                    : "text-[#5C5147] hover:text-[#1F1A17]"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && ` (${tab.count})`}
              </button>
            );
          })}
        </div>
      </header>

      {/* 4. Main Tab Views (Directly below single header, NO second navbar) */}
      <main className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 py-8 flex-1">
        {activeTab === "OVERVIEW" && (
          <AdminOverviewTab
            analytics={analytics}
            orders={orders}
            products={products}
            onNavigateToTab={setActiveTab}
            onRestockVariant={handleUpdateStock}
          />
        )}

        {activeTab === "PRODUCTS" && (
          <AdminProductsTab
            products={products}
            onAddNewProduct={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            onEditProduct={(p) => {
              setEditingProduct(p);
              setIsProductModalOpen(true);
            }}
            onDeleteProduct={handleDeleteProduct}
            onUpdateStock={handleUpdateStock}
          />
        )}

        {activeTab === "ORDERS" && (
          <AdminOrdersTab
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {activeTab === "BRANDS" && (
          <AdminBrandsTab
            brands={brands}
            onAddNewBrand={() => {
              setEditingBrand(null);
              setIsBrandModalOpen(true);
            }}
            onEditBrand={(b) => {
              setEditingBrand(b);
              setIsBrandModalOpen(true);
            }}
            onDeleteBrand={handleDeleteBrand}
          />
        )}

        {activeTab === "DROPS" && (
          <AdminDropsTab
            collections={collections}
            onToggleLive={(id) => {
              toggleCollectionLive(id);
              showToast("Storefront collection visibility toggled.");
            }}
            onAddNewDrop={() => setIsDropModalOpen(true)}
            onDeleteDrop={handleDeleteDrop}
          />
        )}

        {activeTab === "B2B" && (
          <AdminB2BTab
            inquiries={b2bInquiries}
            onUpdateStatus={handleUpdateB2BStatus}
          />
        )}

        {activeTab === "MEDIA" && (
          <AdminMediaTab neonStorage={analytics?.neonObjectStorage || null} />
        )}
      </main>

      {/* Modals */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        brands={brands}
        onSave={handleSaveProduct}
      />

      <AdminBrandModal
        isOpen={isBrandModalOpen}
        onClose={() => {
          setIsBrandModalOpen(false);
          setEditingBrand(null);
        }}
        brand={editingBrand}
        onSave={handleSaveBrand}
      />

      <AdminDropModal
        isOpen={isDropModalOpen}
        onClose={() => setIsDropModalOpen(false)}
        brands={brands}
        onSave={handleSaveDrop}
      />

      {/* Instant Toast Notification with sharp tailored corners */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-sm border border-[#EADFD0] bg-white px-5 py-3 text-xs font-semibold text-[#1F1A17] shadow-xl shadow-stone-300/40 animate-fade-in flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rotate-45 bg-[#2E6B35]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
