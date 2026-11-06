"use client";

import React, { useState } from "react";
import { usePlatform } from "@/lib/platform-context";
import {
  CurtainReveal,
  StaggeredText,
} from "@/components/motion/MotionPrimitives";
import {
  TribalCornerWatermark,
  TribalSectionSeparator,
} from "@/components/vectors/TribalVectors";
import { ContinentalMapBanner } from "@/components/vectors/ContinentalMapBanner";

const INFRASTRUCTURE_PILLARS = [
  {
    code: "01 // CUSTOMS & BONDED LOGISTICS",
    title: "SOVEREIGN CUSTOMS CLEARANCE & DUAL-HUB WAREHOUSING",
    metrics: "[ HUB A: VICTORIA ISLAND, LAGOS // HUB B: TORONTO, CANADA ]",
    description:
      "We eliminate the #1 barrier facing international fashion houses entering Africa. Inventory is imported in consolidated commercial air-freight tranches into our bonded Lagos facility under ECOWAS & ATA Carnet protocols, pre-positioning stock for 24–48h dispatch across Nigeria, Ghana, and Kenya.",
  },
  {
    code: "02 // TREASURY & FX SETTLEMENT",
    title: "LOCAL PAYMENT ACCEPTANCE WITH HARD-CURRENCY REMITTANCE",
    metrics: "[ PAYSTACK NGN/GHS // M-PESA DARAJA 2.0 KES // STRIPE CAD/USD/EUR/GBP ]",
    description:
      "African luxury consumers transact natively via Paystack bank transfers, USSD, and M-Pesa STK Push, while diaspora patrons use Stripe and Apple Pay. Macklemore Fashion absorbs local payment complexity and remits net partner proceeds in CAD, USD, EUR, or GBP on a monthly settlement cycle.",
  },
  {
    code: "03 // RETAIL & SHOWROOM FOOTPRINT",
    title: "PHYSICAL SHOWROOMS, PRIVATE TRUNK SHOWS & POP-UP ARCHITECTURE",
    metrics: "[ VICTORIA ISLAND · OSU ACCRA · WESTLANDS NAIROBI · YORKVILLE TORONTO ]",
    description:
      "Beyond digital flagships at /brands/[slug], represented brands receive seasonal showroom appointments, private collector previews, and mono-brand architectural pop-ups in West and East Africa's highest-net-worth districts.",
  },
  {
    code: "04 // CULTURAL & VIP PATRONAGE",
    title: "AFRO-ATLANTIC EDITORIAL DIRECTION & TALENT SEEDING",
    metrics: "[ LAGOS · LONDON · TORONTO · NAIROBI SYNDICATION ]",
    description:
      "In-house campaign production, lookbook styling, and direct placement with premier African and international recording artists, contemporary art collectors, and cultural tastemakers.",
  },
];

export default function PartnershipsPage() {
  const { submitB2BInquiry, brands } = usePlatform();

  const [showProspectusModal, setShowProspectusModal] = useState(false);
  const [brandOrCompanyName, setBrandOrCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [headquartersCountry, setHqCountry] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [annualVolumeTier, setAnnualVolumeTier] = useState("$250K - $1M");
  const [targetRegions, setTargetRegions] = useState<string[]>([
    "WEST_AFRICA",
    "EAST_AFRICA",
  ]);
  const [message, setMessage] = useState("");
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const toggleRegion = (reg: string) => {
    setTargetRegions((prev) =>
      prev.includes(reg) ? prev.filter((r) => r !== reg) : [...prev, reg]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record = submitB2BInquiry({
      channel: "BRAND_REPRESENTATION",
      brandOrCompanyName,
      contactName,
      contactRole,
      email,
      phone,
      headquartersCountry,
      websiteUrl,
      targetRegions:
        targetRegions.length > 0 ? targetRegions : ["WEST_AFRICA"],
      annualVolumeTier,
      message,
    });
    setSubmittedRef(record.referenceCode);
  };

  const handleDownloadProspectus = () => {
    const content = `====================================================================
MACKLEMORE FASHION INC. (TORONTO // LAGOS // NAIROBI)
2026/2027 B2B CONTINENTAL BRAND REPRESENTATION & DISTRIBUTION PROSPECTUS
====================================================================

1. EXECUTIVE SUMMARY
Macklemore Fashion (macklemorefashions.com) is a Canadian-incorporated
luxury fashion enterprise with primary operational headquarters in
Victoria Island, Lagos, Nigeria. We act as the sovereign retail gateway
and B2B distribution partner for international and African luxury houses.

2. OPERATING HUBS & LOGISTICS CORRIDORS
- HUB A (Lagos, Nigeria): Victoria Island Bonded Fulfillment & Showroom
  Couriers: GIG Logistics Priority (Nigeria/ECOWAS), DHL Express Africa
- HUB B (Toronto, Canada): King West Global Distribution Center
  Couriers: DHL Express International, FedEx Priority
- EAST AFRICA NODE (Nairobi, Kenya): Westlands Showroom & Dispatch
  Couriers: Wells Fargo / Fargo Courier Kenya

3. COMMERCIAL & COMMISSION MODELS
- Standard Representation Commission: 20% - 25% of Net Retail GMV
- Wholesale Buyout & Consignment Tranches Available
- Dedicated Partner Microsite: macklemorefashions.com/brands/[slug]
- Multi-Currency Settlement: CAD, USD, GBP, EUR, NGN, GHS, KES

4. CONTACT DIRECTORATE
- Lagos HQ Desk: partnerships-lagos@macklemorefashions.com
- Toronto HQ Desk: partnerships-toronto@macklemorefashions.com
====================================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Macklemore-Fashion-B2B-Distribution-Prospectus-2026.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F6F5F1]">
      {/* 1. Executive B2B Hero */}
      <section className="relative border-b border-stone-800 overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.07} />
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-6 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-800">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
                <span className="px-2.5 py-1 border border-[#E31E24] text-[#E31E24]">
                  [ B2B BRAND REPRESENTATION &amp; CONTINENTAL DISTRIBUTION ]
                </span>
                <span className="px-2.5 py-1 border border-stone-800 text-[#D4860B]">
                  [ LAGOS · ACCRA · NAIROBI · TORONTO ]
                </span>
              </div>

              <StaggeredText
                text="THE CONTINENTAL GATEWAY FOR GLOBAL & AFRICAN LUXURY HOUSES"
                as="h1"
                className="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight leading-[0.96]"
              />

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl">
                Macklemore Fashion provides international luxury labels and
                avant-garde streetwear houses with turn-key market entry,
                customs clearance, multi-hub warehousing, local mobile-money/card
                settlement, and flagship representation across West Africa, East
                Africa, and North America.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 font-mono text-xs uppercase tracking-widest">
                <button
                  type="button"
                  onClick={handleDownloadProspectus}
                  className="px-6 py-4 bg-[#E31E24] hover:bg-[#D4860B] hover:text-[#0B0B0C] text-white font-bold transition-colors cursor-pointer"
                >
                  [ ↓ DOWNLOAD B2B PROSPECTUS (2026/27) ]
                </button>
                <button
                  type="button"
                  onClick={() => setShowProspectusModal(!showProspectusModal)}
                  className="px-6 py-4 border border-[#D4860B] text-[#D4860B] hover:bg-[#D4860B] hover:text-[#0B0B0C] transition-colors cursor-pointer"
                >
                  [ {showProspectusModal ? "HIDE" : "INSPECT"} COMMERCIAL TERMS ]
                </button>
              </div>
            </div>

            {/* Key Institutional Metrics */}
            <div className="pt-12 mt-12 border-t border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
              <div className="p-3.5 border border-stone-800 bg-[#101012]">
                <span className="text-2xl font-bold text-[#F6F5F1] block">
                  {brands.length} HOUSES
                </span>
                <span className="text-[10px] text-[#D4860B] uppercase">
                  ACTIVE PORTFOLIO
                </span>
              </div>
              <div className="p-3.5 border border-stone-800 bg-[#101012]">
                <span className="text-2xl font-bold text-[#F6F5F1] block">
                  24–72H
                </span>
                <span className="text-[10px] text-[#D4860B] uppercase">
                  CUSTOMS &amp; DISPATCH SLA
                </span>
              </div>
              <div className="p-3.5 border border-stone-800 bg-[#101012]">
                <span className="text-2xl font-bold text-[#F6F5F1] block">
                  100%
                </span>
                <span className="text-[10px] text-[#D4860B] uppercase">
                  HARD-CURRENCY REMITTANCE
                </span>
              </div>
              <div className="p-3.5 border border-stone-800 bg-[#101012]">
                <span className="text-2xl font-bold text-[#F6F5F1] block">
                  3 HUBS
                </span>
                <span className="text-[10px] text-[#D4860B] uppercase">
                  LOS // YYZ // NBO
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <CurtainReveal duration={1.1} className="h-full">
              <div className="relative h-[460px] lg:h-full min-h-[500px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=85"
                  alt="Macklemore B2B Representation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-black/30" />
                <div className="absolute bottom-6 left-6 right-6 p-5 border border-stone-800 bg-[#0B0B0C]/90 font-mono text-xs space-y-1">
                  <div className="text-[#D4860B] uppercase">
                    [ CASE STUDY // LUCA MILANO SRL ]
                  </div>
                  <p className="text-stone-300 text-[11px] leading-relaxed">
                    Onboarded via Macklemore B2B Desk with dedicated microsite
                    (/brands/luca), bonded Lagos Hub A stock, and 340% Q3 sell-through
                    across Victoria Island &amp; Nairobi.
                  </p>
                </div>
              </div>
            </CurtainReveal>
          </div>
        </div>

        {/* Expandable Commercial Terms & Prospectus Sheet */}
        {showProspectusModal && (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 border-t border-stone-800 bg-[#121214] font-mono text-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#D4860B] uppercase">
                [ INSTITUTIONAL PROSPECTUS SUMMARY // COMMERCIAL TERMS MATRIX ]
              </span>
              <button
                type="button"
                onClick={() => setShowProspectusModal(false)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                [ CLOSE X ]
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-stone-800 bg-[#0B0B0C]">
                <div className="text-[#E31E24] font-bold uppercase">
                  TIER 1: DIGITAL &amp; DROP REPRESENTATION
                </div>
                <div className="text-stone-300 mt-2">
                  20% Commission // Dedicated `/brands/[slug]` microsite, global
                  multi-currency checkout, and editorial lookbook syndication.
                </div>
              </div>
              <div className="p-4 border border-stone-800 bg-[#0B0B0C]">
                <div className="text-[#D4860B] font-bold uppercase">
                  TIER 2: FULL CONTINENTAL 3PL &amp; BONDED HUB
                </div>
                <div className="text-stone-300 mt-2">
                  24.5% Commission // Bonded warehousing in Hub A (Lagos) &amp;
                  Hub B (Toronto), customs clearance, GIG &amp; Wells Fargo last-mile.
                </div>
              </div>
              <div className="p-4 border border-stone-800 bg-[#0B0B0C]">
                <div className="text-[#E05C1A] font-bold uppercase">
                  TIER 3: SOVEREIGN FLAGSHIP &amp; WHOLESALE BUYOUT
                </div>
                <div className="text-stone-300 mt-2">
                  Custom Wholesale Tranche // Physical showroom placement in
                  Victoria Island, Accra &amp; Nairobi + VIP trunk show production.
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. Four Pillars of Continental Distribution */}
      <section className="bg-[#F6F5F1] text-[#0B0B0C] py-16 sm:py-24 border-b border-neutral-300">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-10">
          <div>
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#B03A10] block">
              [ OPERATIONAL CAPABILITIES // WHY GLOBAL BRANDS PARTNER WITH
              MACKLEMORE ]
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight mt-2">
              FOUR PILLARS OF CONTINENTAL EXECUTION
            </h2>
          </div>

          <TribalSectionSeparator
            theme="light"
            label="INFRASTRUCTURE MATRIX"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INFRASTRUCTURE_PILLARS.map((pillar) => (
              <div
                key={pillar.code}
                className="p-6 sm:p-8 border border-neutral-300 bg-white flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[#B03A10] block">
                    [ {pillar.code} ]
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-200 font-mono text-[10px] text-[#7A491D] uppercase">
                  {pillar.metrics}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Interactive Logistics & Hub Footprint Map */}
      <ContinentalMapBanner compact={true} />

      {/* 4. Direct B2B Brand Representation Inquiry Form */}
      <section
        id="b2b-inquiry-desk"
        className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 sm:py-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-stone-800 bg-[#101012]">
          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-stone-800 flex flex-col justify-between">
            <div className="space-y-5">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#D4860B] block">
                [ DIRECT APPLICATION // B2B COMMERCIAL DESK ]
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight">
                SUBMIT BRAND REPRESENTATION OR WHOLESALE MANDATE
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Applications are routed directly to our Commercial Directorate
                in Lagos (for West &amp; East Africa mandates) and Toronto (for
                North American &amp; European mandates). You can also inspect
                your submitted application live in the{" "}
                <code className="text-[#D4860B]">/admin</code> B2B Lead Desk.
              </p>
            </div>

            <div className="pt-8 mt-8 border-t border-stone-800 space-y-3 font-mono text-xs text-stone-400">
              <div>
                <span className="text-[#D4860B] block">
                  [ LAGOS OPERATIONAL HQ ]
                </span>
                Victoria Island, Lagos, Nigeria // +234 (0) 1 889 4400
              </div>
              <div>
                <span className="text-[#D4860B] block">
                  [ TORONTO CORPORATE HQ ]
                </span>
                King Street West, Toronto, ON, Canada // +1 (416) 890-2210
              </div>
              <div>
                <span className="text-[#D4860B] block">
                  [ NAIROBI EAST AFRICA DESK ]
                </span>
                Westlands Commercial Center, Nairobi, Kenya // +254 20 790 1120
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12">
            {submittedRef ? (
              <div className="p-8 border border-[#D4860B] bg-[#0B0B0C] space-y-5 font-mono">
                <span className="px-3 py-1 border border-[#E31E24] text-[#E31E24] text-[10px] uppercase inline-block">
                  [ TRANSMISSION CONFIRMED // REF: {submittedRef} ]
                </span>
                <h3 className="font-display text-2xl font-bold uppercase text-white">
                  DOSSIER LOGGED WITH MACKLEMORE B2B DIRECTORATE
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Your brand representation dossier for{" "}
                  <strong className="text-[#D4860B]">
                    {brandOrCompanyName}
                  </strong>{" "}
                  has been entered into our executive pipeline with status{" "}
                  <code className="text-[#E31E24]">[ NEW ]</code>. Our regional
                  director will respond within 24 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedRef(null);
                    setBrandOrCompanyName("");
                    setMessage("");
                  }}
                  className="px-6 py-3 border border-stone-700 hover:border-[#D4860B] text-xs uppercase cursor-pointer"
                >
                  [ SUBMIT ANOTHER MANDATE ]
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 font-mono text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-[#D4860B] uppercase block mb-1.5">
                      BRAND OR FASHION HOUSE NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={brandOrCompanyName}
                      onChange={(e) => setBrandOrCompanyName(e.target.value)}
                      placeholder="e.g. MAISON VANCE MILANO"
                      className="w-full px-3.5 py-2.5 bg-[#0B0B0C] border border-stone-800 focus:border-[#D4860B] focus:outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#D4860B] uppercase block mb-1.5">
                      HEADQUARTERS COUNTRY &amp; CITY *
                    </label>
                    <input
                      type="text"
                      required
                      value={headquartersCountry}
                      onChange={(e) => setHqCountry(e.target.value)}
                      placeholder="e.g. Milan, Italy / London, UK"
                      className="w-full px-3.5 py-2.5 bg-[#0B0B0C] border border-stone-800 focus:border-[#D4860B] focus:outline-none text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-[#D4860B] uppercase block mb-1.5">
                      EXECUTIVE CONTACT NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3.5 py-2.5 bg-[#0B0B0C] border border-stone-800 focus:border-[#D4860B] focus:outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#D4860B] uppercase block mb-1.5">
                      TITLE / ROLE *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactRole}
                      onChange={(e) => setContactRole(e.target.value)}
                      placeholder="e.g. Head of Global Sales / Founder"
                      className="w-full px-3.5 py-2.5 bg-[#0B0B0C] border border-stone-800 focus:border-[#D4860B] focus:outline-none text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] text-[#D4860B] uppercase block mb-1.5">
                      CORPORATE EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="director@brand.com"
                      className="w-full px-3.5 py-2.5 bg-[#0B0B0C] border border-stone-800 focus:border-[#D4860B] focus:outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#D4860B] uppercase block mb-1.5">
                      DIRECT PHONE / WHATSAPP *
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 / +234 / +1..."
                      className="w-full px-3.5 py-2.5 bg-[#0B0B0C] border border-stone-800 focus:border-[#D4860B] focus:outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#D4860B] uppercase block mb-1.5">
                      PROJECTED ANNUAL GMV TIER
                    </label>
                    <select
                      value={annualVolumeTier}
                      onChange={(e) => setAnnualVolumeTier(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0B0B0C] border border-stone-800 focus:border-[#D4860B] focus:outline-none text-white"
                    >
                      <option value="< $250K">&lt; $250K CAD</option>
                      <option value="$250K - $1M">$250K – $1M CAD</option>
                      <option value="$1M - $5M">$1M – $5M CAD</option>
                      <option value="$5M+">$5M+ CAD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#D4860B] uppercase block mb-1.5">
                    TARGET DISTRIBUTION TERRITORIES
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      "WEST_AFRICA",
                      "EAST_AFRICA",
                      "NORTH_AMERICA",
                      "EUROPE",
                    ].map((reg) => {
                      const active = targetRegions.includes(reg);
                      return (
                        <button
                          key={reg}
                          type="button"
                          onClick={() => toggleRegion(reg)}
                          className={`py-2 px-3 border text-[10px] uppercase cursor-pointer ${
                            active
                              ? "border-[#E31E24] bg-[#E31E24] text-white font-bold"
                              : "border-stone-800 bg-[#0B0B0C] text-stone-400"
                          }`}
                        >
                          [ {reg.replace("_", " ")} ]
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#D4860B] uppercase block mb-1.5">
                    WEBSITE / LOOKBOOK DECK URL
                  </label>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 bg-[#0B0B0C] border border-stone-800 focus:border-[#D4860B] focus:outline-none text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#D4860B] uppercase block mb-1.5">
                    DISTRIBUTION OBJECTIVES, SEASONAL TIMELINE &amp; SKU COUNT *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Outline your collection architecture, target retail launch window, and warehousing requirements..."
                    className="w-full p-3.5 bg-[#0B0B0C] border border-stone-800 focus:border-[#D4860B] focus:outline-none text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#E31E24] hover:bg-[#D4860B] hover:text-[#0B0B0C] text-white font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
                >
                  [ TRANSMIT B2B REPRESENTATION APPLICATION → ]
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

