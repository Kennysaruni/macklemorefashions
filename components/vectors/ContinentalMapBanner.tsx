"use client";

import React, { useState } from "react";
import { TribalCornerWatermark } from "./TribalVectors";

interface HubNode {
  id: string;
  code: string;
  city: string;
  country: string;
  role: string;
  coordinates: string;
  svgX: number;
  svgY: number;
  gateways: string;
  couriers: string;
  transitSla: string;
  customsProtocol: string;
  accentColor: string;
}

const HUB_NODES: HubNode[] = [
  {
    id: "lagos",
    code: "HUB A // PRIMARY OPERATIONAL HQ",
    city: "LAGOS (VICTORIA ISLAND)",
    country: "NIGERIA",
    role: "Continental Headquarters, Bonded Warehouse & West/East Africa Dispatch",
    coordinates: "06°25'41\"N 03°25'19\"E",
    svgX: 505,
    svgY: 255,
    gateways: "Paystack (NGN ₦ // Cards, Bank Transfer, USSD) & Corporate Wire",
    couriers: "GIG Logistics Priority, DHL Express Africa",
    transitSla: "Same-Day Lagos // 24–48h Abuja, Port Harcourt & Accra",
    customsProtocol: "ECOWAS ETLS Duty-Free Corridor & Pre-Cleared Air Waybill",
    accentColor: "#E31E24",
  },
  {
    id: "toronto",
    code: "HUB B // CORPORATE & GLOBAL HQ",
    city: "TORONTO (KING WEST)",
    country: "CANADA",
    role: "Canadian Flagship Enterprise HQ & North America / Europe Fulfillment",
    coordinates: "43°39'12\"N 79°23'02\"W",
    svgX: 255,
    svgY: 145,
    gateways: "Stripe Checkout & Elements (CAD $, USD $, GBP £, EUR €)",
    couriers: "DHL Express International, FedEx Priority Overnight",
    transitSla: "24h Canada/US East Coast // 48–72h UK & Continental Europe",
    customsProtocol: "CUSMA / USMCA & DDP (Delivered Duty Paid) Global Air",
    accentColor: "#D4860B",
  },
  {
    id: "nairobi",
    code: "EAST AFRICA REGIONAL NODE",
    city: "NAIROBI (WESTLANDS)",
    country: "KENYA",
    role: "East African Distribution Bridge, Drop Showroom & M-Pesa Settlement Hub",
    coordinates: "01°16'05\"S 36°48'42\"E",
    svgX: 590,
    svgY: 280,
    gateways: "M-Pesa Daraja 2.0 Express STK Push (KES KSh) & Stripe",
    couriers: "Wells Fargo / Fargo Courier Kenya, DHL East Africa",
    transitSla: "Same-Day Nairobi // 24–48h Mombasa, Kampala, Kigali & Dar es Salaam",
    customsProtocol: "EAC Single Customs Territory Consolidated Clearance",
    accentColor: "#E05C1A",
  },
  {
    id: "accra",
    code: "WEST AFRICA CORRIDOR NODE",
    city: "ACCRA (OSU / AIRPORT)",
    country: "GHANA",
    role: "Gold Coast Retail Showroom & ECOWAS Coastal Distribution Node",
    coordinates: "05°33'21\"N 00°11'49\"W",
    svgX: 482,
    svgY: 258,
    gateways: "Paystack Ghana (GHS GH₵ // Mobile Money & Cards)",
    couriers: "GIG Logistics ECOWAS Express, DHL West Africa",
    transitSla: "24h from Hub A Lagos // Same-Day Greater Accra",
    customsProtocol: "ECOWAS Fast-Track Coastal Corridor",
    accentColor: "#D4860B",
  },
  {
    id: "europe",
    code: "EUROPEAN PARTNER INTAKE",
    city: "LONDON // MILAN",
    country: "UK & ITALY",
    role: "Partner Brand Consolidation (LUCA & European Houses) & VIP Client Concierge",
    coordinates: "45°27'51\"N 09°11'22\"E",
    svgX: 500,
    svgY: 132,
    gateways: "Stripe (GBP £, EUR € // Apple Pay, SEPA, Link)",
    couriers: "DHL Express Air Bridge to Lagos Hub A & Toronto Hub B",
    transitSla: "48h Direct Air Charter to Lagos & Toronto Warehouses",
    customsProtocol: "ATA Carnet & Bonded Luxury Apparel Clearance",
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
    <section className="relative bg-[#0B0B0C] text-[#F6F5F1] border-y border-stone-800 overflow-hidden">
      <TribalCornerWatermark position="top-right" opacity={0.05} />
      <TribalCornerWatermark position="bottom-left" opacity={0.05} />

      <div className="max-w-[1440px] mx-auto">
        {/* Section Header Bar */}
        <div className="px-4 sm:px-8 py-5 border-b border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#D4860B] block">
              [ TRANS-ATLANTIC & PAN-AFRICAN LOGISTICS ARCHITECTURE ]
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight mt-1">
              TORONTO — LAGOS — ACCRA — NAIROBI — MILAN BRIDGE
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase">
            <span className="px-2.5 py-1 border border-[#E31E24] text-[#E31E24]">
              [ HUB A: LAGOS HQ ACTIVE ]
            </span>
            <span className="px-2.5 py-1 border border-[#D4860B] text-[#D4860B]">
              [ HUB B: TORONTO HQ ACTIVE ]
            </span>
            <span className="px-2.5 py-1 border border-stone-700 text-stone-300">
              [ EAST AFRICA: NAIROBI ACTIVE ]
            </span>
          </div>
        </div>

        {/* Main Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-800">
          {/* Interactive Vector Map Canvas (8 Columns) */}
          <div className="lg:col-span-8 relative p-4 sm:p-8 flex flex-col justify-between bg-[#0B0B0C]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 font-mono text-[10px] text-stone-400 uppercase">
              <span>[ CLICK ANY CONTINENTAL NODE TO INSPECT TELEMETRY ]</span>
              <span>[ PROJECTION: EQUATORIAL MERCATOR // 1PX VECTOR GRID ]</span>
            </div>

            <div className="relative w-full aspect-[16/9] border border-stone-800/80 bg-[#080809] overflow-hidden">
              <svg
                viewBox="0 0 900 440"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* Architectural Latitude / Longitude Grid Lines */}
                {[60, 120, 180, 240, 300, 360].map((y) => (
                  <line
                    key={`lat-${y}`}
                    x1="0"
                    y1={y}
                    x2="900"
                    y2={y}
                    stroke="#1C1917"
                    strokeWidth="1"
                  />
                ))}
                {[120, 240, 360, 480, 600, 720, 840].map((x) => (
                  <line
                    key={`lon-${x}`}
                    x1={x}
                    y1="0"
                    x2={x}
                    y2="440"
                    stroke="#1C1917"
                    strokeWidth="1"
                  />
                ))}

                {/* Equator Reference Line */}
                <line
                  x1="0"
                  y1="270"
                  x2="900"
                  y2="270"
                  stroke="#D4860B"
                  strokeOpacity="0.25"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x="14"
                  y="264"
                  fill="#D4860B"
                  fillOpacity="0.5"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  [ EQUATOR 00°00&apos; ]
                </text>

                {/* Stylized Architectural Continental Silhouettes */}
                {/* North America */}
                <path
                  d="M95 65L210 55L305 110L280 175L225 215L180 230L140 185L95 130Z"
                  fill="#141416"
                  stroke="#292524"
                  strokeWidth="1"
                />
                {/* South America */}
                <path
                  d="M235 250L315 275L300 375L255 415L230 340Z"
                  fill="#121214"
                  stroke="#22201E"
                  strokeWidth="1"
                />
                {/* Europe & UK */}
                <path
                  d="M440 70L565 60L590 125L535 165L455 160L435 115Z"
                  fill="#141416"
                  stroke="#292524"
                  strokeWidth="1"
                />
                {/* Africa (Highlighted Primary Continental Theatre) */}
                <path
                  d="M435 180L545 178L615 225L630 280L585 385L530 400L495 320L435 265L420 220Z"
                  fill="#181512"
                  stroke="#7A491D"
                  strokeWidth="1.2"
                />
                {/* Asia / Middle East */}
                <path
                  d="M595 85L810 75L840 215L720 255L615 195Z"
                  fill="#121214"
                  stroke="#22201E"
                  strokeWidth="1"
                />

                {/* Active Logistics Corridors (Curved Vector Arcs) */}
                {/* Corridor 1: Toronto (Hub B) <-> Lagos (Hub A HQ) */}
                <path
                  d="M255 145 Q 380 175 505 255"
                  stroke="#E31E24"
                  strokeWidth="1.75"
                  strokeDasharray="5 3"
                />
                {/* Corridor 2: Lagos (Hub A) <-> Nairobi (East Africa Hub) */}
                <path
                  d="M505 255 Q 550 268 590 280"
                  stroke="#E05C1A"
                  strokeWidth="1.75"
                />
                {/* Corridor 3: Lagos (Hub A) <-> Accra (West Africa Corridor) */}
                <path
                  d="M482 258 L 505 255"
                  stroke="#D4860B"
                  strokeWidth="2"
                />
                {/* Corridor 4: Milan/London <-> Lagos (Hub A) */}
                <path
                  d="M500 132 Q 512 195 505 255"
                  stroke="#1A7A6E"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                {/* Corridor 5: Toronto (Hub B) <-> London/Milan */}
                <path
                  d="M255 145 Q 375 95 500 132"
                  stroke="#D4860B"
                  strokeOpacity="0.65"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />

                {/* Interactive Hub Nodes */}
                {HUB_NODES.map((node) => {
                  const isSelected = activeHub.id === node.id;
                  return (
                    <g
                      key={node.id}
                      onClick={() => setActiveHub(node)}
                      className="cursor-pointer"
                    >
                      {/* Outer Pulse Ring */}
                      <circle
                        cx={node.svgX}
                        cy={node.svgY}
                        r={isSelected ? 18 : 11}
                        stroke={node.accentColor}
                        strokeOpacity={isSelected ? 0.85 : 0.4}
                        strokeWidth="1"
                      />
                      {/* Diamond Node */}
                      <rect
                        x={node.svgX - 4.5}
                        y={node.svgY - 4.5}
                        width="9"
                        height="9"
                        transform={`rotate(45 ${node.svgX} ${node.svgY})`}
                        fill={isSelected ? node.accentColor : "#0B0B0C"}
                        stroke={node.accentColor}
                        strokeWidth="1.5"
                      />
                      {/* Node Label */}
                      <text
                        x={node.svgX + 12}
                        y={node.svgY + 3}
                        fill={isSelected ? "#F6F5F1" : "#A8A29E"}
                        fontSize="9.5"
                        fontFamily="monospace"
                        fontWeight={isSelected ? "bold" : "normal"}
                      >
                        [{node.city.split(" ")[0]}]
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Hub Quick Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mt-4">
              {HUB_NODES.map((node) => {
                const isSelected = activeHub.id === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveHub(node)}
                    className={`px-3 py-2.5 text-left border font-mono text-[10px] uppercase transition-colors cursor-pointer ${
                      isSelected
                        ? "border-[#D4860B] bg-stone-900/90 text-[#F6F5F1]"
                        : "border-stone-800 bg-[#0B0B0C] text-stone-400 hover:border-stone-600"
                    }`}
                  >
                    <span className="block text-[9px] text-[#D4860B] truncate">
                      {node.country}
                    </span>
                    <span className="font-bold block mt-0.5 truncate">
                      {node.city.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Hub Telemetry Console (4 Columns) */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-[#101012]">
            <div className="space-y-5">
              <div className="border-b border-stone-800 pb-4">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#E31E24] block">
                  [ {activeHub.code} ]
                </span>
                <h3 className="font-display text-2xl font-bold uppercase mt-1">
                  {activeHub.city}
                </h3>
                <span className="font-mono text-[11px] text-stone-400 block mt-1">
                  [ GPS: {activeHub.coordinates} ]
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {activeHub.role}
              </p>

              <div className="space-y-3 pt-2 font-mono text-xs">
                <div className="p-3 border border-stone-800 bg-[#0B0B0C]">
                  <span className="text-[10px] text-[#D4860B] uppercase block">
                    [ PAYMENT GATEWAY ORCHESTRATION ]
                  </span>
                  <span className="text-stone-200 mt-1 block">
                    {activeHub.gateways}
                  </span>
                </div>

                <div className="p-3 border border-stone-800 bg-[#0B0B0C]">
                  <span className="text-[10px] text-[#D4860B] uppercase block">
                    [ LOGISTICS & COURIER FLEET ]
                  </span>
                  <span className="text-stone-200 mt-1 block">
                    {activeHub.couriers}
                  </span>
                </div>

                <div className="p-3 border border-stone-800 bg-[#0B0B0C]">
                  <span className="text-[10px] text-[#D4860B] uppercase block">
                    [ TRANSIT SLA & DISPATCH WINDOW ]
                  </span>
                  <span className="text-stone-200 mt-1 block">
                    {activeHub.transitSla}
                  </span>
                </div>

                {!compact && (
                  <div className="p-3 border border-stone-800 bg-[#0B0B0C]">
                    <span className="text-[10px] text-[#D4860B] uppercase block">
                      [ CUSTOMS & DUTY CLEARANCE ]
                    </span>
                    <span className="text-stone-200 mt-1 block">
                      {activeHub.customsProtocol}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-stone-800 flex items-center justify-between font-mono text-[10px] text-stone-400 uppercase">
              <span>[ STATUS: OPERATIONAL ]</span>
              <span className="text-[#D4860B]">[ 99.4% ON-TIME DISPATCH ]</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

