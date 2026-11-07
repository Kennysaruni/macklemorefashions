"use client";

import React, { useState } from "react";
import { TribalCornerWatermark } from "./TribalVectors";

interface HubNode {
  id: string;
  badge: string;
  city: string;
  country: string;
  role: string;
  svgX: number;
  svgY: number;
  coverage: string;
  deliverySummary: string;
  showroomAddress: string;
  accentColor: string;
}

const HUB_NODES: HubNode[] = [
  {
    id: "lagos",
    badge: "Operational Headquarters",
    city: "Lagos",
    country: "Nigeria",
    role: "Our primary West African flagship showroom, regional distribution hub, and brand representation headquarters.",
    svgX: 505,
    svgY: 255,
    coverage: "Nigeria, Benin, Togo & West Africa",
    deliverySummary: "Same-day Lagos delivery · 24–48h nationwide",
    showroomAddress: "14 Adeola Odeku Street, Victoria Island, Lagos",
    accentColor: "#E31E24",
  },
  {
    id: "toronto",
    badge: "Canadian Headquarters",
    city: "Toronto",
    country: "Canada",
    role: "Our corporate headquarters and North American distribution hub serving customers across Canada and the United States.",
    svgX: 255,
    svgY: 145,
    coverage: "Canada, United States & International",
    deliverySummary: "1–3 business days across North America",
    showroomAddress: "620 King Street West, Toronto, ON",
    accentColor: "#D4860B",
  },
  {
    id: "nairobi",
    badge: "East Africa Hub",
    city: "Nairobi",
    country: "Kenya",
    role: "Our East African retail and partner distribution hub connecting Nairobi's vibrant fashion community with global labels.",
    svgX: 590,
    svgY: 280,
    coverage: "Kenya, Uganda, Tanzania & Rwanda",
    deliverySummary: "Same-day Nairobi · 24–48h East Africa",
    showroomAddress: "Westlands & College House Corridor, Nairobi",
    accentColor: "#E05C1A",
  },
  {
    id: "accra",
    badge: "West Africa Partner Hub",
    city: "Accra",
    country: "Ghana",
    role: "Serving our growing clientele and partner boutiques across Ghana and the coastal West African corridor.",
    svgX: 482,
    svgY: 258,
    coverage: "Greater Accra, Kumasi & Coastal Corridor",
    deliverySummary: "24h express from Lagos · Same-day Accra",
    showroomAddress: "Osu & Airport Residential Area, Accra",
    accentColor: "#7A491D",
  },
  {
    id: "europe",
    badge: "UK & European Partner Hub",
    city: "London & Milan",
    country: "UK & Europe",
    role: "Partner brand curation and international consolidations for labels such as LUCA and European design houses.",
    svgX: 500,
    svgY: 132,
    coverage: "United Kingdom, Italy, France & EU",
    deliverySummary: "2–4 business days express international delivery",
    showroomAddress: "Partner Showroom Network — London & Milan",
    accentColor: "#1A7A6E",
  },
];

export function ContinentalMapBanner({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [activeHub, setActiveHub] = useState<HubNode>(HUB_NODES[0]);

  return (
    <section className="relative bg-[#FAF5EE] text-[#1F1A17] border-y border-[#EADFD0] overflow-hidden py-12 sm:py-16">
      <TribalCornerWatermark position="top-right" opacity={0.05} />
      <TribalCornerWatermark position="bottom-left" opacity={0.05} />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Clean Minimalist Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
              International Presence &amp; African Reach
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F1A17] mt-1">
              Connected Across Canada, Africa &amp; Europe
            </h2>
          </div>
          <p className="text-sm text-[#5C5147] max-w-md">
            Select a city below to explore how we serve customers and partner brands across our key markets.
          </p>
        </div>

        {/* Rounded Card Container */}
        <div className="rounded-lg border border-[#EADFD0] bg-white shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Interactive Map Canvas (8 Columns) */}
          <div className="lg:col-span-8 p-4 sm:p-6 flex flex-col justify-between bg-white border-b lg:border-b-0 lg:border-r border-[#EADFD0]">
            <div className="relative w-full aspect-[16/9] rounded-lg border border-[#EFE7DC] bg-[#FFFDF9] overflow-hidden">
              <svg
                viewBox="0 0 900 440"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* Soft Warm Grid Lines */}
                {[80, 160, 240, 320].map((y) => (
                  <line
                    key={`lat-${y}`}
                    x1="0"
                    y1={y}
                    x2="900"
                    y2={y}
                    stroke="#F3EAE0"
                    strokeWidth="1"
                  />
                ))}
                {[150, 300, 450, 600, 750].map((x) => (
                  <line
                    key={`lon-${x}`}
                    x1={x}
                    y1="0"
                    x2={x}
                    y2="440"
                    stroke="#F3EAE0"
                    strokeWidth="1"
                  />
                ))}

                {/* Stylized Warm Continental Silhouettes */}
                {/* North America */}
                <path
                  d="M95 65L210 55L305 110L280 175L225 215L180 230L140 185L95 130Z"
                  fill="#F5EDE2"
                  stroke="#DFD2C0"
                  strokeWidth="1.2"
                />
                {/* South America */}
                <path
                  d="M235 250L315 275L300 375L255 415L230 340Z"
                  fill="#F8F2EA"
                  stroke="#E6DBD0"
                  strokeWidth="1"
                />
                {/* Europe & UK */}
                <path
                  d="M440 70L565 60L590 125L535 165L455 160L435 115Z"
                  fill="#F5EDE2"
                  stroke="#DFD2C0"
                  strokeWidth="1.2"
                />
                {/* Africa (Warm Highlighted Continent) */}
                <path
                  d="M435 180L545 178L615 225L630 280L585 385L530 400L495 320L435 265L420 220Z"
                  fill="#EFE3D2"
                  stroke="#C8A986"
                  strokeWidth="1.5"
                />
                {/* Asia */}
                <path
                  d="M595 85L810 75L840 215L720 255L615 195Z"
                  fill="#F8F2EA"
                  stroke="#E6DBD0"
                  strokeWidth="1"
                />

                {/* Warm Connection Arcs */}
                <path
                  d="M255 145 Q 380 175 505 255"
                  stroke="#E31E24"
                  strokeWidth="1.75"
                  strokeDasharray="5 4"
                />
                <path
                  d="M505 255 Q 550 268 590 280"
                  stroke="#E05C1A"
                  strokeWidth="2"
                />
                <path
                  d="M482 258 L 505 255"
                  stroke="#D4860B"
                  strokeWidth="2"
                />
                <path
                  d="M500 132 Q 512 195 505 255"
                  stroke="#1A7A6E"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path
                  d="M255 145 Q 375 95 500 132"
                  stroke="#7A491D"
                  strokeOpacity="0.6"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />

                {/* Interactive City Pins */}
                {HUB_NODES.map((node) => {
                  const isSelected = activeHub.id === node.id;
                  return (
                    <g
                      key={node.id}
                      onClick={() => setActiveHub(node)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={node.svgX}
                        cy={node.svgY}
                        r={isSelected ? 16 : 10}
                        fill={node.accentColor}
                        fillOpacity={isSelected ? 0.16 : 0.08}
                        stroke={node.accentColor}
                        strokeOpacity={isSelected ? 0.9 : 0.4}
                        strokeWidth="1.2"
                      />
                      <circle
                        cx={node.svgX}
                        cy={node.svgY}
                        r={isSelected ? 5.5 : 4}
                        fill={isSelected ? node.accentColor : "#FFFFFF"}
                        stroke={node.accentColor}
                        strokeWidth="2"
                      />
                      <text
                        x={node.svgX + 12}
                        y={node.svgY + 4}
                        fill={isSelected ? "#1F1A17" : "#6E6359"}
                        fontSize="11"
                        fontWeight={isSelected ? "700" : "500"}
                      >
                        {node.city}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Hub Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
              {HUB_NODES.map((node) => {
                const isSelected = activeHub.id === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveHub(node)}
                    className={`px-3.5 py-2.5 rounded-md text-left border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-[#1F1A17] bg-[#1F1A17] text-white shadow-xs"
                        : "border-[#EADFD0] bg-[#FAF5EE] text-[#1F1A17] hover:border-[#7A491D] hover:bg-white"
                    }`}
                  >
                    <span
                      className={`block text-[11px] truncate ${
                        isSelected ? "text-[#EADFD0]" : "text-[#7A491D]"
                      }`}
                    >
                      {node.country}
                    </span>
                    <span className="text-xs font-semibold block mt-0.5 truncate">
                      {node.city}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Hub Summary Panel (4 Columns) */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-[#FFFDF9]">
            <div className="space-y-5">
              <div>
                <span
                  className="inline-block px-2.5 py-1 rounded-md text-xs font-medium mb-2"
                  style={{
                    backgroundColor: `${activeHub.accentColor}15`,
                    color: activeHub.accentColor,
                  }}
                >
                  {activeHub.badge}
                </span>
                <h3 className="font-display text-2xl font-semibold text-[#1F1A17]">
                  {activeHub.city}, {activeHub.country}
                </h3>
              </div>

              <p className="text-sm text-[#5C5147] leading-relaxed">
                {activeHub.role}
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-md border border-[#EADFD0] bg-[#FAF5EE]/60">
                  <span className="text-xs text-[#7A491D] font-medium block">
                    Regional Coverage
                  </span>
                  <span className="text-sm font-medium text-[#1F1A17] mt-0.5 block">
                    {activeHub.coverage}
                  </span>
                </div>

                <div className="p-3.5 rounded-md border border-[#EADFD0] bg-[#FAF5EE]/60">
                  <span className="text-xs text-[#7A491D] font-medium block">
                    Delivery Experience
                  </span>
                  <span className="text-sm font-medium text-[#1F1A17] mt-0.5 block">
                    {activeHub.deliverySummary}
                  </span>
                </div>

                {!compact && (
                  <div className="p-3.5 rounded-md border border-[#EADFD0] bg-[#FAF5EE]/60">
                    <span className="text-xs text-[#7A491D] font-medium block">
                      Location
                    </span>
                    <span className="text-sm font-medium text-[#1F1A17] mt-0.5 block">
                      {activeHub.showroomAddress}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#EADFD0] flex items-center justify-between text-xs text-[#6E6359]">
              <span>Active Market Hub</span>
              <span className="text-[#2E6B4E] font-medium">
                ● Express Fulfillment Available
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
