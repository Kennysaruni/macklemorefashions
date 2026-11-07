"use client";

import React, { useState } from "react";
import { usePlatform } from "@/lib/platform-context";
import { StaggeredText } from "@/components/motion/MotionPrimitives";
import {
  TribalCornerWatermark,
  TribalSectionSeparator,
} from "@/components/vectors/TribalVectors";

const PARTNERSHIP_PILLARS = [
  {
    badge: "01 · Brand Representation",
    title: "Dedicated Digital & Showroom Presence",
    description:
      "We represent international and African fashion houses with dedicated brand pages on our platform, curated seasonal storytelling, and showroom presentation in Lagos.",
    highlights: [
      "Dedicated partner brand page (e.g., /brands/luca)",
      "Editorial campaign features and styling",
      "VIP client and boutique buyer introductions",
    ],
  },
  {
    badge: "02 · Regional Distribution",
    title: "Seamless Logistics & Warehousing",
    description:
      "With our Canadian corporate base in Toronto and operational headquarters in Lagos, we bridge international supply chains with reliable distribution across Africa.",
    highlights: [
      "Consolidated intake in Toronto, London & Lagos",
      "Regional fulfillment across Nigeria, Ghana & Kenya",
      "Reliable last-mile delivery to retail customers & boutiques",
    ],
  },
  {
    badge: "03 · Market Growth",
    title: "West & East African Market Access",
    description:
      "We help partner brands expand into high-growth African fashion capitals, supporting launch activations, local pricing, and long-term brand equity.",
    highlights: [
      "West Africa reach: Lagos, Abuja & Accra",
      "East Africa reach: Nairobi & regional hubs",
      "North America & UK diaspora reach",
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
  const [selectedRegions, setSelectedRegions] = useState<string[]>([
    "West Africa",
    "East Africa",
  ]);
  const [message, setMessage] = useState("");
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const toggleRegion = (reg: string) => {
    setSelectedRegions((prev) =>
      prev.includes(reg) ? prev.filter((r) => r !== reg) : [...prev, reg]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !contactName || !email) return;

    const record = submitB2BInquiry({
      channel: "BRAND_REPRESENTATION",
      brandOrCompanyName: brandName,
      contactName,
      contactRole: contactRole || "Brand Representative",
      email,
      phone: phone || "Not Provided",
      headquartersCountry: hqCountry || "International",
      websiteUrl: websiteUrl || "https://",
      targetRegions:
        selectedRegions.length > 0 ? selectedRegions : ["West Africa"],
      annualVolumeTier: "Partnership Inquiry",
      message:
        message ||
        "Interested in brand representation and distribution across African markets.",
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
    <div className="min-h-screen bg-[#FFFDF9] text-[#1F1A17]">
      {/* B2B Hero */}
      <section className="relative border-b border-[#EADFD0] bg-[#FAF5EE] px-4 sm:px-8 py-12 sm:py-16 overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.05} />
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#E31E24] block">
              Brand Partnerships &amp; Distribution
            </span>
            <StaggeredText
              text="Connecting Global & African Fashion Brands With Key Markets."
              as="h1"
              className="font-display text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.08] text-[#1F1A17]"
            />
            <p className="text-sm sm:text-base text-[#5C5147] max-w-2xl leading-relaxed">
              Macklemore Fashion partners with international and African fashion brands, such as LUCA, to support representation, retail distribution, and market growth across West Africa, East Africa, and international markets.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <a
              href="#partnership-inquiry"
              className="w-full py-3.5 px-6 rounded-md bg-[#1F1A17] hover:bg-[#E31E24] text-white text-center text-xs sm:text-sm font-medium transition-colors shadow-xs"
            >
              Start a Partnership Conversation →
            </a>
          </div>
        </div>
      </section>

      {/* 3 Pillars of Support */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PARTNERSHIP_PILLARS.map((pillar) => (
            <div
              key={pillar.badge}
              className="p-7 rounded-lg border border-[#EADFD0] bg-white flex flex-col justify-between gap-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#7A491D] block">
                  {pillar.badge}
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#1F1A17]">
                  {pillar.title}
                </h2>
                <p className="text-sm text-[#5C5147] leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <ul className="space-y-2 pt-4 border-t border-[#F2EAE0] text-xs text-[#1F1A17]">
                {pillar.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="text-[#D4860B] mt-0.5">●</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <TribalSectionSeparator label="Regional Coverage Overview" />

        {/* Simple, Scannable Regional Table */}
        <div className="rounded-lg border border-[#EADFD0] bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#EADFD0] bg-[#FAF5EE] text-[#7A491D] text-xs font-semibold">
                  <th className="p-4">Region</th>
                  <th className="p-4">Key Cities</th>
                  <th className="p-4">Services Provided</th>
                  <th className="p-4">Typical Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EAE0] text-[#1F1A17]">
                <tr>
                  <td className="p-4 font-semibold text-[#E31E24]">
                    West Africa (Lagos HQ)
                  </td>
                  <td className="p-4 text-[#5C5147]">
                    Lagos, Abuja, Accra
                  </td>
                  <td className="p-4 text-[#5C5147]">
                    Showroom Representation, Retail &amp; Regional Distribution
                  </td>
                  <td className="p-4 text-[#2E6B4E] font-medium">1–2 Business Days</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#E05C1A]">
                    East Africa
                  </td>
                  <td className="p-4 text-[#5C5147]">
                    Nairobi, Mombasa, Kigali
                  </td>
                  <td className="p-4 text-[#5C5147]">
                    Partner Distribution &amp; Direct-to-Consumer Fulfillment
                  </td>
                  <td className="p-4 text-[#2E6B4E] font-medium">1–3 Business Days</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#D4860B]">
                    North America (Canada HQ)
                  </td>
                  <td className="p-4 text-[#5C5147]">
                    Toronto, Montreal, New York
                  </td>
                  <td className="p-4 text-[#5C5147]">
                    Corporate Headquarters &amp; North American Retail
                  </td>
                  <td className="p-4 text-[#2E6B4E] font-medium">1–3 Business Days</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#1A7A6E]">
                    UK &amp; Europe
                  </td>
                  <td className="p-4 text-[#5C5147]">
                    London, Milan, Paris
                  </td>
                  <td className="p-4 text-[#5C5147]">
                    Partner Brand Sourcing &amp; International Shipping
                  </td>
                  <td className="p-4 text-[#2E6B4E] font-medium">2–4 Business Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Partnership Inquiry Form */}
      <section
        id="partnership-inquiry"
        className="bg-[#FAF5EE] py-14 sm:py-20 border-t border-[#EADFD0]"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <div className="rounded-lg border border-[#EADFD0] bg-white p-6 sm:p-10 shadow-xs">
            <div className="border-b border-[#F2EAE0] pb-5 mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7A491D] block">
                Partner With Macklemore Fashion
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1F1A17] mt-1">
                Brand Partnership &amp; Distribution Inquiry
              </h2>
              <p className="text-sm text-[#5C5147] mt-1.5">
                Share a few details about your brand and our partnerships team in Toronto and Lagos will be in touch.
              </p>
            </div>

            {submittedRef ? (
              <div className="p-6 rounded-lg border border-[#2E6B4E]/30 bg-[#FAF5EE] space-y-3">
                <span className="text-xs text-[#2E6B4E] font-semibold block">
                  ✓ Inquiry Received (Reference: {submittedRef})
                </span>
                <h3 className="font-display text-xl font-semibold text-[#1F1A17]">
                  Thank You for Reaching Out
                </h3>
                <p className="text-sm text-[#5C5147] leading-relaxed">
                  Our Brand Partnerships team in Lagos and Toronto has received your details and will respond within 1–2 business days.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedRef(null)}
                  className="px-5 py-2.5 rounded-md bg-[#1F1A17] text-white text-xs font-medium cursor-pointer hover:bg-[#E31E24] transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#5C5147] block mb-1.5">
                      Brand / Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. LUCA"
                      className="w-full px-3.5 py-2.5 rounded-md border border-[#E2D6C5] bg-[#FFFDF9] text-sm text-[#1F1A17] outline-none focus:border-[#7A491D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#5C5147] block mb-1.5">
                      City &amp; Country *
                    </label>
                    <input
                      type="text"
                      required
                      value={hqCountry}
                      onChange={(e) => setHqCountry(e.target.value)}
                      placeholder="e.g. Milan, Italy / Lagos, Nigeria"
                      className="w-full px-3.5 py-2.5 rounded-md border border-[#E2D6C5] bg-[#FFFDF9] text-sm text-[#1F1A17] outline-none focus:border-[#7A491D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#5C5147] block mb-1.5">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2.5 rounded-md border border-[#E2D6C5] bg-[#FFFDF9] text-sm text-[#1F1A17] outline-none focus:border-[#7A491D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#5C5147] block mb-1.5">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      value={contactRole}
                      onChange={(e) => setContactRole(e.target.value)}
                      placeholder="e.g. Founder / Commercial Director"
                      className="w-full px-3.5 py-2.5 rounded-md border border-[#E2D6C5] bg-[#FFFDF9] text-sm text-[#1F1A17] outline-none focus:border-[#7A491D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#5C5147] block mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@brand.com"
                      className="w-full px-3.5 py-2.5 rounded-md border border-[#E2D6C5] bg-[#FFFDF9] text-sm text-[#1F1A17] outline-none focus:border-[#7A491D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#5C5147] block mb-1.5">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 / +234 / +254 / +44"
                      className="w-full px-3.5 py-2.5 rounded-md border border-[#E2D6C5] bg-[#FFFDF9] text-sm text-[#1F1A17] outline-none focus:border-[#7A491D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#5C5147] block mb-1.5">
                    Website or Instagram URL
                  </label>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://"
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#E2D6C5] bg-[#FFFDF9] text-sm text-[#1F1A17] outline-none focus:border-[#7A491D]"
                  />
                </div>

                {/* Target Markets */}
                <div>
                  <label className="text-xs font-medium text-[#5C5147] block mb-2">
                    Markets of Interest
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "West Africa",
                      "East Africa",
                      "North America",
                      "UK & Europe",
                    ].map((reg) => {
                      const active = selectedRegions.includes(reg);
                      return (
                        <button
                          key={reg}
                          type="button"
                          onClick={() => toggleRegion(reg)}
                          className={`px-3.5 py-2 rounded-md text-xs font-medium border cursor-pointer transition-colors ${
                            active
                              ? "border-[#1F1A17] bg-[#1F1A17] text-white"
                              : "border-[#E2D6C5] bg-[#FAF5EE] text-[#5C5147] hover:border-[#7A491D]"
                          }`}
                        >
                          {reg}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#5C5147] block mb-1.5">
                    Tell Us About Your Brand &amp; Goals *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share a brief overview of your collections and how you would like to work with Macklemore Fashion..."
                    className="w-full p-3.5 rounded-md border border-[#E2D6C5] bg-[#FFFDF9] text-sm text-[#1F1A17] outline-none focus:border-[#7A491D]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-md bg-[#1F1A17] hover:bg-[#E31E24] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-xs"
                >
                  Submit Partnership Inquiry →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
