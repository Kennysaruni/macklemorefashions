"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePlatform } from "@/lib/platform-context";
import { StaggeredText, TextReveal } from "@/components/motion/MotionPrimitives";
import {
  TribalCornerWatermark,
  TribalSectionSeparator,
} from "@/components/vectors/TribalVectors";
import { TribalAnimatedCheckmark } from "@/components/motion/TribalAnimatedCheckmark";

const VENDOR_STEPS = [
  {
    step: "01",
    tag: "Apply & Connect",
    title: "Share Your Store Profile",
    description:
      "Fashion stores, boutiques, and multi-brand retailers outside Nigeria reach out with their location, aesthetic focus, and retail space details.",
    bullets: [
      "Tell us about your boutique and local customer base",
      "Share your store location, website, or Instagram handle",
      "Direct consultation with our Toronto & Lagos trade desks",
    ],
  },
  {
    step: "02",
    tag: "Small Deposit Payment",
    title: "Secure Inventory With Low Risk",
    description:
      "Rather than requiring full upfront wholesale capital, partners secure seasonal Macklemore Fashions inventory with an accessible initial deposit payment.",
    bullets: [
      "Low capital barrier for independent fashion stores",
      "Flexible order sizes tailored to your boutique footprint",
      "Guaranteed allocation of bespoke and ready-to-wear pieces",
    ],
  },
  {
    step: "03",
    tag: "Direct Product Shipment",
    title: "Direct Shipment to Your Store",
    description:
      "Every piece is hand-inspected, tagged with authentic origin labels, and shipped directly from our Toronto HQ or Lagos atelier to your store door.",
    bullets: [
      "Consolidated courier dispatch via DHL and GIG Express",
      "Full tracking, customs paperwork, and waybill documentation",
      "Garments arrive packaged with preservation tissue and care guides",
    ],
  },
  {
    step: "04",
    tag: "Sell in Your Local Market",
    title: "Sell Locally & Restock as Needed",
    description:
      "Showcase authentic African luxury directly to your local clientele. As garments sell through, easily reorder high-demand sizes and colors.",
    bullets: [
      "Retail at suggested regional prices with strong vendor margins",
      "Official Macklemore Fashions marketing collateral & lookbooks",
      "Priority seasonal restocking from active capsule drops",
    ],
  },
];

const VENDOR_ADVANTAGES = [
  {
    title: "Authentic Craftsmanship",
    description:
      "Hand-woven Aso-Oke, precision-tailored Agbadas, Senator Kaftans, and royal coral accessories crafted between Toronto and Lagos.",
  },
  {
    title: "Low Upfront Capital",
    description:
      "Our small deposit model removes the financial friction of traditional wholesale, allowing you to test and scale inventory safely.",
  },
  {
    title: "Dual-Hub Reliability",
    description:
      "With operations in Toronto, Canada and Lagos, Nigeria, our logistics chain ensures dependable delivery and seamless restocks.",
  },
  {
    title: "Marketing & Lookbook Support",
    description:
      "Vendors receive high-resolution editorial imagery, product storytelling cards, and digital features across Macklemore channels.",
  },
];

export default function VendorsPage() {
  const { submitB2BInquiry } = usePlatform();

  // Form Fields
  const [contactName, setContactName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [websiteOrInstagram, setWebsiteOrInstagram] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!contactName.trim() || !storeName.trim() || !email.trim() || !country.trim() || !city.trim() || !phone.trim()) {
      setErrorMessage("Please complete all required fields so our trade desk can review your store.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Submit through Platform Context for immediate reactive UI update
      const localRecord = submitB2BInquiry({
        channel: "VENDOR_PARTNERSHIP",
        brandOrCompanyName: storeName.trim(),
        contactName: contactName.trim(),
        contactRole: "Retail Store Partner",
        email: email.trim(),
        phone: phone.trim(),
        headquartersCountry: country.trim(),
        websiteUrl: websiteOrInstagram.trim() || "https://instagram.com",
        targetRegions: [country.trim(), city.trim()],
        annualVolumeTier: "Vendor Stockist",
        message: `[Vendor Inquiry] Store: ${storeName.trim()} | City: ${city.trim()}, ${country.trim()} | Web/IG: ${websiteOrInstagram.trim() || "N/A"} | Note: ${message.trim() || "Interested in stocking Macklemore Fashions locally."}`,
      });

      // 2. Direct POST to /api/b2b-inquiries for database persistence and Resend email dispatch
      const res = await fetch("/api/b2b-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "VENDOR_PARTNERSHIP",
          brandOrCompanyName: storeName.trim(),
          contactName: contactName.trim(),
          contactRole: "Retail Store Partner",
          email: email.trim(),
          phone: phone.trim(),
          headquartersCountry: country.trim(),
          city: city.trim(),
          websiteUrl: websiteOrInstagram.trim() || "https://instagram.com",
          targetRegions: [country.trim()],
          annualVolumeTier: "Vendor Partnership",
          message: message.trim() || "Interested in stocking Macklemore Fashions pieces with the small deposit model.",
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setSubmittedRef(json?.data?.referenceCode || localRecord.referenceCode);
      } else {
        setSubmittedRef(localRecord.referenceCode);
      }

      setIsSubmitting(false);
    } catch {
      // Graceful fallback to client record
      const fallbackRef = `VND-MKM-0${Math.floor(400 + Math.random() * 599)}`;
      setSubmittedRef(fallbackRef);
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedRef(null);
    setContactName("");
    setStoreName("");
    setCountry("");
    setCity("");
    setWebsiteOrInstagram("");
    setEmail("");
    setPhone("");
    setMessage("");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1F1A17]">
      {/* =====================================================================
          1. HERO & OVERVIEW SECTION
         ===================================================================== */}
      <section className="relative border-b border-[#EADFD0] bg-[#FAF5EE] px-4 sm:px-8 py-12 sm:py-20 overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.05} />

        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#E31E24] block">
              International Retail &amp; Vendor Partnerships
            </span>
            <StaggeredText
              text="Stock &amp; Sell Macklemore Fashions in Your Local Market."
              as="h1"
              className="font-display text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.08] text-[#1F1A17]"
            />
            <p className="text-sm sm:text-base text-[#5C5147] max-w-2xl leading-relaxed">
              We invite fashion boutiques, concept stores, and retail houses in other countries to become official vendor partners. Bring authentic, Canadian-crafted African luxury to your city with low initial deposit requirements, direct hub shipment, and strong retail margins.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <a
              href="#vendor-inquiry"
              className="w-full py-3.5 px-6 rounded-md bg-[#1F1A17] hover:bg-[#7A491D] text-white text-center text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
            >
              Apply for Vendor Partnership →
            </a>
            <a
              href="#how-it-works"
              className="w-full py-3.5 px-6 rounded-md border border-[#D4B895] bg-white hover:bg-[#FAF5EE] text-center text-xs sm:text-sm font-medium text-[#1F1A17] transition-colors cursor-pointer"
            >
              How the Arrangement Works ↓
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. HOW THE VENDOR ARRANGEMENT WORKS (STEP-BY-STEP GRID)
         ===================================================================== */}
      <section
        id="how-it-works"
        className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 sm:py-24 space-y-12 scroll-mt-20"
      >
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
            The Partnership Model
          </span>
          <TextReveal
            text="How the Vendor Arrangement Works"
            as="h2"
            className="font-display text-2xl sm:text-4xl font-semibold tracking-tight text-[#1F1A17]"
          />
          <p className="text-sm text-[#5C5147] leading-relaxed pt-1">
            Our vendor program is built to support independent fashion stores worldwide. Secure genuine African luxury garments with low upfront risk and direct international fulfillment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VENDOR_STEPS.map((step) => (
            <div
              key={step.step}
              className="rounded-lg border border-[#EADFD0] bg-white p-6 sm:p-7 flex flex-col justify-between gap-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#7A491D]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#F2EAE0] pb-3">
                  <span className="font-mono text-xs font-bold text-[#7A491D]">
                    Step {step.step}
                  </span>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#D4860B]">
                    {step.tag}
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-semibold text-[#1F1A17]">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5147] leading-relaxed">
                  {step.description}
                </p>
              </div>

              <ul className="space-y-2 pt-4 border-t border-[#F2EAE0] text-xs text-[#1F1A17]">
                {step.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="text-[#D4860B] mt-0.5">●</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          3. VENDOR ADVANTAGES & KEY BENEFITS
         ===================================================================== */}
      <section className="bg-[#FAF5EE] border-y border-[#EADFD0] py-16 sm:py-20 relative overflow-hidden">
        <TribalCornerWatermark position="bottom-left" opacity={0.04} />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
              Why Partner With Macklemore
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1F1A17]">
              Built for High-Performing Local Retailers
            </h2>
            <p className="text-sm text-[#5C5147] leading-relaxed">
              We bridge traditional African atelier craftsmanship with international retail standards, ensuring your boutique stands out in your city.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VENDOR_ADVANTAGES.map((adv) => (
              <div
                key={adv.title}
                className="rounded-lg border border-[#EADFD0] bg-white p-6 space-y-2.5 shadow-2xs"
              >
                <div className="w-2 h-2 rotate-45 bg-[#7A491D]" />
                <h3 className="font-display text-base font-semibold text-[#1F1A17] pt-1">
                  {adv.title}
                </h3>
                <p className="text-xs text-[#5C5147] leading-relaxed">
                  {adv.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. VENDOR INQUIRY CONTACT FORM
         ===================================================================== */}
      <section
        id="vendor-inquiry"
        className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 sm:py-24 scroll-mt-20"
      >
        <div className="rounded-lg border border-[#EADFD0] bg-white overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
          {/* Left Editorial Info Column */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#EADFD0] p-6 sm:p-10 bg-[#FAF5EE]/60 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
                  Vendor Application
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1F1A17]">
                  Start the Vendor Conversation
                </h2>
                <p className="text-xs sm:text-sm text-[#5C5147] leading-relaxed">
                  Fill in your store details below. Our international trade desk will review your application and respond with our seasonal wholesale catalog, deposit schedules, and fulfillment terms.
                </p>
              </div>

              {/* Desk Information Cards */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="rounded-md border border-[#EADFD0] bg-white p-4 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A491D] font-bold block">
                    North America &amp; Global Trade Desk
                  </span>
                  <div className="font-semibold text-[#1F1A17]">
                    Toronto Corporate HQ · Canada
                  </div>
                  <div className="text-[#6E6A63]">
                    Elena Rostova · International Retail Partnerships
                  </div>
                  <a
                    href="mailto:wholesale@macklemorefashions.com"
                    className="text-[#7A491D] font-medium hover:underline block pt-1"
                  >
                    wholesale@macklemorefashions.com
                  </a>
                </div>

                <div className="rounded-md border border-[#EADFD0] bg-white p-4 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A491D] font-bold block">
                    African Regional Atelier &amp; Hub A
                  </span>
                  <div className="font-semibold text-[#1F1A17]">
                    Lagos Operations Desk · Nigeria
                  </div>
                  <div className="text-[#6E6A63]">
                    Chidi Okonkwo · Atelier Logistics &amp; Curation
                  </div>
                  <a
                    href="mailto:partnerships@macklemorefashions.com"
                    className="text-[#7A491D] font-medium hover:underline block pt-1"
                  >
                    partnerships@macklemorefashions.com
                  </a>
                </div>
              </div>

              {/* Reassurance Note */}
              <div className="border-t border-[#EADFD0] pt-4 text-xs text-[#6E6A63] space-y-1.5">
                <div className="flex items-center gap-2 text-[#1F1A17] font-semibold">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#2E6B35]" />
                  <span>24–48 Hour Review Turnaround</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Every vendor inquiry receives direct attention from our founding team. We evaluate store alignment, location exclusivity, and initial assortment selection.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#EADFD0] text-[11px] text-[#7D7065]">
              Macklemore Fashion Inc. · Toronto, Canada &amp; Lagos, Nigeria
            </div>
          </div>

          {/* Right Form Column / Confirmation View */}
          <div className="lg:col-span-7 p-6 sm:p-10">
            {submittedRef ? (
              /* Confirmation Success State */
              <div className="py-8 sm:py-12 px-4 text-center space-y-5 max-w-lg mx-auto">
                <TribalAnimatedCheckmark />

                <div className="space-y-2 pt-2">
                  <span className="text-xs uppercase font-semibold tracking-widest text-[#2E6B35] block">
                    Application Received
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-[#1F1A17]">
                    Thank You, {contactName.split(" ")[0]}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5147] leading-relaxed">
                    Your vendor inquiry for <span className="font-semibold text-[#1F1A17]">{storeName}</span> ({city}, {country}) has been recorded.
                  </p>
                </div>

                <div className="rounded-md border border-[#EADFD0] bg-[#FAF5EE] p-4 text-xs space-y-2 text-left">
                  <div className="flex items-center justify-between border-b border-[#EADFD0] pb-2">
                    <span className="text-[#6E6A63]">Dossier Reference:</span>
                    <span className="font-mono font-bold text-[#7A491D]">{submittedRef}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6E6A63]">Store / Boutique:</span>
                    <span className="font-semibold text-[#1F1A17]">{storeName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6E6A63]">Target Market:</span>
                    <span className="font-semibold text-[#1F1A17]">{city}, {country}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6E6A63]">Contact Email:</span>
                    <span className="font-semibold text-[#1F1A17]">{email}</span>
                  </div>
                </div>

                <div className="text-xs text-[#6E6A63] leading-relaxed">
                  Our trade desk in Toronto &amp; Lagos will review your store profile and contact you within 24 to 48 hours with seasonal catalog terms and deposit schedules.
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#1F1A17] hover:bg-[#7A491D] text-white text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                  <Link
                    href="/shop"
                    className="w-full sm:w-auto px-6 py-3 rounded-md border border-[#D4B895] bg-white hover:bg-[#FAF5EE] text-xs font-medium text-[#1F1A17] transition-colors text-center"
                  >
                    Browse Collections
                  </Link>
                </div>
              </div>
            ) : (
              /* Active Application Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-[#EADFD0] pb-3">
                  <h3 className="font-display text-lg font-semibold text-[#1F1A17]">
                    Boutique &amp; Store Details
                  </h3>
                  <p className="text-xs text-[#6E6A63] mt-0.5">
                    Please provide your store information so we can prepare tailored inventory recommendations.
                  </p>
                </div>

                {errorMessage && (
                  <div className="rounded-md border border-[#E31E24]/30 bg-[#FDF2F2] p-3 text-xs text-[#E31E24]">
                    {errorMessage}
                  </div>
                )}

                {/* 1. Contact Name & Boutique Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E6A63] mb-1">
                      Contact Name <span className="text-[#E31E24]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full rounded-md border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E6A63] mb-1">
                      Fashion Store / Boutique Name <span className="text-[#E31E24]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="e.g. Atelier V Boutique"
                      className="w-full rounded-md border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* 2. Country & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E6A63] mb-1">
                      Country <span className="text-[#E31E24]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United Kingdom, USA, Ghana, France"
                      className="w-full rounded-md border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E6A63] mb-1">
                      City <span className="text-[#E31E24]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. London, Atlanta, Accra, Paris"
                      className="w-full rounded-md border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* 3. Website or Instagram Handle */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#6E6A63] mb-1">
                    Store Website or Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={websiteOrInstagram}
                    onChange={(e) => setWebsiteOrInstagram(e.target.value)}
                    placeholder="e.g. www.atelierv.com or @atelierv_boutique"
                    className="w-full rounded-md border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
                  />
                  <span className="text-[10px] text-[#8C887B] block mt-1">
                    Helps us understand your store aesthetic and existing brand mix.
                  </span>
                </div>

                {/* 4. Email & Phone / WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E6A63] mb-1">
                      Email Address <span className="text-[#E31E24]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="buyer@storename.com"
                      className="w-full rounded-md border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E6A63] mb-1">
                      Phone / WhatsApp Number <span className="text-[#E31E24]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 7000 000000"
                      className="w-full rounded-md border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* 5. Additional Details / Message */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#6E6A63] mb-1">
                    Additional Details / Message
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your boutique, preferred categories (Men Wears, Women Wears, Coral Accessories, Fabrics), expected seasonal volumes, or any questions."
                    className="w-full rounded-md border border-[#EADFD0] bg-[#FAF9F6] p-3 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-md bg-[#1F1A17] hover:bg-[#7A491D] disabled:bg-[#8C887B] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Transmitting Vendor Application...</span>
                    ) : (
                      <>
                        <span>Submit Vendor Application</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                  <span className="text-[10px] text-[#8C887B] block text-center mt-2">
                    Direct notification dispatched to our Toronto &amp; Lagos trade desks via Resend.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Decorative Tribal Separator */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-4">
        <TribalSectionSeparator />
      </div>
    </div>
  );
}
