"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlatform } from "@/lib/platform-context";
import {
  B2BLeadStatus,
  BrandRecord,
  OrderRecord,
  ProductRecord,
} from "@/lib/store-data";
import { LuxuryLoadingIndicator } from "@/components/motion/LuxuryLoadingIndicator";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminTab, AdminTabNav } from "@/components/admin/AdminTabNav";
import { AdminOverviewTab } from "@/components/admin/AdminOverviewTab";
import { AdminProductsTab } from "@/components/admin/AdminProductsTab";
import { AdminOrdersTab } from "@/components/admin/AdminOrdersTab";
import { AdminBrandsTab } from "@/components/admin/AdminBrandsTab";
import { AdminDropsTab } from "@/components/admin/AdminDropsTab";
import { AdminB2BTab } from "@/components/admin/AdminB2BTab";
import { AdminMediaTab } from "@/components/admin/AdminMediaTab";
import { AdminProductModal } from "@/components/admin/AdminProductModal";
import { AdminBrandModal } from "@/components/admin/AdminBrandModal";

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

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handlers
  const handleSaveProduct = async (productData: Partial<ProductRecord>) => {
    if (productData.id) {
      await updateProduct(productData.id, productData);
      showToast("✓ Garment details updated in vault.");
    } else {
      await addProduct(
        productData as Omit<ProductRecord, "id">
      );
      showToast("✓ New piece published to vault.");
    }
    fetchAnalytics();
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
    showToast("✓ Piece removed from vault.");
    fetchAnalytics();
  };

  const handleUpdateStock = async (
    productId: string,
    size: string,
    hub: "hubALagos" | "hubBToronto",
    newQty: number
  ) => {
    updateVariantStock(productId, size, hub, newQty);
    showToast(`✓ Stock updated: Size ${size} (${newQty} units)`);
    fetchAnalytics();
  };

  const handleSaveBrand = async (brandData: Partial<BrandRecord>) => {
    await addBrand(brandData as Omit<BrandRecord, "id">);
    showToast("✓ Partner house saved.");
    fetchAnalytics();
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus as OrderRecord["status"]);
    showToast(`✓ Order status updated: ${newStatus.replace(/_/g, " ")}`);
    fetchAnalytics();
  };

  const handleUpdateB2BStatus = async (inquiryId: string, newStatus: B2BLeadStatus) => {
    updateB2BStatus(inquiryId, newStatus);
    showToast(`✓ B2B status updated: ${newStatus.replace(/_/g, " ")}`);
    fetchAnalytics();
  };

  // Show loading indicator while authenticating
  if (isAuthenticated === null || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-[#1F1A17]">
        <LuxuryLoadingIndicator
          size="lg"
          message="Verifying Studio Session"
          subMessage="Connecting to Macklemore Flagship Vault"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1F1A17] p-4 sm:p-6 lg:p-8 selection:bg-[#EADFD0] selection:text-[#7A491D]">
      <div className="mx-auto max-w-7xl">
        {/* Boutique Studio Header */}
        <AdminHeader
          userName={adminUser?.name || "Executive Admin"}
          storageSource={storageSource}
        />

        {/* Floating Afro-Luxury Tab Navigation */}
        <AdminTabNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={{
            products: products.length,
            orders: orders.length,
            brands: brands.length,
            b2b: b2bInquiries.filter((i) => i.status === "NEW").length,
            media: analytics?.neonObjectStorage?.totalObjects,
          }}
        />

        {/* Tab Views */}
        <main>
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
            />
          )}

          {activeTab === "DROPS" && (
            <AdminDropsTab
              collections={collections}
              onToggleLive={(id) => {
                toggleCollectionLive(id);
                showToast("✓ Storefront collection visibility toggled.");
              }}
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

        {/* Instant Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-[#EADFD0] bg-white px-5 py-3 text-xs font-semibold text-[#1F1A17] shadow-xl shadow-stone-300/40 animate-fade-in flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2E6B35]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
