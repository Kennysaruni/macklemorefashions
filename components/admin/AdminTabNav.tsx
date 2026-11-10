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

const TABS: { id: AdminTab; label: string; icon: string; countKey?: keyof NonNullable<AdminTabNavProps["counts"]> }[] = [
  { id: "OVERVIEW", label: "Sales & Activity", icon: "📊" },
  { id: "PRODUCTS", label: "Clothes & Stock", icon: "✨", countKey: "products" },
  { id: "ORDERS", label: "Customer Orders", icon: "📦", countKey: "orders" },
  { id: "BRANDS", label: "Partner Brands", icon: "🏛️", countKey: "brands" },
  { id: "DROPS", label: "Collections & Drops", icon: "🔥" },
  { id: "B2B", label: "B2B Enquiries", icon: "🤝", countKey: "b2b" },
  { id: "MEDIA", label: "Photos & Media", icon: "🖼️", countKey: "media" },
];

export function AdminTabNav({
  activeTab,
  onTabChange,
  counts = {},
}: AdminTabNavProps) {
  return (
    <nav className="rounded-2xl border border-[#EADFD0] bg-white p-1.5 shadow-sm mb-6 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1 min-w-max">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = tab.countKey ? counts[tab.countKey] : undefined;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              type="button"
              className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer select-none ${
                isActive
                  ? "text-[#1F1A17] font-semibold"
                  : "text-[#6E6A63] hover:text-[#1F1A17] hover:bg-[#FAF9F6]"
              }`}
            >
              {/* Active Tab Background Slider */}
              {isActive && (
                <motion.div
                  layoutId="activeAdminTab"
                  className="absolute inset-0 rounded-xl bg-[#FAF5EE] border border-[#EADFD0] shadow-xs"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <span className="relative z-10 text-sm leading-none">{tab.icon}</span>
              <span className="relative z-10 whitespace-nowrap">{tab.label}</span>

              {typeof count === "number" && count > 0 && (
                <span
                  className={`relative z-10 ml-0.5 rounded-full px-2 py-0.2 text-[10px] font-mono ${
                    isActive
                      ? "bg-[#7A491D] text-white"
                      : "bg-[#FAF5EE] text-[#7A491D] border border-[#EADFD0]"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

