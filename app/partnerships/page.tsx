"use client";

import React, { useState } from "react";
import { usePlatform } from "@/lib/platform-context";
import { StaggeredText } from "@/components/motion/MotionPrimitives";
import {
  TribalCornerWatermark,
  TribalSectionSeparator,
} from "@/components/vectors/TribalVectors";

const INFRASTRUCTURE_PILLARS = [
  {
    code: "PILLAR 01 // CUSTOMS & BONDED LOGISTICS",
    title: "TURNKEY AFRICAN CUSTOMS CLEARANCE & WAREHOUSING",
    description:
      "International fashion houses often fail in West and East Africa due to port congestion, unpredictable duties, and fragmented last-mile couriers. Macklemore Fashion operates pre-cleared air freight corridors from Toronto, London, and Milan directly into our Victoria Island (Lagos) and Westlands (Nairobi 254) bonded facilities.",
    metrics: [
      "48-Hour Air Charter Consolidation (Milan / London / Toronto -> Lagos)",
      "ECOWAS ETLS Duty-Optimized Distribution to Accra & Abidjan",
      "Same-Day Last-Mile Fulfillment via GIG Logistics & Wells Fargo Kenya",
    ],
  },
  {
    code: "PILLAR 02 // SOVEREIGN FINTECH SETTLEMENT",
    title: "LOCALIZED PAYSTACK & M-PESA DARAJA 2.0 ORCHESTRATION",
    description:
      "Capture high-net-worth African patronage in local tender while receiving consolidated corporate settlements in USD, EUR, GBP, or CAD via Macklemore Fashion's Canadian treasury.",
    metrics: [
      "Nigeria & Ghana: Paystack Instant Card, Bank Transfer & USSD (NGN / GHS)",
      "Kenya & East Africa: Native M-Pesa Daraja 2.0 Express STK Push (KES)",
      "Consolidated Monthly FX Repatriation in CAD / USD / EUR / GBP",
    ],
  },
  {
    code: "PILLAR 03 // CULTURAL & RETAIL FOOTPRINT",
    title: "VIP SHOWROOMS, EDITORIAL STYLING & POP-UP ACTIVATION",
    description:
      "Every represented brand receives a dedicated /brands/[slug] digital flagship on macklemorefashions.com alongside physical showroom placement in Victoria Island (Lagos), Osu (Accra), and Westlands / College House (Nairobi).",
    metrics: [
      "Private Client Styling & Afrobeats / Film / Executive Seeding Network",
      "Turnkey Seasonal Pop-Up Architecture in Lagos, Accra & Nairobi",
      "Dedicated Brand Manager & Real-Time Inventory Telemetry",
    ],
  },
];

export default function PartnershipsB2BPage() {
  const { submitB2BInquiry } = usePlatform();

  const [brandName, setBrandName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hqCountry, setHqCountry] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [volumeTier, setVolumeTier] = useState("CAD $150,000 – $500,000 / YR");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([
    "WEST_AFRICA",
    "EAST_AFRICA",
  ]);
  const [message, setMessage] = useState("");
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const toggleRegion = (reg: string) => {
    setSelectedRegions((prev) =>
      prev.includes(reg) ? prev.filter((r) => r !== reg) : [...prev, reg]
    );
  };

  const handleDownloadProspectus = () => {
    const prospectusContent = `================================================================================
MACKLEMORE FASHION INC. (TORONTO // LAGOS // NAIROBI 254)
EXECUTIVE B2B BRAND REPRESENTATION & CONTINENTAL DISTRIBUTION PROSPECTUS (2026)
================================================================================

1. CORPORATE OVERVIEW
   - Canadian Corporate Headquarters: King West Fashion District, Toronto, ON
   - African Operational Headquarters (Hub A): Victoria Island, Lagos, Nigeria
   - East African Regional Node (254): Westlands & College House, Nairobi, Kenya
   - West African Corridor Node: Osu, Accra, Ghana

2. TURNKEY REPRESENTATION INFRASTRUCTURE
   - Dedicated Partner Brand Microsite: macklemorefashions.com/brands/[slug]
   - Multi-Currency Checkout: CAD, USD, GBP, EUR, NGN, GHS, KES
   - Payment Gateways: Stripe, Paystack (Nigeria/Ghana), M-Pesa Daraja 2.0 (Kenya)
   - Logistics Fleet: GIG Logistics, Wells Fargo / Fargo Courier Kenya, DHL Express

3. COMMERCIAL MODELS
   - Model A: Exclusive Continental Representation & Consignment (20% - 25% Commission)
   - Model B: Wholesale Buyout & Bonded Warehouse Allocation (50% Deposit / 50% Upon Landing)
   - Model C: Seasonal Pop-Up & Showroom Activation (Lagos, Accra, Nairobi)

Contact Desk: b2b@macklemorefashions.com
================================================================================`;

    const blob = new Blob([prospectusContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Macklemore-Fashion-B2B-Continental-Prospectus-2026.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !contactName || !email) return;

    const record = submitB2BInquiry({
      channel: "BRAND_REPRESENTATION",
      brandOrCompanyName: brandName,
      contactName,
      contactRole: contactRole || "Executive Director",
      email,
      phone: phone || "Not Provided",
      headquartersCountry: hqCountry || "International",
      websiteUrl: websiteUrl || "https://",
      targetRegions:
        selectedRegions.length > 0 ? selectedRegions : ["WEST_AFRICA"],
      annualVolumeTier: volumeTier,
      message:
        message ||
        "Requesting executive review for African & international representation.",
    });

    setSubmittedRef(record.referenceCode);
    setBrandName("");
    setContactName("");
    setContactRole("");
    setEmail("");
    setPhone("");
    setHqCountry("");
    setWebsiteUrl("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111]">
      {/* Executive B2B Hero */}
      <section className="relative border-b border-[#E5E0D8] bg-white px-4 sm:px-8 py-16 sm:py-24 overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.05} className="text-[#7A491D]" />
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8 space-y-5">
            <span className="font-mono text-xs tracking-[0.24em] uppercase text-[#E31E24] font-semibold block">
              B2B BRAND REPRESENTATION &amp; CONTINENTAL DISTRIBUTION HUB
            </span>
            <StaggeredText
              text="YOUR GATEWAY TO WEST AFRICA, EAST AFRICA & THE GLOBAL DIASPORA."
              as="h1"
              className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[0.98] text-[#111111]"
            />
            <p className="text-sm sm:text-base text-[#4A4742] max-w-3xl leading-relaxed">
              Macklemore Fashion partners with international luxury houses and vanguard streetwear labels seeking institutional representation, customs-cleared warehousing, and localized multi-currency retail across Lagos, Accra, Nairobi (254), and Toronto.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleDownloadProspectus}
              className="w-full py-4 px-6 bg-[#111111] hover:bg-[#E31E24] text-white font-mono text-xs tracking-[0.2em] uppercase font-bold transition-colors cursor-pointer"
            >
              ↓ DOWNLOAD 2026 B2B PROSPECTUS
            </button>
            <a
              href="#b2b-inquiry-console"
              className="w-full py-3.5 px-6 border border-[#111111] bg-white hover:bg-[#111111] hover:text-white text-center font-mono text-xs tracking-[0.18em] uppercase font-semibold text-[#111111] transition-colors"
            >
              SUBMIT REPRESENTATION DOSSIER →
            </a>
          </div>
        </div>
      </section>

      {/* 3 Institutional Infrastructure Pillars */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 sm:py-24 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 border border-[#E5E0D8] divide-y lg:divide-y-0 lg:divide-x divide-[#E5E0D8] bg-white">
          {INFRASTRUCTURE_PILLARS.map((pillar) => (
            <div
              key={pillar.code}
              className="p-6 sm:p-10 flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#7A491D] font-semibold block">
                  {pillar.code}
                </span>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight leading-snug text-[#111111]">
                  {pillar.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#4A4742] leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <ul className="space-y-2 pt-5 border-t border-[#E5E0D8] font-mono text-[11px] text-[#111111]">
                {pillar.metrics.map((m) => (
                  <li key={m} className="flex items-start gap-2">
                    <span className="text-[#E31E24] mt-0.5">◆</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <TribalSectionSeparator
          label="COMMERCIAL TERMS & REGIONAL PENETRATION MATRIX"
          theme="light"
        />

        {/* Market Penetration Matrix */}
        <div className="border border-[#E5E0D8] bg-white overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[#E5E0D8] bg-[#FAF9F6] text-[#7A491D] uppercase text-[10px] tracking-wider">
                <th className="p-4 border-r border-[#E5E0D8]">TERRITORY HUB</th>
                <th className="p-4 border-r border-[#E5E0D8]">PRIMARY CITIES</th>
                <th className="p-4 border-r border-[#E5E0D8]">SETTLEMENT GATEWAY</th>
                <th className="p-4 border-r border-[#E5E0D8]">LOGISTICS PARTNER</th>
                <th className="p-4">TRANSIT SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8] text-[#111111]">
              <tr>
                <td className="p-4 border-r border-[#E5E0D8] font-bold text-[#E31E24]">
                  WEST AFRICA (HUB A)
                </td>
                <td className="p-4 border-r border-[#E5E0D8]">
                  Lagos (VI / Ikoyi), Abuja, Accra (Osu)
                </td>
                <td className="p-4 border-r border-[#E5E0D8]">
                  Paystack (NGN ₦ · GHS GH₵)
                </td>
                <td className="p-4 border-r border-[#E5E0D8]">
                  GIG Logistics Priority &amp; DHL ECOWAS
                </td>
                <td className="p-4 text-[#2E6B35] font-semibold">24–48 HOURS</td>
              </tr>
              <tr>
                <td className="p-4 border-r border-[#E5E0D8] font-bold text-[#7A491D]">
                  EAST AFRICA (254 NODE)
                </td>
                <td className="p-4 border-r border-[#E5E0D8]">
                  Nairobi (Westlands / Karen), Mombasa, Kigali
                </td>
                <td className="p-4 border-r border-[#E5E0D8]">
                  M-Pesa Daraja 2.0 STK Push (KES KSh)
                </td>
                <td className="p-4 border-r border-[#E5E0D8]">
                  Wells Fargo / Fargo Courier Kenya
                </td>
                <td className="p-4 text-[#2E6B35] font-semibold">24–72 HOURS</td>
              </tr>
              <tr>
                <td className="p-4 border-r border-[#E5E0D8] font-bold text-[#111111]">
                  NORTH AMERICA (HUB B)
                </td>
                <td className="p-4 border-r border-[#E5E0D8]">
                  Toronto, Montreal, New York, Los Angeles
                </td>
                <td className="p-4 border-r border-[#E5E0D8]">
                  Stripe Checkout &amp; Apple Pay (CAD $ · USD $)
                </td>
                <td className="p-4 border-r border-[#E5E0D8]">
                  DHL Express &amp; FedEx Priority
                </td>
                <td className="p-4 text-[#2E6B35] font-semibold">24–48 HOURS</td>
              </tr>
              <tr>
                <td className="p-4 border-r border-[#E5E0D8] font-bold text-[#1A7A6E]">
                  UK &amp; EUROPE
                </td>
                <td className="p-4 border-r border-[#E5E0D8]">
                  London, Milan, Paris, Berlin, Amsterdam
                </td>
                <td className="p-4 border-r border-[#E5E0D8]">
                  Stripe Elements (GBP £ · EUR €)
                </td>
                <td className="p-4 border-r border-[#E5E0D8]">
                  DHL Express Air Bridge
                </td>
                <td className="p-4 text-[#2E6B35] font-semibold">48–72 HOURS</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Direct B2B Application Form */}
      <section
        id="b2b-inquiry-console"
        className="bg-[#F3EFEA] text-[#111111] py-16 sm:py-24 border-t border-[#E5E0D8]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="border border-[#E5E0D8] bg-white p-6 sm:p-12">
            <div className="border-b border-[#E5E0D8] pb-6 mb-8">
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#E31E24] font-semibold block">
                DIRECT EXECUTIVE INQUIRY // WHOLESALE &amp; BRAND REPRESENTATION DESK
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#111111] mt-1">
                APPLY FOR CONTINENTAL REPRESENTATION
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4742] mt-2">
                Submissions route directly to our Lagos and Toronto B2B Wholesale Desk (and appear live in the <code className="font-mono font-bold">/admin</code> pipeline).
              </p>
            </div>

            {submittedRef ? (
              <div className="p-8 border border-[#111111] bg-[#FAF9F6] space-y-4">
                <span className="font-mono text-xs text-[#2E6B35] font-semibold uppercase block">
                  ✓ DOSSIER REGISTERED // REF: {submittedRef}
                </span>
                <h3 className="font-display text-2xl font-bold uppercase text-[#111111]">
                  YOUR BRAND REPRESENTATION APPLICATION IS IN REVIEW
                </h3>
                <p className="text-xs sm:text-sm text-[#4A4742] leading-relaxed">
                  Our Continental Partnerships Directorate in Victoria Island (Lagos) and King West (Toronto) has logged your dossier under reference{" "}
                  <strong>{submittedRef}</strong>. You can inspect or update its status immediately inside the{" "}
                  <a href="/admin" className="underline font-bold text-[#E31E24]">
                    /admin B2B Pipeline
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedRef(null)}
                  className="px-5 py-2.5 bg-[#111111] text-white font-mono text-xs uppercase cursor-pointer"
                >
                  SUBMIT ANOTHER INQUIRY
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-[#4A4742] font-semibold block mb-1.5">
                      FASHION HOUSE / BRAND NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="E.G. ATELIER VANCE MILANO"
                      className="w-full px-3.5 py-2.5 border border-[#E5E0D8] bg-[#FAF9F6] font-mono text-xs text-[#111111] outline-none focus:border-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-[#4A4742] font-semibold block mb-1.5">
                      HEADQUARTERS CITY &amp; COUNTRY *
                    </label>
                    <input
                      type="text"
                      required
                      value={hqCountry}
                      onChange={(e) => setHqCountry(e.target.value)}
                      placeholder="E.G. MILAN, ITALY // LONDON, UK"
                      className="w-full px-3.5 py-2.5 border border-[#E5E0D8] bg-[#FAF9F6] font-mono text-xs text-[#111111] outline-none focus:border-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-[#4A4742] font-semibold block mb-1.5">
                      EXECUTIVE CONTACT NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="FULL NAME"
                      className="w-full px-3.5 py-2.5 border border-[#E5E0D8] bg-[#FAF9F6] font-mono text-xs text-[#111111] outline-none focus:border-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-[#4A4742] font-semibold block mb-1.5">
                      TITLE / ROLE
                    </label>
                    <input
                      type="text"
                      value={contactRole}
                      onChange={(e) => setContactRole(e.target.value)}
                      placeholder="CREATIVE DIRECTOR / HEAD OF COMMERCIAL"
                      className="w-full px-3.5 py-2.5 border border-[#E5E0D8] bg-[#FAF9F6] font-mono text-xs text-[#111111] outline-none focus:border-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-[#4A4742] font-semibold block mb-1.5">
                      CORPORATE EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="DIRECTOR@BRAND.COM"
                      className="w-full px-3.5 py-2.5 border border-[#E5E0D8] bg-[#FAF9F6] font-mono text-xs text-[#111111] outline-none focus:border-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-[#4A4742] font-semibold block mb-1.5">
                      DIRECT PHONE / WHATSAPP
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 / +39 / +234 / +254 / +1"
                      className="w-full px-3.5 py-2.5 border border-[#E5E0D8] bg-[#FAF9F6] font-mono text-xs text-[#111111] outline-none focus:border-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-[#4A4742] font-semibold block mb-1.5">
                      BRAND WEBSITE / LOOKBOOK URL
                    </label>
                    <input
                      type="text"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="HTTPS://"
                      className="w-full px-3.5 py-2.5 border border-[#E5E0D8] bg-[#FAF9F6] font-mono text-xs text-[#111111] outline-none focus:border-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-[#4A4742] font-semibold block mb-1.5">
                      PROJECTED ANNUAL WHOLESALE VOLUME
                    </label>
                    <select
                      value={volumeTier}
                      onChange={(e) => setVolumeTier(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[#E5E0D8] bg-[#FAF9F6] font-mono text-xs text-[#111111] outline-none"
                    >
                      <option value="CAD $75,000 – $150,000 / YR">
                        CAD $75,000 – $150,000 / YR
                      </option>
                      <option value="CAD $150,000 – $500,000 / YR">
                        CAD $150,000 – $500,000 / YR
                      </option>
                      <option value="CAD $500,000 – $1,500,000+ / YR">
                        CAD $500,000 – $1,500,000+ / YR
                      </option>
                    </select>
                  </div>
                </div>

                {/* Target Distribution Regions */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#4A4742] font-semibold block mb-2">
                    TARGET DISTRIBUTION TERRITORIES
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "WEST_AFRICA",
                      "EAST_AFRICA",
                      "NORTH_AMERICA",
                      "EUROPE",
                      "UK",
                    ].map((reg) => {
                      const active = selectedRegions.includes(reg);
                      return (
                        <button
                          key={reg}
                          type="button"
                          onClick={() => toggleRegion(reg)}
                          className={`px-3.5 py-2 font-mono text-xs uppercase border cursor-pointer transition-colors ${
                            active
                              ? "border-[#111111] bg-[#111111] text-white font-bold"
                              : "border-[#E5E0D8] bg-[#FAF9F6] text-[#4A4742]"
                          }`}
                        >
                          {reg}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#4A4742] font-semibold block mb-1.5">
                    COLLECTION OVERVIEW &amp; DISTRIBUTION OBJECTIVES *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="DETAIL YOUR PRICE POINTS, SEASONAL SKU COUNT, FABRICATION, AND DESIRED MARKET ENTRY TIMELINE..."
                    className="w-full p-3.5 border border-[#E5E0D8] bg-[#FAF9F6] font-mono text-xs text-[#111111] outline-none focus:border-[#111111]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#111111] hover:bg-[#E31E24] text-white font-mono text-xs tracking-[0.2em] uppercase font-bold transition-colors cursor-pointer"
                >
                  TRANSMIT B2B REPRESENTATION DOSSIER →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
