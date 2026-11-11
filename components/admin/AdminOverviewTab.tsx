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
    <div className="space-y-8">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="rounded-sm border border-[#EADFD0] bg-white p-7 shadow-xs flex flex-col justify-between min-h-[170px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-[#6E6A63]">Total Sales</span>
            {/* Currency Switcher */}
            <div className="flex items-center gap-1 bg-[#FAF5EE] border border-[#EADFD0] p-0.5 rounded-sm text-[11px] font-mono">
              {(["CAD", "USD", "NGN", "GBP"] as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-0.5 rounded-sm transition-colors cursor-pointer ${
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
          <div>
            <div className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1F1A17]">
              {formatCurrencyValue(revenueAmount, currency)}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-[#6E6A63]">
              <span className="inline-block w-1.5 h-1.5 rotate-45 bg-[#2E6B35]" />
              <span>
                {analytics?.revenue?.paidOrdersCount || orders.length} orders settled
              </span>
            </div>
          </div>
        </div>

        {/* Customer Orders */}
        <div className="rounded-sm border border-[#EADFD0] bg-white p-7 shadow-xs flex flex-col justify-between min-h-[170px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-[#6E6A63]">Customer Orders</span>
            <span className="text-xs text-[#7A491D] font-mono">
              {orders.length} total
            </span>
          </div>
          <div>
            <div className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1F1A17]">
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
        </div>

        {/* Clothes & Vault Inventory */}
        <div className="rounded-sm border border-[#EADFD0] bg-white p-7 shadow-xs flex flex-col justify-between min-h-[170px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-[#6E6A63]">Wardrobe Inventory</span>
            <span className="text-xs text-[#7A491D]">
              Dual Hubs
            </span>
          </div>
          <div>
            <div className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1F1A17]">
              {analytics?.inventory?.totalUnitsAllHubs || 0}{" "}
              <span className="text-base font-normal text-[#6E6A63]">units</span>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-[#6E6A63]">
              <span>{products.length} unique styles</span>
              <span>·</span>
              <button
                onClick={() => onNavigateToTab("PRODUCTS")}
                className="text-[#7A491D] font-medium hover:underline cursor-pointer"
              >
                Manage Stock →
              </button>
            </div>
          </div>
        </div>

        {/* Cloud Media Vault (Neon S3) */}
        <div className="rounded-sm border border-[#EADFD0] bg-white p-7 shadow-xs flex flex-col justify-between min-h-[170px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-[#6E6A63]">Media Storage</span>
            <span className="flex items-center gap-1.5 text-xs text-[#2E6B35]">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#2E6B35]" />
              Online
            </span>
          </div>
          <div>
            <div className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1F1A17]">
              {analytics?.neonObjectStorage?.totalObjects || 44}{" "}
              <span className="text-base font-normal text-[#6E6A63]">photos</span>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-[#6E6A63]">
              <span>{analytics?.neonObjectStorage?.totalMegabytes || 48} MB stored</span>
              <span>·</span>
              <span className="text-[#2E6B35]">Neon CDN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Hub Status & Low Stock Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dual Hub Overview Card */}
        <div className="rounded-sm border border-[#EADFD0] bg-white p-7 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-tight text-[#1F1A17]">
                Fulfillment Hubs
              </h2>
              <p className="text-xs text-[#6E6A63] mt-0.5">
                Live inventory allocated across international fulfillment centers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Lagos Hub */}
            <div className="rounded-sm border border-[#EADFD0] bg-[#FAF9F6] p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1F1A17]">
                  Lagos Hub (Nigeria)
                </span>
                <span className="text-xs text-[#7A491D]">
                  West Africa
                </span>
              </div>
              <div className="text-2xl font-display font-bold text-[#1F1A17]">
                {analytics?.inventory?.totalUnitsNigeria ?? 0}
                <span className="text-xs font-normal text-[#6E6A63] ml-2">
                  units in stock
                </span>
              </div>
              <p className="text-xs text-[#6E6A63] pt-1">
                Couriers: GIG Express · ECOWAS Road Corridor
              </p>
            </div>

            {/* Toronto Hub */}
            <div className="rounded-sm border border-[#EADFD0] bg-[#FAF9F6] p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1F1A17]">
                  Toronto HQ (Canada)
                </span>
                <span className="text-xs text-[#7A491D]">
                  North America
                </span>
              </div>
              <div className="text-2xl font-display font-bold text-[#1F1A17]">
                {analytics?.inventory?.totalUnitsToronto ?? 0}
                <span className="text-xs font-normal text-[#6E6A63] ml-2">
                  units in stock
                </span>
              </div>
              <p className="text-xs text-[#6E6A63] pt-1">
                Couriers: DHL Express · Canada Post Direct
              </p>
            </div>
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="rounded-sm border border-[#EADFD0] bg-white p-7 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-xl font-bold uppercase tracking-tight text-[#1F1A17]">
                  Stock Watchlist
                </h2>
                <p className="text-xs text-[#6E6A63] mt-0.5">
                  Garments and sizes with 2 or fewer units remaining
                </p>
              </div>
              <span className="text-xs font-mono text-[#7A491D]">
                {lowStockItems.length} items low
              </span>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#6E6A63]">
                All garments and sizes have ample inventory across both hubs.
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {lowStockItems.slice(0, 4).map((alert) => (
                  <div
                    key={`${alert.sku}-${alert.size}`}
                    className="flex items-center justify-between rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-4 py-3 text-xs"
                  >
                    <div>
                      <div className="font-medium text-[#1F1A17]">
                        {alert.productTitle}
                      </div>
                      <div className="text-[11px] text-[#6E6A63] mt-0.5">
                        Size: <span className="font-semibold text-[#1F1A17]">{alert.size}</span> · Lagos: {alert.hubALagos} · Toronto: {alert.hubBToronto}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-[#9E1015]">
                        {alert.total} remaining
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
                          className="rounded-sm bg-white border border-[#EADFD0] px-3 py-1 text-xs font-medium text-[#7A491D] hover:bg-[#FAF5EE] transition-colors cursor-pointer"
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

          <div className="mt-5 pt-4 border-t border-[#EADFD0]/60 flex items-center justify-between text-xs">
            <span className="text-[#6E6A63]">Changes auto-save directly to vault</span>
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
      <div className="rounded-sm border border-[#EADFD0] bg-white p-7 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-[#1F1A17]">
              Recent Orders
            </h2>
            <p className="text-xs text-[#6E6A63] mt-0.5">
              Latest purchases across international storefronts
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab("ORDERS")}
            className="rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-4 py-2.5 text-xs font-medium text-[#1F1A17] hover:bg-white hover:border-[#7A491D] transition-colors cursor-pointer"
          >
            All Orders ({orders.length}) →
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#6E6A63]">
            No customer orders recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EADFD0] text-[#6E6A63] font-medium text-xs">
                  <th className="pb-3.5 font-semibold">Order</th>
                  <th className="pb-3.5 font-semibold">Client</th>
                  <th className="pb-3.5 font-semibold">Destination</th>
                  <th className="pb-3.5 font-semibold">Total Paid</th>
                  <th className="pb-3.5 font-semibold">Gateway</th>
                  <th className="pb-3.5 font-semibold">Status</th>
                  <th className="pb-3.5 font-semibold text-right">Waybill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADFD0]/60">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-4 font-semibold text-[#1F1A17]">
                      {order.orderNumber}
                    </td>
                    <td className="py-4">
                      <div className="font-medium text-[#1F1A17]">{order.customerName}</div>
                      <div className="text-[11px] text-[#6E6A63]">{order.customerEmail}</div>
                    </td>
                    <td className="py-4 text-[#6E6A63]">
                      {order.destinationCity}, {order.destinationCountry}
                    </td>
                    <td className="py-4 font-semibold text-[#1F1A17]">
                      {formatCurrencyValue(order.totalAmount, order.currency)}
                    </td>
                    <td className="py-4 text-[#7A491D]">
                      {order.paymentProvider}
                    </td>
                    <td className="py-4">
                      <span className="text-[#2E6B35] font-medium">
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-4 text-right font-mono text-[11px] text-[#7A491D]">
                      {order.waybillNumber || "Pending"}
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
