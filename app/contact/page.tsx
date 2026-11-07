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
    label: "01 // CUSTOMER CARE & CONCIERGE",
    deskTitle: "CLIENT CARE, SIZING & ORDER TRACKING",
    routingOffice: "LAGOS VI · NAIROBI 254 · TORONTO",
    sla: "< 4 HOURS RESPONSE",
    email: "concierge@macklemorefashions.com",
    description:
      "Personal sizing guidance, bespoke Aso Oke measurements, GIG / Wells Fargo / DHL waybill tracking, and priority allocation requests.",
  },
  {
    code: "WHOLESALE",
    label: "02 // WHOLESALE ORDERS",
    deskTitle: "GLOBAL SHOWROOM & MULTI-BRAND BUYING DESK",
    routingOffice: "TORONTO HUB B · LAGOS HUB A",
    sla: "< 24 HOURS RESPONSE",
    email: "wholesale@macklemorefashions.com",
    description:
      "Seasonal showroom appointments, MOQ line sheets, and wholesale allocation for luxury department stores and concept boutiques.",
  },
  {
    code: "BRAND_REPRESENTATION",
    label: "03 // BRAND REPRESENTATION",
    deskTitle: "AFRICAN & INTERNATIONAL DISTRIBUTION DIRECTORATE",
    routingOffice: "LAGOS HQ · NAIROBI · ACCRA",
    sla: "< 24 HOURS EXECUTIVE REVIEW",
    email: "partnerships@macklemorefashions.com",
    description:
      "For international and African fashion houses seeking turnkey distribution, bonded warehousing, and localized Paystack/M-Pesa checkout.",
  },
  {
    code: "PRESS",
    label: "04 // PRESS & EDITORIAL",
    deskTitle: "GLOBAL COMMUNICATIONS & ARCHIVE PULLS",
    routingOffice: "LONDON · TORONTO · LAGOS",
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
    "PRIVATE CLIENT / SINGLE ORDER"
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
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111]">
      {/* Header */}
      <section className="relative border-b border-[#E5E0D8] bg-white px-4 py-14 md:px-8 md:py-20 overflow-hidden">
        <TribalCornerWatermark
          position="top-right"
          className="text-[#7A491D]"
          opacity={0.05}
        />
        <div className="mx-auto max-w-[1440px]">
          <div className="font-mono text-[10px] tracking-[0.26em] text-[#7A491D] font-semibold uppercase mb-3">
            MULTI-CHANNEL INQUIRY ROUTING // SHOWROOMS &amp; CLIENT CARE
          </div>
          <StaggeredText
            text="CONCIERGE, SHOWROOMS & PARTNERSHIPS."
            as="h1"
            className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95] text-[#111111]"
          />
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#4A4742] leading-relaxed">
            Select your dedicated department below. All inquiries are routed directly to our Lagos, Nairobi (254), or Toronto desks.
          </p>
        </div>
      </section>

      {/* Segregated Routing Selector + Form */}
      <section className="mx-auto max-w-[1440px] px-4 py-14 md:px-8">
        {/* 4-Channel Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#E5E0D8] mb-12 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E0D8] bg-white">
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
                className={`p-6 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#111111] text-white"
                    : "bg-white text-[#111111] hover:bg-[#FAF9F6]"
                }`}
              >
                <div
                  className={`font-mono text-[10px] tracking-[0.2em] uppercase mb-2 font-semibold ${
                    isSelected ? "text-[#E5E0D8]" : "text-[#7A491D]"
                  }`}
                >
                  {ch.label}
                </div>
                <div className="font-display text-lg font-bold uppercase">
                  {ch.deskTitle}
                </div>
                <div
                  className={`mt-3 font-mono text-[10px] tracking-[0.16em] uppercase ${
                    isSelected ? "text-white/80" : "text-[#6E6A63]"
                  }`}
                >
                  SLA: {ch.sla}
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 border border-[#E5E0D8] bg-white">
          {/* Left Info Column */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#E5E0D8] p-8 md:p-10 bg-[#FAF9F6] flex flex-col justify-between">
            <div className="space-y-6">
              <div className="font-mono text-[10px] tracking-[0.22em] text-[#E31E24] font-semibold uppercase">
                ACTIVE ROUTING CHANNEL: {currentChannelMeta.code}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase leading-tight text-[#111111]">
                {currentChannelMeta.deskTitle}
              </h2>
              <p className="text-sm text-[#4A4742] leading-relaxed">
                {currentChannelMeta.description}
              </p>

              <div className="border-t border-[#E5E0D8] pt-6 space-y-3 font-mono text-[11px] tracking-[0.16em] uppercase">
                <div className="flex justify-between">
                  <span className="text-[#6E6A63]">ROUTING HUB:</span>
                  <span className="text-[#111111] font-semibold">
                    {currentChannelMeta.routingOffice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6A63]">DIRECT EMAIL:</span>
                  <span className="text-[#7A491D] font-semibold">
                    {currentChannelMeta.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6A63]">TARGET SLA:</span>
                  <span className="text-[#2E6B35] font-semibold">
                    {currentChannelMeta.sla}
                  </span>
                </div>
              </div>
            </div>

            {/* Physical Headquarters & Store Directory */}
            <div className="mt-12 border-t border-[#E5E0D8] pt-8 space-y-5">
              <div className="font-mono text-[10px] tracking-[0.22em] text-[#7A491D] font-semibold uppercase">
                STORE LOCATIONS &amp; DISTRIBUTION HUBS
              </div>
              <div className="grid grid-cols-1 gap-4 font-mono text-[11px] tracking-[0.14em] uppercase">
                <div className="border border-[#E5E0D8] p-4 bg-white">
                  <div className="text-[#E31E24] font-semibold mb-1">
                    HUB A // LAGOS FLAGSHIP HQ
                  </div>
                  <div className="text-[#111111] font-bold">
                    VICTORIA ISLAND, LAGOS
                  </div>
                  <div className="text-[#6E6A63] mt-1 text-[10px]">
                    14 Adeola Odeku Corridor, VI, Lagos, Nigeria
                  </div>
                </div>
                <div className="border border-[#E5E0D8] p-4 bg-white">
                  <div className="text-[#7A491D] font-semibold mb-1">
                    EAST AFRICA 254 // NAIROBI SHOWROOM
                  </div>
                  <div className="text-[#111111] font-bold">
                    WESTLANDS &amp; COLLEGE HOUSE CORRIDOR
                  </div>
                  <div className="text-[#6E6A63] mt-1 text-[10px]">
                    Nairobi, Kenya · Express M-Pesa &amp; Fargo Dispatch
                  </div>
                </div>
                <div className="border border-[#E5E0D8] p-4 bg-white">
                  <div className="text-[#111111] font-semibold mb-1">
                    HUB B // TORONTO CORPORATE HQ
                  </div>
                  <div className="text-[#111111] font-bold">
                    KING WEST FASHION DISTRICT
                  </div>
                  <div className="text-[#6E6A63] mt-1 text-[10px]">
                    620 King St W, Toronto, ON, Canada
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-8 md:p-12 bg-white">
            {submittedRef ? (
              <div className="border border-[#111111] bg-[#FAF9F6] p-8 space-y-4">
                <div className="font-mono text-[11px] tracking-[0.22em] text-[#2E6B35] font-semibold uppercase">
                  ✓ TRANSMISSION CONFIRMED // LOGGED TO ADMIN PIPELINE
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-[#111111]">
                  DOSSIER REFERENCE: {submittedRef}
                </h3>
                <p className="text-sm text-[#4A4742] leading-relaxed">
                  Your message has been routed to the{" "}
                  <strong>{currentChannelMeta.deskTitle}</strong> and is now visible in the{" "}
                  <code className="font-mono text-[#E31E24] font-bold">/admin</code> B2B &amp; Concierge Desk.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedRef(null);
                    setMessage("");
                  }}
                  className="bg-[#111111] px-5 py-2.5 font-mono text-[10px] tracking-[0.2em] text-white uppercase hover:bg-[#E31E24] cursor-pointer"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.2em] text-[#4A4742] font-semibold uppercase mb-2">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g., Amara Nwosu"
                      className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-4 py-3 font-mono text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.2em] text-[#4A4742] font-semibold uppercase mb-2">
                      ORGANIZATION / BRAND / ORDER REF
                    </label>
                    <input
                      type="text"
                      value={brandOrCompanyName}
                      onChange={(e) => setBrandOrCompanyName(e.target.value)}
                      placeholder="e.g., Maison Kora or Order #MKM-2026"
                      className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-4 py-3 font-mono text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.2em] text-[#4A4742] font-semibold uppercase mb-2">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@domain.com"
                      className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-4 py-3 font-mono text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.2em] text-[#4A4742] font-semibold uppercase mb-2">
                      PHONE / WHATSAPP *
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 / +234 / +1 / +44"
                      className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-4 py-3 font-mono text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.2em] text-[#4A4742] font-semibold uppercase mb-2">
                      ROLE / TITLE
                    </label>
                    <input
                      type="text"
                      value={contactRole}
                      onChange={(e) => setContactRole(e.target.value)}
                      placeholder="Client / Buyer / Stylist"
                      className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-4 py-3 font-mono text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.2em] text-[#4A4742] font-semibold uppercase mb-2">
                      COUNTRY / REGION
                    </label>
                    <select
                      value={headquartersCountry}
                      onChange={(e) => setHeadquartersCountry(e.target.value)}
                      className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-4 py-3 font-mono text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                    >
                      <option value="Nigeria">Nigeria (Lagos / Abuja)</option>
                      <option value="Kenya">Kenya (Nairobi / Mombasa)</option>
                      <option value="Canada">Canada (Toronto / Montreal)</option>
                      <option value="Ghana">Ghana (Accra)</option>
                      <option value="United Kingdom">United Kingdom (London)</option>
                      <option value="United States">United States (New York / LA)</option>
                      <option value="Italy / France">Europe (Milan / Paris)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.2em] text-[#4A4742] font-semibold uppercase mb-2">
                      INQUIRY SCOPE
                    </label>
                    <select
                      value={annualVolumeTier}
                      onChange={(e) => setAnnualVolumeTier(e.target.value)}
                      className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-4 py-3 font-mono text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                    >
                      <option value="PRIVATE CLIENT / SINGLE ORDER">
                        PRIVATE CLIENT / SINGLE ORDER
                      </option>
                      <option value="CAD $50K – $250K / SEASON">
                        CAD $50K – $250K / SEASON
                      </option>
                      <option value="CAD $250K – $1M / SEASON">
                        CAD $250K – $1M / SEASON
                      </option>
                      <option value="CAD $1M+ CONTINENTAL">
                        CAD $1M+ CONTINENTAL ROLLOUT
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-[#4A4742] font-semibold uppercase mb-2">
                    WEBSITE OR PORTFOLIO URL (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://"
                    className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-4 py-3 font-mono text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-[#4A4742] font-semibold uppercase mb-2">
                    MESSAGE &amp; REQUIREMENTS *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can our Concierge, Showroom, or Partnerships team assist you?"
                    className="w-full border border-[#E5E0D8] bg-[#FAF9F6] p-4 font-mono text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#111111] py-4 font-mono text-xs font-semibold tracking-[0.22em] text-white uppercase hover:bg-[#E31E24] transition-colors cursor-pointer"
                >
                  SEND TO {currentChannelMeta.code} DESK →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
