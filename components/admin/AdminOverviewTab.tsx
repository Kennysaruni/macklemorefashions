"use client";

import React, { useState } from "react";
import {
  CurrencyCode,
  formatCurrencyValue,
  OrderRecord,
  ProductRecord,
} from "@/lib/store-data";

interface AdminOverviewTabProps {
  analytics: {
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
    };
  } | null;
  orders: OrderRecord[];
  products: ProductRecord[];
  onNavigateToTab: (tab: "PRODUCTS" | "ORDERS") => void;
  onRestockVariant?: (productId: string, size: string, hub: "hubALagos" | "hubBToronto", currentQty: number) => void;
}

export function AdminOverviewTab({
  analytics,
  orders,
  products,
  onNavigateToTab,
  onRestockVariant,
}: AdminOverviewTabProps) {
  const [currency, setCurrency] = useState<CurrencyCode>("CAD");

  const revenueAmount = (() => {
    if (!analytics) return 0;
    switch (currency) {
      case "USD":
        return analytics.revenue.totalRevenueUsd;
      case "NGN":
        return analytics.revenue.totalRevenueNgn;
      case "GBP":
        return analytics.revenue.totalRevenueGbp;
      default:
        return analytics.revenue.totalRevenueCad;
    }
  })();

  const lowStockItems = analytics?.inventory?.lowStockAlerts || [];

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="rounded-3xl border border-[#EADFD0] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6A63]">Total Sales</span>
            {/* Currency Switcher */}
            <div className="flex items-center gap-1 rounded-full bg-[#FAF5EE] border border-[#EADFD0] p-0.5 text-[10px] font-mono">
              {(["CAD", "USD", "NGN", "GBP"] as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={`rounded-full px-2 py-0.5 transition-colors cursor-pointer ${
                    currency === c
                      ? "bg-[#7A491D] text-white font-semibold"
                      : "text-[#6E6A63] hover:text-[#1F1A17]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="font-display text-3xl font-bold tracking-tight text-[#1F1A17]">
            {formatCurrencyValue(revenueAmount, currency)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-[#6E6A63]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#2E6B35]" />
            <span>
              {analytics?.revenue?.paidOrdersCount || orders.length} orders settled
            </span>
          </div>
        </div>

        {/* Customer Orders */}
        <div className="rounded-3xl border border-[#EADFD0] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6A63]">Customer Orders</span>
            <span className="rounded-full bg-[#FAF5EE] border border-[#EADFD0] px-2.5 py-0.5 text-[10px] font-mono text-[#7A491D]">
              All Channels
            </span>
          </div>
          <div className="font-display text-3xl font-bold tracking-tight text-[#1F1A17]">
            {orders.length}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-[#6E6A63]">
            <span>
              Stripe: {analytics?.revenue?.revenueByGateway?.STRIPE?.count || 0}
            </span>
            <span>·</span>
            <span>
              Paystack: {analytics?.revenue?.revenueByGateway?.PAYSTACK?.count || 0}
            </span>
          </div>
        </div>

        {/* Clothes & Vault Inventory */}
        <div className="rounded-3xl border border-[#EADFD0] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6A63]">Wardrobe Inventory</span>
            <span className="rounded-full bg-[#FAF5EE] border border-[#EADFD0] px-2.5 py-0.5 text-[10px] font-mono text-[#7A491D]">
              Dual Hubs
            </span>
          </div>
          <div className="font-display text-3xl font-bold tracking-tight text-[#1F1A17]">
            {analytics?.inventory?.totalUnitsAllHubs || 0}{" "}
            <span className="text-lg font-normal text-[#6E6A63]">units</span>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-[#6E6A63]">
            <span>{products.length} unique styles</span>
            <span>·</span>
            <button
              onClick={() => onNavigateToTab("PRODUCTS")}
              className="text-[#7A491D] font-medium hover:underline cursor-pointer"
            >
              Manage →
            </button>
          </div>
        </div>

        {/* Cloud Media Vault (Neon S3) */}
        <div className="rounded-3xl border border-[#EADFD0] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6A63]">S3 Media Storage</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF7EE] border border-[#2E6B35]/20 px-2 py-0.5 text-[10px] font-mono text-[#2E6B35]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B35]" />
              Online
            </span>
          </div>
          <div className="font-display text-3xl font-bold tracking-tight text-[#1F1A17]">
            {analytics?.neonObjectStorage?.totalObjects || 44}{" "}
            <span className="text-lg font-normal text-[#6E6A63]">photos</span>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-[#6E6A63]">
            <span>{analytics?.neonObjectStorage?.totalMegabytes || 48} MB stored</span>
            <span>·</span>
            <span className="text-[#2E6B35]">Direct CDN</span>
          </div>
        </div>
      </div>

      {/* Distribution Hub Status & Low Stock Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dual Hub Overview Card */}
        <div className="rounded-3xl border border-[#EADFD0] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-lg font-bold uppercase tracking-tight text-[#1F1A17]">
                Fulfillment Hubs
              </h2>
              <p className="text-xs text-[#6E6A63]">
                Live stock allocated across continental distribution centers
              </p>
            </div>
            <span className="text-2xl">🌍</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Lagos Hub */}
            <div className="rounded-2xl border border-[#EADFD0] bg-[#FAF9F6] p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1F1A17]">
                  Lagos Hub (Nigeria)
                </span>
                <span className="text-[10px] font-mono rounded-full bg-white px-2 py-0.5 border border-[#EADFD0] text-[#7A491D]">
                  West Africa
                </span>
              </div>
              <div className="text-2xl font-display font-bold text-[#1F1A17]">
                {analytics?.inventory?.totalUnitsNigeria ?? 0}
                <span className="text-xs font-normal text-[#6E6A63] ml-1.5">
                  units in stock
                </span>
              </div>
              <p className="text-[11px] text-[#6E6A63]">
                Couriers: GIG Express · ECOWAS Road Corridor
              </p>
            </div>

            {/* Toronto Hub */}
            <div className="rounded-2xl border border-[#EADFD0] bg-[#FAF9F6] p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1F1A17]">
                  Toronto HQ (Canada)
                </span>
                <span className="text-[10px] font-mono rounded-full bg-white px-2 py-0.5 border border-[#EADFD0] text-[#7A491D]">
                  North America
                </span>
              </div>
              <div className="text-2xl font-display font-bold text-[#1F1A17]">
                {analytics?.inventory?.totalUnitsToronto ?? 0}
                <span className="text-xs font-normal text-[#6E6A63] ml-1.5">
                  units in stock
                </span>
              </div>
              <p className="text-[11px] text-[#6E6A63]">
                Couriers: DHL Express · Canada Post Direct
              </p>
            </div>
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="rounded-3xl border border-[#EADFD0] bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-lg font-bold uppercase tracking-tight text-[#1F1A17]">
                  Stock Watchlist
                </h2>
                <p className="text-xs text-[#6E6A63]">
                  Sizes with 2 or fewer units remaining
                </p>
              </div>
              <span className="rounded-full bg-[#FAF5EE] border border-[#EADFD0] px-2.5 py-1 text-xs font-mono font-semibold text-[#7A491D]">
                {lowStockItems.length} alerts
              </span>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#6E6A63]">
                ✓ All garments and sizes have ample inventory across both hubs.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {lowStockItems.slice(0, 4).map((alert) => (
                  <div
                    key={`${alert.sku}-${alert.size}`}
                    className="flex items-center justify-between rounded-xl border border-[#EADFD0] bg-[#FAF9F6] px-4 py-2.5 text-xs"
                  >
                    <div>
                      <div className="font-medium text-[#1F1A17]">
                        {alert.productTitle}
                      </div>
                      <div className="text-[11px] text-[#6E6A63]">
                        Size: <span className="font-semibold text-[#1F1A17]">{alert.size}</span> · Lagos: {alert.hubALagos} · Toronto: {alert.hubBToronto}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#FDF2F2] border border-[#E31E24]/20 px-2 py-0.5 text-[10px] font-mono text-[#9E1015]">
                        {alert.total} left
                      </span>
                      {onRestockVariant && (
                        <button
                          type="button"
                          onClick={() => {
                            const prod = products.find((p) => p.title === alert.productTitle);
                            if (prod) {
                              onRestockVariant(prod.id, alert.size, "hubALagos", alert.hubALagos + 5);
                            }
                          }}
                          className="rounded-lg bg-white border border-[#EADFD0] px-2.5 py-1 text-[11px] font-medium text-[#7A491D] hover:bg-[#FAF5EE] transition-colors cursor-pointer"
                        >
                          +5 Stock
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-[#EADFD0]/60 flex items-center justify-between text-xs">
            <span className="text-[#6E6A63]">Instant 1-click auto-save to cloud</span>
            <button
              onClick={() => onNavigateToTab("PRODUCTS")}
              className="text-[#7A491D] font-medium hover:underline cursor-pointer"
            >
              View Full Lookbook Stock →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="rounded-3xl border border-[#EADFD0] bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-[#1F1A17]">
              Recent Orders
            </h2>
            <p className="text-xs text-[#6E6A63]">
              Latest purchases across international storefronts
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab("ORDERS")}
            className="rounded-xl border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2 text-xs font-medium text-[#1F1A17] hover:bg-white hover:border-[#7A491D] transition-colors cursor-pointer"
          >
            All Orders ({orders.length}) →
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#6E6A63]">
            No customer orders recorded yet. Place a test checkout to see it live!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EADFD0] text-[#6E6A63] font-medium uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Client</th>
                  <th className="pb-3 font-semibold">Destination</th>
                  <th className="pb-3 font-semibold">Total Paid</th>
                  <th className="pb-3 font-semibold">Gateway</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Waybill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADFD0]/60">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3.5 font-semibold text-[#1F1A17]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5">
                      <div className="font-medium text-[#1F1A17]">{order.customerName}</div>
                      <div className="text-[11px] text-[#6E6A63]">{order.customerEmail}</div>
                    </td>
                    <td className="py-3.5 text-[#6E6A63]">
                      {order.destinationCity}, {order.destinationCountry}
                    </td>
                    <td className="py-3.5 font-semibold text-[#1F1A17]">
                      {formatCurrencyValue(order.totalAmount, order.currency)}
                    </td>
                    <td className="py-3.5">
                      <span className="rounded-full bg-[#FAF5EE] border border-[#EADFD0] px-2 py-0.5 text-[10px] font-mono text-[#7A491D]">
                        {order.paymentProvider}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="rounded-full bg-[#EBF7EE] border border-[#2E6B35]/20 px-2 py-0.5 text-[10px] font-medium text-[#2E6B35]">
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-mono text-[11px] text-[#7A491D]">
                      {order.waybillNumber}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

