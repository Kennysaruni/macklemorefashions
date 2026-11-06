"use client";

import React, { useState } from "react";
import { usePlatform } from "@/lib/platform-context";
import { InquiryChannel } from "@/lib/store-data";
import { StaggeredText } from "@/components/motion/MotionPrimitives";
import { TribalCornerWatermark } from "@/components/vectors/TribalVectors";

const CHANNELS: {
  code: InquiryChannel;
  label: string;
  deskTitle: string;
  routingOffice: string;
  sla: string;
  email: string;
  description: string;
}[] = [
  {
    code: "CONCIERGE",
    label: "01 // CUSTOMER CONCIERGE",
    deskTitle: "PRIVATE CLIENT & ORDER CONCIERGE DESK",
    routingOffice: "LAGOS VICTORIA ISLAND // TORONTO KING WEST",
    sla: "< 4 HOURS RESPONSE",
    email: "concierge@macklemorefashions.com",
    description:
      "Private sizing consultations, bespoke Aso Oke measurements, GIG / Wells Fargo / DHL waybill tracking, and priority allocation requests.",
  },
  {
    code: "WHOLESALE",
    label: "02 // WHOLESALE ORDERS",
    deskTitle: "GLOBAL SHOWROOM & MULTI-BRAND BUYING DESK",
    routingOffice: "TORONTO HUB B // LAGOS HUB A",
    sla: "< 24 HOURS RESPONSE",
    email: "wholesale@macklemorefashions.com",
    description:
      "Seasonal showroom appointments, MOQ line sheets, and wholesale allocation for luxury department stores and concept boutiques.",
  },
  {
    code: "BRAND_REPRESENTATION",
    label: "03 // BRAND REPRESENTATION",
    deskTitle: "AFRICAN & INTERNATIONAL DISTRIBUTION DIRECTORATE",
    routingOffice: "LAGOS HQ // NAIROBI // ACCRA",
    sla: "< 24 HOURS EXECUTIVE REVIEW",
    email: "partnerships@macklemorefashions.com",
    description:
      "For international and African fashion houses seeking turnkey distribution, bonded warehousing, and localized Paystack/M-Pesa checkout.",
  },
  {
    code: "PRESS",
    label: "04 // PRESS & EDITORIAL",
    deskTitle: "GLOBAL COMMUNICATIONS & ARCHIVE PULLS",
    routingOffice: "LONDON // TORONTO // LAGOS",
    sla: "< 12 HOURS RESPONSE",
    email: "press@macklemorefashions.com",
    description:
      "Editorial sample loans, runway accreditation, executive interviews, and cultural features.",
  },
];

export default function ContactPage() {
  const { submitB2BInquiry } = usePlatform();
  const [activeChannel, setActiveChannel] =
    useState<InquiryChannel>("CONCIERGE");
  const [brandOrCompanyName, setBrandOrCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [headquartersCountry, setHeadquartersCountry] = useState("Nigeria");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [annualVolumeTier, setAnnualVolumeTier] = useState(
    "CAD $50K – $250K / SEASON"
  );
  const [message, setMessage] = useState("");
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const currentChannelMeta =
    CHANNELS.find((c) => c.code === activeChannel) || CHANNELS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record = submitB2BInquiry({
      channel: activeChannel,
      brandOrCompanyName:
        brandOrCompanyName.trim() || "Private Client / Individual",
      contactName: contactName.trim(),
      contactRole: contactRole.trim() || activeChannel,
      email: email.trim(),
      phone: phone.trim(),
      headquartersCountry,
      websiteUrl: websiteUrl.trim() || "https://macklemorefashions.com",
      targetRegions: ["WEST_AFRICA", "EAST_AFRICA", "NORTH_AMERICA"],
      annualVolumeTier,
      message: message.trim(),
    });
    setSubmittedRef(record.referenceCode);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F6F5F1]">
      {/* Header */}
      <section className="relative border-b border-stone-800 px-4 py-16 md:px-8 md:py-24 overflow-hidden">
        <TribalCornerWatermark
          position="top-right"
          className="text-[#D4860B]"
          opacity={0.07}
        />
        <div className="mx-auto max-w-[1600px]">
          <div className="font-mono text-[10px] tracking-[0.28em] text-[#D4860B] uppercase mb-3">
            [ MULTI-CHANNEL INQUIRY ROUTING // DIRECT COMMUNICATIONS ]
          </div>
          <StaggeredText
            text="GLOBAL COMMAND & CONCIERGE DESKS."
            as="h1"
            className="font-display text-4xl sm:text-6xl font-bold tracking-[-0.03em] uppercase leading-[0.95]"
          />
          <p className="mt-4 max-w-2xl text-sm text-stone-400 leading-relaxed">
            Select your dedicated routing channel below. All inquiries are logged into the Macklemore Executive Console and dispatched directly to our Lagos, Toronto, or Nairobi directorates.
          </p>
        </div>
      </section>

      {/* Segregated Routing Selector + Form */}
      <section className="mx-auto max-w-[1600px] px-4 py-14 md:px-8">
        {/* 4-Channel Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-stone-800 mb-12 divide-y sm:divide-y-0 sm:divide-x divide-stone-800">
          {CHANNELS.map((ch) => {
            const isSelected = ch.code === activeChannel;
            return (
              <button
                key={ch.code}
                type="button"
                onClick={() => {
                  setActiveChannel(ch.code);
                  setSubmittedRef(null);
                }}
                className={`p-6 text-left transition-colors ${
                  isSelected
                    ? "bg-[#E31E24] text-white"
                    : "bg-[#0E0E10] text-stone-300 hover:bg-stone-900"
                }`}
              >
                <div
                  className={`font-mono text-[10px] tracking-[0.22em] uppercase mb-2 ${
                    isSelected ? "text-white/90" : "text-[#D4860B]"
                  }`}
                >
                  {ch.label}
                </div>
                <div className="font-display text-lg font-bold uppercase">
                  {ch.deskTitle}
                </div>
                <div
                  className={`mt-3 font-mono text-[10px] tracking-[0.16em] uppercase ${
                    isSelected ? "text-white/80" : "text-stone-500"
                  }`}
                >
                  [ SLA: {ch.sla} ]
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 border border-stone-800">
          {/* Left Info Column */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-stone-800 p-8 md:p-10 bg-[#0E0E10] flex flex-col justify-between">
            <div className="space-y-6">
              <div className="font-mono text-[10px] tracking-[0.24em] text-[#D4860B] uppercase">
                [ ACTIVE ROUTING CHANNEL: {currentChannelMeta.code} ]
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase leading-tight">
                {currentChannelMeta.deskTitle}
              </h2>
              <p className="text-sm text-stone-400 leading-relaxed">
                {currentChannelMeta.description}
              </p>

              <div className="border-t border-stone-800 pt-6 space-y-3 font-mono text-[11px] tracking-[0.16em] uppercase">
                <div className="flex justify-between">
                  <span className="text-stone-500">ROUTING HUB:</span>
                  <span className="text-[#F6F5F1]">
                    {currentChannelMeta.routingOffice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">DIRECT DISPATCH:</span>
                  <span className="text-[#D4860B]">
                    {currentChannelMeta.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">TARGET SLA:</span>
                  <span className="text-emerald-400">
                    {currentChannelMeta.sla}
                  </span>
                </div>
              </div>
            </div>

            {/* Physical Headquarters Directory */}
            <div className="mt-12 border-t border-stone-800 pt-8 space-y-6">
              <div className="font-mono text-[10px] tracking-[0.24em] text-stone-400 uppercase">
                [ PHYSICAL HEADQUARTERS & LOGISTICS NODES ]
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-[11px] tracking-[0.14em] uppercase">
                <div className="border border-stone-800 p-4 bg-[#0B0B0C]">
                  <div className="text-[#D4860B] mb-1">
                    [ HUB A // LAGOS HQ ]
                  </div>
                  <div className="text-[#F6F5F1] font-semibold">
                    VICTORIA ISLAND, LAGOS
                  </div>
                  <div className="text-stone-400 mt-1 text-[10px]">
                    14 Adeola Odeku Corridor, VI, Lagos, Nigeria
                  </div>
                </div>
                <div className="border border-stone-800 p-4 bg-[#0B0B0C]">
                  <div className="text-[#E31E24] mb-1">
                    [ HUB B // TORONTO HQ ]
                  </div>
                  <div className="text-[#F6F5F1] font-semibold">
                    KING WEST DISTRICT, TORONTO
                  </div>
                  <div className="text-stone-400 mt-1 text-[10px]">
                    620 King St W, Toronto, ON, Canada
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-8 md:p-12 bg-[#0B0B0C]">
            {submittedRef ? (
              <div className="border border-[#D4860B] bg-[#14110B] p-8 space-y-4">
                <div className="font-mono text-[11px] tracking-[0.24em] text-[#D4860B] uppercase">
                  [ TRANSMISSION CONFIRMED // LOGGED TO ADMIN PIPELINE ]
                </div>
                <h3 className="font-display text-2xl font-bold uppercase">
                  DOSSIER REFERENCE: {submittedRef}
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed">
                  Your transmission has been routed to the{" "}
                  <strong>{currentChannelMeta.deskTitle}</strong> and is now visible in the{" "}
                  <code className="font-mono text-[#D4860B]">/admin</code> B2B & Concierge Desk.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedRef(null);
                    setMessage("");
                  }}
                  className="border border-stone-700 px-5 py-2.5 font-mono text-[10px] tracking-[0.2em] text-[#F6F5F1] uppercase hover:border-[#D4860B]"
                >
                  SEND ANOTHER TRANSMISSION
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-2">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g., Amara Nwosu"
                      className="w-full border border-stone-700 bg-[#111114] px-4 py-3 font-mono text-xs text-[#F6F5F1] focus:border-[#D4860B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-2">
                      ORGANIZATION / BRAND / CLIENT REF
                    </label>
                    <input
                      type="text"
                      value={brandOrCompanyName}
                      onChange={(e) => setBrandOrCompanyName(e.target.value)}
                      placeholder="e.g., Maison Kora or Order #MKM-2026"
                      className="w-full border border-stone-700 bg-[#111114] px-4 py-3 font-mono text-xs text-[#F6F5F1] focus:border-[#D4860B] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-2">
                      CORPORATE OR PRIVATE EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@domain.com"
                      className="w-full border border-stone-700 bg-[#111114] px-4 py-3 font-mono text-xs text-[#F6F5F1] focus:border-[#D4860B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-2">
                      DIRECT TELEPHONE / WHATSAPP *
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 / +254 / +1 / +44"
                      className="w-full border border-stone-700 bg-[#111114] px-4 py-3 font-mono text-xs text-[#F6F5F1] focus:border-[#D4860B] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-2">
                      ROLE / TITLE
                    </label>
                    <input
                      type="text"
                      value={contactRole}
                      onChange={(e) => setContactRole(e.target.value)}
                      placeholder="Creative Director / Buyer / Patron"
                      className="w-full border border-stone-700 bg-[#111114] px-4 py-3 font-mono text-xs text-[#F6F5F1] focus:border-[#D4860B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-2">
                      ORIGIN MARKET
                    </label>
                    <select
                      value={headquartersCountry}
                      onChange={(e) => setHeadquartersCountry(e.target.value)}
                      className="w-full border border-stone-700 bg-[#111114] px-4 py-3 font-mono text-xs text-[#F6F5F1] focus:border-[#D4860B] focus:outline-none"
                    >
                      <option value="Nigeria">Nigeria (Lagos / Abuja)</option>
                      <option value="Canada">Canada (Toronto / Montreal)</option>
                      <option value="Kenya">Kenya (Nairobi)</option>
                      <option value="Ghana">Ghana (Accra)</option>
                      <option value="United Kingdom">United Kingdom (London)</option>
                      <option value="United States">United States (New York / LA)</option>
                      <option value="Italy / France">Europe (Milan / Paris)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-2">
                      VOLUME / ALLOCATION TIER
                    </label>
                    <select
                      value={annualVolumeTier}
                      onChange={(e) => setAnnualVolumeTier(e.target.value)}
                      className="w-full border border-stone-700 bg-[#111114] px-4 py-3 font-mono text-xs text-[#F6F5F1] focus:border-[#D4860B] focus:outline-none"
                    >
                      <option value="PRIVATE CLIENT BESPOKE">PRIVATE CLIENT / SINGLE ORDER</option>
                      <option value="CAD $50K – $250K / SEASON">CAD $50K – $250K / SEASON</option>
                      <option value="CAD $250K – $1M / SEASON">CAD $250K – $1M / SEASON</option>
                      <option value="CAD $1M+ CONTINENTAL">CAD $1M+ CONTINENTAL ROLLOUT</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-2">
                    WEBSITE OR PORTFOLIO URL (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://"
                    className="w-full border border-stone-700 bg-[#111114] px-4 py-3 font-mono text-xs text-[#F6F5F1] focus:border-[#D4860B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-2">
                    DISPATCH BRIEF & REQUIREMENTS *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Detail your inquiry, target territories (West Africa, East Africa, North America, Europe), or order reference..."
                    className="w-full border border-stone-700 bg-[#111114] p-4 font-mono text-xs text-[#F6F5F1] focus:border-[#D4860B] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#E31E24] py-4 font-mono text-xs font-semibold tracking-[0.24em] text-white uppercase hover:bg-[#D4860B] hover:text-black transition-colors"
                >
                  TRANSMIT TO {currentChannelMeta.code} DESK →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

