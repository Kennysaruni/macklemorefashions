"use client";

import React from "react";
import Link from "next/link";
import { ContinentalMapBanner } from "@/components/vectors/ContinentalMapBanner";
import { StaggeredText } from "@/components/motion/MotionPrimitives";
import {
  TribalCornerWatermark,
  TribalSectionSeparator,
} from "@/components/vectors/TribalVectors";

const MARKET_REGIONS = [
  {
    region: "West Africa",
    badge: "Nigeria Hub",
    cities: "Nigeria · Ghana · Senegal",
    summary: "Operations hub in Nigeria serving West Africa.",
    accent: "#E31E24",
  },
  {
    region: "North America",
    badge: "Toronto, Canada HQ",
    cities: "Toronto, Canada · USA",
    summary: "Corporate base in Toronto, Canada serving North America.",
    accent: "#D4860B",
  },
  {
    region: "East Africa",
    badge: "Express Delivery",
    cities: "Kenya · Uganda · Rwanda · Tanzania",
    summary: "Direct express delivery across East Africa.",
    accent: "#E05C1A",
  },
  {
    region: "UK, Europe & Global",
    badge: "Worldwide Delivery",
    cities: "UK · Italy · France · Global",
    summary: "International partner houses and worldwide delivery.",
    accent: "#1A7A6E",
  },
];

export default function MarketsFootprintPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1F1A17]">
      {/* Page Hero */}
      <section className="relative border-b border-[#EADFD0] bg-[#FAF5EE] px-4 sm:px-8 py-10 sm:py-14 overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.05} />
        <div className="max-w-[1440px] mx-auto space-y-2.5">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
            Global Network
          </span>
          <StaggeredText
            text="Hubs & Delivery Reach"
            as="h1"
            className="font-display text-3xl sm:text-5xl font-semibold tracking-tight max-w-3xl text-[#1F1A17]"
          />
          <p className="text-sm text-[#5C5147] max-w-xl">
            Anchored in Toronto, Canada and Nigeria, delivering across Africa and worldwide.
          </p>
        </div>
      </section>

      {/* Interactive Map */}
      <ContinentalMapBanner />

      {/* Regional Cards */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-14 sm:py-20">
        <TribalSectionSeparator
          label="Key Regions & Market Presence"
          className="mb-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MARKET_REGIONS.map((item) => (
            <div
              key={item.region}
              className="p-7 rounded-lg border border-[#EADFD0] bg-white flex flex-col justify-between gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="space-y-2.5">
                <span
                  className="inline-block px-3 py-1 rounded-md text-xs font-medium"
                  style={{
                    backgroundColor: `${item.accent}15`,
                    color: item.accent,
                  }}
                >
                  {item.badge}
                </span>
                <h2 className="font-display text-2xl font-semibold text-[#1F1A17]">
                  {item.region}
                </h2>
                <p className="text-xs font-semibold text-[#7A491D]">
                  {item.cities}
                </p>
                <p className="text-sm text-[#5C5147] leading-relaxed">
                  {item.summary}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-[#EADFD0] bg-[#FAF5EE] p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold text-[#7A491D] uppercase block">
              Expand Into New Markets
            </span>
            <h3 className="font-display text-2xl font-semibold text-[#1F1A17] mt-1">
              Interested in Distribution Across West &amp; East Africa?
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/partnerships"
              className="px-6 py-3 rounded-md bg-[#1F1A17] hover:bg-[#E31E24] text-white text-xs sm:text-sm font-medium transition-colors"
            >
              Explore Brand Partnerships →
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-md border border-[#D4B895] bg-white hover:bg-[#1F1A17] hover:text-white text-xs sm:text-sm font-medium text-[#1F1A17] transition-colors"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
