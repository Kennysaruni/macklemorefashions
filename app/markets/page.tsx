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
    badge: "Operational Headquarters",
    cities: "Lagos · Abuja · Accra",
    summary:
      "Anchored by our operational headquarters in Victoria Island, Lagos, with express reach across Nigeria, Ghana, and key West African capitals.",
    accent: "#E31E24",
  },
  {
    region: "East Africa",
    badge: "Regional Market Hub",
    cities: "Nairobi · Mombasa · Kigali",
    summary:
      "Serving East Africa's dynamic fashion and creative community with curated retail collections and partner brand distribution.",
    accent: "#E05C1A",
  },
  {
    region: "North America",
    badge: "Canadian Headquarters",
    cities: "Toronto · Montreal · New York",
    summary:
      "Our Canadian corporate base in Toronto connects North American shoppers and diaspora communities with our latest collections.",
    accent: "#D4860B",
  },
  {
    region: "UK & Europe",
    badge: "International Partner Network",
    cities: "London · Milan · Paris",
    summary:
      "Collaborating with European and British fashion labels, such as LUCA, to bridge international design houses with African markets.",
    accent: "#1A7A6E",
  },
];

export default function MarketsFootprintPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1F1A17]">
      {/* Page Hero */}
      <section className="relative border-b border-[#EADFD0] bg-[#FAF5EE] px-4 sm:px-8 py-12 sm:py-16 overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.05} />
        <div className="max-w-[1440px] mx-auto space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
            Our Markets &amp; Regional Reach
          </span>
          <StaggeredText
            text="Serving International & African Markets"
            as="h1"
            className="font-display text-3xl sm:text-5xl font-semibold tracking-tight max-w-3xl text-[#1F1A17]"
          />
          <p className="text-sm sm:text-base text-[#5C5147] max-w-2xl leading-relaxed">
            From our corporate base in Canada and operational headquarters in Lagos, Nigeria, Macklemore Fashion connects customers and partner brands across West Africa, East Africa, the UK, Europe, and North America.
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
