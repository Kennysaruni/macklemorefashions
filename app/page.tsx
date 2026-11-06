"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePlatform } from "@/lib/platform-context";
import {
  CurtainReveal,
  StaggeredText,
} from "@/components/motion/MotionPrimitives";
import {
  TribalCornerWatermark,
  TribalRailDivider,
  TribalSectionSeparator,
} from "@/components/vectors/TribalVectors";
import { EditorialProductCard } from "@/components/commerce/EditorialProductCard";
import { ContinentalMapBanner } from "@/components/vectors/ContinentalMapBanner";
import { convertPrice, formatCurrencyValue } from "@/lib/store-data";

const CAMPAIGNS = [
  {
    code: "[ CAMPAIGN 01 // PROPRIETARY FLAGSHIP DROP ]",
    title: "DROP 04: HARMATTAN & FROST",
    location: "VICTORIA ISLAND, LAGOS // KING WEST, TORONTO",
    spec: "620 GSM CANADIAN VIRGIN WOOL × HAND-LOOMED ISEYIN ASO OKE",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1800&q=85",
    ctaHref: "/shop",
    ctaLabel: "[ ACQUIRE DROP 04 ]",
  },
  {
    code: "[ CAMPAIGN 02 // REPRESENTED PARTNER HOUSE ]",
    title: "LUCA // MONOLITH CAPSULE 01",
    location: "MILAN, ITALY // DISTRIBUTED VIA HUB A LAGOS & HUB B TORONTO",
    spec: "510 GSM HIGH-TWIST MILANESE GABARDINE & RAW BONE TAILORING",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=85",
    ctaHref: "/brands/luca",
    ctaLabel: "[ ENTER LUCA MICROSITE ]",
  },
  {
    code: "[ CAMPAIGN 03 // CEREMONIAL ARCHIVE ]",
    title: "ARCHIVE 03: VICTORIA ISLAND NOCTURNE",
    location: "LAGOS // ACCRA // NAIROBI // LONDON",
    spec: "340 GSM EGYPTIAN COTTON-SILK TWILL & SAVANNAH BRONZE EMBROIDERY",
    image:
      "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?auto=format&fit=crop&w=1800&q=85",
    ctaHref: "/collections",
    ctaLabel: "[ VIEW ARCHIVE LOOKBOOK ]",
  },
];

export default function HomePage() {
  const { products, brands, currency } = usePlatform();
  const [activeCampaignIdx, setActiveCampaignIdx] = useState(0);

  const activeCampaign = CAMPAIGNS[activeCampaignIdx];
  const featuredProducts = products.slice(0, 6);
  const lucaBrand = brands.find((b) => b.slug === "luca") || brands[1];
  const lucaProducts = products.filter((p) => p.brandSlug === "luca");

  return (
    <div className="w-full">
      {/* 1. EDITORIAL RUNWAY HERO (Rich Obsidian #0B0B0C Canvas) */}
      <section className="relative bg-[#0B0B0C] text-[#F6F5F1] border-b border-stone-800 overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.07} />
        <TribalCornerWatermark position="bottom-left" opacity={0.05} />

        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12">
          {/* Left 7 Columns: Editorial Manifesto & Campaign Switcher */}
          <div className="lg:col-span-7 p-6 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-800 relative z-10">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
                <span className="px-2.5 py-1 border border-[#E31E24] text-[#E31E24]">
                  {activeCampaign.code}
                </span>
                <span className="px-2.5 py-1 border border-stone-800 text-[#D4860B]">
                  [ {activeCampaign.location} ]
                </span>
              </div>

              <StaggeredText
                text={activeCampaign.title}
                as="h1"
                className="font-display text-4xl sm:text-6xl xl:text-7xl font-bold uppercase tracking-tight leading-[0.95] text-[#F6F5F1]"
              />

              <p className="text-sm sm:text-base text-stone-300 max-w-xl leading-relaxed">
                The flagship digital headquarters of Macklemore Fashion.
                Engineered in Canada and anchored in Victoria Island, Lagos —
                bridging proprietary luxury drops and sovereign B2B brand
                distribution across West Africa, East Africa, Europe, and North
                America.
              </p>

              <div className="font-mono text-xs text-[#D4860B] uppercase tracking-wider border-l-2 border-[#E31E24] pl-3 py-1">
                [ SPEC: {activeCampaign.spec} ]
              </div>

              {/* Dual Primary Action Console */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3 font-mono text-xs uppercase tracking-[0.18em]">
                <Link
                  href={activeCampaign.ctaHref}
                  className="px-7 py-4 bg-[#E31E24] hover:bg-[#D4860B] hover:text-[#0B0B0C] text-white font-bold text-center transition-colors"
                >
                  {activeCampaign.ctaLabel}
                </Link>
                <Link
                  href="/partnerships"
                  className="px-7 py-4 border border-stone-700 hover:border-[#D4860B] text-[#F6F5F1] hover:text-[#D4860B] text-center transition-colors"
                >
                  [ B2B BRAND REPRESENTATION ]
                </Link>
              </div>
            </div>

            {/* Rotating Seasonal Campaign Selector Matrix */}
            <div className="pt-12 mt-12 border-t border-stone-800">
              <div className="flex items-center justify-between font-mono text-[10px] text-stone-400 uppercase mb-3">
                <span>[ SEASONAL CAMPAIGN SELECTOR ]</span>
                <span>
                  [ 0{activeCampaignIdx + 1} / 0{CAMPAIGNS.length} ]
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {CAMPAIGNS.map((camp, idx) => {
                  const isSelected = idx === activeCampaignIdx;
                  return (
                    <button
                      key={camp.title}
                      type="button"
                      onClick={() => setActiveCampaignIdx(idx)}
                      className={`p-3 text-left border font-mono transition-colors cursor-pointer ${
                        isSelected
                          ? "border-[#D4860B] bg-stone-900/90 text-white"
                          : "border-stone-800 bg-[#0B0B0C] text-stone-400 hover:border-stone-700"
                      }`}
                    >
                      <span className="text-[9px] text-[#D4860B] block">
                        0{idx + 1} // CAMPAIGN
                      </span>
                      <span className="text-[11px] font-bold uppercase block mt-1 truncate">
                        {camp.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Masked Curtain Reveal Runway Visual */}
          <div className="lg:col-span-5 relative bg-stone-950 flex flex-col justify-between">
            <CurtainReveal
              key={activeCampaign.image}
              duration={1.1}
              className="relative w-full h-[520px] lg:h-full min-h-[540px] overflow-hidden"
            >
              <img
                src={activeCampaign.image}
                alt={activeCampaign.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-black/30" />

              {/* Floating Architectural Telemetry Stamp */}
              <div className="absolute bottom-6 left-6 right-6 p-4 border border-stone-800 bg-[#0B0B0C]/90 backdrop-blur-sm font-mono text-[10px] uppercase space-y-1.5">
                <div className="flex items-center justify-between text-[#D4860B]">
                  <span>[ DISPATCH HUBS: LAGOS &amp; TORONTO ]</span>
                  <span>[ ACTIVE CURRENCY: {currency} ]</span>
                </div>
                <div className="text-stone-300">
                  [ GATEWAYS: STRIPE (GLOBAL) // PAYSTACK (NGN/GHS) // M-PESA
                  DARAJA 2.0 (KES) ]
                </div>
              </div>
            </CurtainReveal>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC DROP & CONTINENTAL TELEMETRY TICKER */}
      <div className="border-b border-stone-800 bg-[#121214] py-3 overflow-hidden select-none">
        <div className="animate-marquee font-mono text-[11px] tracking-[0.2em] uppercase flex items-center gap-8 text-stone-300">
          {[...Array(2)].map((_, dup) => (
            <React.Fragment key={dup}>
              <span className="text-[#E31E24] font-bold">
                ◆ [ DROP 04: HARMATTAN &amp; FROST — LIVE ALLOCATION ]
              </span>
              <span>
                [ 480–620 GSM HEAVYWEIGHT MILLING // LAGOS × TORONTO ]
              </span>
              <span className="text-[#D4860B]">
                ◆ [ EXCLUSIVE AFRICAN REPRESENTATION: LUCA MILANO ]
              </span>
              <span>
                [ SETTLEMENT: CAD $ // USD $ // GBP £ // EUR € // NGN ₦ // GHS
                GH₵ // KES KSh ]
              </span>
              <span className="text-[#E05C1A]">
                ◆ [ SAME-DAY VICTORIA ISLAND DISPATCH // 48H NAIROBI &amp;
                ACCRA // 48H TORONTO &amp; LONDON ]
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 3. DAYTIME EDITORIAL MASONRY CATALOG (#F6F5F1 Unbleached Raw Cotton / Bone Canvas) */}
      <section className="relative bg-[#F6F5F1] text-[#0B0B0C] py-16 sm:py-24 border-b border-neutral-300 overflow-hidden">
        <TribalCornerWatermark
          position="top-left"
          opacity={0.05}
          className="text-[#0B0B0C]"
        />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          {/* Editorial Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-neutral-300">
            <div>
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#B03A10] block">
                [ 01 // CURATED B2C MARKETPLACE &amp; PROPRIETARY DROPS ]
              </span>
              <StaggeredText
                text="ARCHITECTURAL MASONRY // SEASONAL ALLOCATION"
                as="h2"
                className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight mt-2 text-[#0B0B0C]"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase">
              <span className="px-3 py-2 border border-neutral-300 text-neutral-700">
                [ HOVER CARDS FOR 700MS FLAT-LAY DETAIL CROSSFADE ]
              </span>
              <Link
                href="/shop"
                className="px-5 py-2 border border-[#0B0B0C] bg-[#0B0B0C] text-[#F6F5F1] hover:bg-[#E31E24] hover:border-[#E31E24] transition-colors"
              >
                [ FULL CATALOG ({products.length} SKUS) → ]
              </Link>
            </div>
          </div>

          <TribalSectionSeparator
            theme="light"
            label="PROPRIETARY & REPRESENTED HOUSES"
            className="my-4"
          />

          {/* Asymmetrical High-Density Masonry Grid with Vertical Tribal Rail Dividers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-start mt-6">
            {/* Column 1 (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {featuredProducts[0] && (
                <EditorialProductCard
                  product={featuredProducts[0]}
                  theme="light"
                  index={0}
                  priorityAspect="tall"
                />
              )}
              {featuredProducts[3] && (
                <EditorialProductCard
                  product={featuredProducts[3]}
                  theme="light"
                  index={3}
                  priorityAspect="portrait"
                />
              )}
            </div>

            {/* Column 2 (4 cols, offset top padding on desktop for asymmetrical masonry cadence) */}
            <div className="lg:col-span-4 space-y-6 lg:mt-12">
              {featuredProducts[1] && (
                <EditorialProductCard
                  product={featuredProducts[1]}
                  theme="light"
                  index={1}
                  priorityAspect="portrait"
                />
              )}
              {featuredProducts[4] && (
                <EditorialProductCard
                  product={featuredProducts[4]}
                  theme="light"
                  index={4}
                  priorityAspect="tall"
                />
              )}
            </div>

            {/* Column 3 (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {featuredProducts[2] && (
                <EditorialProductCard
                  product={featuredProducts[2]}
                  theme="light"
                  index={2}
                  priorityAspect="tall"
                />
              )}
              {featuredProducts[5] && (
                <EditorialProductCard
                  product={featuredProducts[5]}
                  theme="light"
                  index={5}
                  priorityAspect="portrait"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. CURATED PARTNER BRAND SPOTLIGHT: LUCA (Obsidian #0B0B0C Canvas) */}
      <section className="relative bg-[#0B0B0C] text-[#F6F5F1] py-16 sm:py-24 border-b border-stone-800 overflow-hidden">
        <TribalCornerWatermark position="bottom-right" opacity={0.06} />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-stone-800 gap-4">
            <div>
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#D4860B] block">
                [ 02 // PARTNER HOUSE SPOTLIGHT // EXCLUSIVE REPRESENTATION ]
              </span>
              <StaggeredText
                text="LUCA — MILANESE TAILORING × LAGOSIAN DRAPE"
                as="h2"
                className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight mt-2"
              />
            </div>
            <Link
              href="/brands/luca"
              className="px-6 py-3 border border-[#D4860B] text-[#D4860B] hover:bg-[#D4860B] hover:text-[#0B0B0C] font-mono text-xs uppercase tracking-widest transition-colors self-start md:self-auto"
            >
              [ ENTER /BRANDS/LUCA MICROSITE → ]
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 items-stretch">
            {/* Left 5 Cols: LUCA Campaign Editorial & Representation Dossier */}
            <div className="lg:col-span-5 flex flex-col justify-between border border-stone-800 bg-[#101012] p-6 sm:p-8">
              <div className="space-y-5">
                <div className="flex items-center justify-between font-mono text-[10px] text-stone-400 uppercase border-b border-stone-800 pb-3">
                  <span>[ HOUSE CODE: BRD-LUCA-02 ]</span>
                  <span className="text-[#E31E24]">
                    [ ORIGIN: {lucaBrand.originCity} ]
                  </span>
                </div>

                <CurtainReveal duration={1.0}>
                  <div className="aspect-[16/10] overflow-hidden border border-stone-800">
                    <img
                      src={lucaBrand.lookbookBannerUrl}
                      alt={lucaBrand.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CurtainReveal>

                <h3 className="font-display text-2xl font-bold uppercase tracking-wide">
                  {lucaBrand.tagline}
                </h3>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {lucaBrand.story}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-800 space-y-3 font-mono text-[11px]">
                <div className="flex justify-between text-stone-400">
                  <span>TERRITORY MANDATE:</span>
                  <span className="text-[#F6F5F1]">
                    {lucaBrand.allocatedRegions.join(" · ")}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>FULFILLMENT NODES:</span>
                  <span className="text-[#D4860B]">
                    HUB A (LAGOS) &amp; HUB B (TORONTO)
                  </span>
                </div>
                <div className="pt-2 flex gap-2">
                  <Link
                    href="/brands/luca"
                    className="flex-1 py-3 bg-[#E31E24] hover:bg-[#D4860B] hover:text-[#0B0B0C] text-white text-center uppercase tracking-widest font-bold transition-colors"
                  >
                    [ SHOP LUCA CAPSULE ]
                  </Link>
                  <Link
                    href="/brands"
                    className="px-4 py-3 border border-stone-700 hover:border-[#D4860B] text-stone-300 uppercase tracking-widest transition-colors"
                  >
                    [ ALL {brands.length} BRANDS ]
                  </Link>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex lg:col-span-1 justify-center">
              <TribalRailDivider theme="dark" />
            </div>

            {/* Right 6 Cols: LUCA Featured Pieces */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {lucaProducts.slice(0, 2).map((prod, idx) => (
                <EditorialProductCard
                  key={prod.id}
                  product={prod}
                  theme="dark"
                  index={idx}
                />
              ))}
            </div>
          </div>

          {/* Full Partner Brand Roster Bar */}
          <div className="mt-12 pt-8 border-t border-stone-800">
            <div className="font-mono text-[10px] text-stone-400 uppercase tracking-[0.2em] mb-4">
              [ REPRESENTED &amp; DISTRIBUTED FASHION HOUSES // CLICK TO ENTER
              MICROSITE ]
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {brands.map((b) => (
                <Link
                  key={b.id}
                  href={`/brands/${b.slug}`}
                  className="p-4 border border-stone-800 hover:border-[#D4860B] bg-[#101012] transition-colors flex flex-col justify-between group"
                >
                  <span className="font-mono text-[9px] text-[#D4860B] uppercase">
                    [ {b.originCity} ]
                  </span>
                  <span className="font-display text-base font-bold uppercase mt-1 group-hover:text-[#E31E24] transition-colors">
                    {b.name}
                  </span>
                  <span className="font-mono text-[10px] text-stone-400 mt-2">
                    {b.isProprietary
                      ? "[ PROPRIETARY LABEL ]"
                      : "[ PARTNER HOUSE → ]"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE GLOBAL & AFRICAN LOGISTICS MAP BANNER */}
      <ContinentalMapBanner compact={false} />

      {/* 6. B2B BRAND REPRESENTATION & DISTRIBUTION EXECUTIVE PORTAL CALLOUT */}
      <section className="relative bg-[#F6F5F1] text-[#0B0B0C] py-16 sm:py-24 border-b border-neutral-300 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 border border-neutral-400 bg-white">
            <div className="lg:col-span-8 p-8 sm:p-12 lg:p-16 space-y-6 border-b lg:border-b-0 lg:border-r border-neutral-300">
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#B03A10] block">
                [ 03 // B2B INSTITUTIONAL INFRASTRUCTURE &amp; REPRESENTATION ]
              </span>
              <StaggeredText
                text="ENTER WEST & EAST AFRICA WITH TURN-KEY SOVEREIGN DISTRIBUTION"
                as="h2"
                className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight leading-none text-[#0B0B0C]"
              />
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed max-w-2xl">
                International fashion houses face high friction entering African
                luxury markets: fragmented customs clearance, FX settlement
                barriers, and last-mile security. Macklemore Fashion provides
                bonded warehousing in Victoria Island (Lagos), regional
                distribution in Accra and Nairobi, native Paystack &amp; M-Pesa
                settlement, and VIP showroom representation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 font-mono">
                <div className="p-4 border border-neutral-300 bg-[#F6F5F1]">
                  <span className="text-2xl font-bold text-[#0B0B0C] block">
                    3 HUBS
                  </span>
                  <span className="text-[10px] text-[#7A491D] uppercase">
                    LAGOS // TORONTO // NAIROBI
                  </span>
                </div>
                <div className="p-4 border border-neutral-300 bg-[#F6F5F1]">
                  <span className="text-2xl font-bold text-[#0B0B0C] block">
                    7 CURRENCIES
                  </span>
                  <span className="text-[10px] text-[#7A491D] uppercase">
                    INSTANT LOCAL &amp; FX SETTLEMENT
                  </span>
                </div>
                <div className="p-4 border border-neutral-300 bg-[#F6F5F1]">
                  <span className="text-2xl font-bold text-[#0B0B0C] block">
                    24–72H
                  </span>
                  <span className="text-[10px] text-[#7A491D] uppercase">
                    PAN-AFRICAN &amp; GLOBAL SLA
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-8 sm:p-12 bg-[#0B0B0C] text-[#F6F5F1] flex flex-col justify-between">
              <div className="space-y-4">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#D4860B] block">
                  [ EXECUTIVE DESK // B2B PROSPECTUS ]
                </span>
                <h3 className="font-display text-2xl font-bold uppercase">
                  ONBOARD YOUR LABEL FOR 2026/2027 REPRESENTATION
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Download our institutional distribution prospectus or submit a
                  direct representation application to our Lagos and Toronto
                  commercial directors.
                </p>
              </div>

              <div className="space-y-3 pt-8 font-mono text-xs uppercase">
                <Link
                  href="/partnerships"
                  className="block w-full py-4 bg-[#E31E24] hover:bg-[#D4860B] hover:text-[#0B0B0C] text-white font-bold text-center tracking-widest transition-colors"
                >
                  [ OPEN B2B PARTNERSHIPS PORTAL → ]
                </Link>
                <Link
                  href="/markets"
                  className="block w-full py-3.5 border border-stone-700 hover:border-[#D4860B] text-center text-stone-300 hover:text-white tracking-widest transition-colors"
                >
                  [ INSPECT DISTRIBUTION FOOTPRINT ]
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
