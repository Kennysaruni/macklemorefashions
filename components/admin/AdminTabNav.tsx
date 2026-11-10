"use client";

import React from "react";
import { motion } from "framer-motion";

export type AdminTab =
  | "OVERVIEW"
  | "PRODUCTS"
  | "ORDERS"
  | "BRANDS"
  | "DROPS"
  | "B2B"
  | "MEDIA";

interface AdminTabNavProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  counts?: {
    products?: number;
    orders?: number;
    brands?: number;
    b2b?: number;
    media?: number;
  };
}

const TABS: { id: AdminTab; label: string; countKey?: keyof NonNullable<AdminTabNavProps["counts"]> }[] = [
  { id: "OVERVIEW", label: "Sales & Activity" },
  { id: "PRODUCTS", label: "Clothes & Stock", countKey: "products" },
  { id: "ORDERS", label: "Customer Orders", countKey: "orders" },
  { id: "BRANDS", label: "Partner Brands", countKey: "brands" },
  { id: "DROPS", label: "Collections & Drops" },
  { id: "B2B", label: "B2B Enquiries", countKey: "b2b" },
  { id: "MEDIA", label: "Photos & Media", countKey: "media" },
];

export function AdminTabNav({
  activeTab,
  onTabChange,
  counts = {},
}: AdminTabNavProps) {
  return (
    <nav className="rounded-sm border border-[#EADFD0] bg-white p-1.5 shadow-xs mb-6 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 min-w-max">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = tab.countKey ? counts[tab.countKey] : undefined;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              type="button"
              className={`relative flex items-center gap-2 rounded-sm px-4.5 py-3 text-xs font-medium transition-colors cursor-pointer select-none ${
                isActive
                  ? "text-[#1F1A17] font-semibold"
                  : "text-[#6E6A63] hover:text-[#1F1A17] hover:bg-[#FAF9F6]"
              }`}
            >
              {/* Active Tab Background Slider */}
              {isActive && (
                <motion.div
                  layoutId="activeAdminTab"
                  className="absolute inset-0 rounded-sm bg-[#FAF5EE] border border-[#EADFD0]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}

              <span className="relative z-10 whitespace-nowrap text-sm">{tab.label}</span>

              {typeof count === "number" && count > 0 && (
                <span
                  className={`relative z-10 text-[11px] font-mono ${
                    isActive ? "text-[#7A491D] font-bold" : "text-[#8C827A]"
                  }`}
                >
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
