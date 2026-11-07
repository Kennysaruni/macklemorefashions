"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePlatform } from "@/lib/platform-context";
import { InquiryChannel } from "@/lib/store-data";
import { TextReveal } from "@/components/motion/MotionPrimitives";
import { TribalCornerWatermark } from "@/components/vectors/TribalVectors";

const CHANNELS: {
  code: InquiryChannel;
  label: string;
  deskTitle: string;
  office: string;
  email: string;
  description: string;
}[] = [
  {
    code: "CONCIERGE",
    label: "Customer Support",
    deskTitle: "Client Care, Sizing & Order Assistance",
    office: "Lagos · Toronto · Nairobi",
    email: "concierge@macklemorefashions.com",
    description:
      "Questions about sizing, garment fabrics, shipping timelines, or personal styling assistance.",
  },
  {
    code: "BRAND_REPRESENTATION",
    label: "Brand Partnerships",
    deskTitle: "Brand Representation & Distribution",
    office: "Lagos HQ · Toronto HQ",
    email: "partnerships@macklemorefashions.com",
    description:
      "For international and African fashion brands interested in working with Macklemore Fashion across West and East Africa.",
  },
  {
    code: "WHOLESALE",
    label: "Wholesale & Distribution",
    deskTitle: "Showroom & Retail Buying Enquiries",
    office: "Toronto · Lagos · Accra",
    email: "wholesale@macklemorefashions.com",
    description:
      "For boutiques, retail buyers, and regional distributors seeking seasonal allocations.",
  },
  {
    code: "PRESS",
    label: "General & Press",
    deskTitle: "General Enquiries, Media & Styling",
    office: "International Desk",
    email: "hello@macklemorefashions.com",
    description:
      "Editorial features, press requests, showroom visits, and general company enquiries.",
  },
];

export default function ContactPage() {
  const { submitB2BInquiry } = usePlatform();
  const [activeChannel, setActiveChannel] =
    useState<InquiryChannel>("CONCIERGE");
  const [brandOrCompanyName, setBrandOrCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [headquartersCountry, setHeadquartersCountry] = useState("Nigeria");
  const [message, setMessage] = useState("");
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const currentChannelMeta =
    CHANNELS.find((c) => c.code === activeChannel) || CHANNELS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record = submitB2BInquiry({
      channel: activeChannel,
      brandOrCompanyName:
        brandOrCompanyName.trim() || "Individual Enquiry",
      contactName: contactName.trim(),
      contactRole: currentChannelMeta.label,
      email: email.trim(),
      phone: phone.trim(),
      headquartersCountry,
      websiteUrl: "https://macklemorefashions.com",
      targetRegions: ["West Africa", "East Africa", "International"],
      annualVolumeTier: currentChannelMeta.label,
      message: message.trim(),
    });
    setSubmittedRef(record.referenceCode);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1F1A17]">
      {/* Header */}
      <section className="relative border-b border-[#EADFD0] bg-[#FAF5EE] px-4 py-12 md:px-8 md:py-16 overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.05} />
        <div className="mx-auto max-w-[1440px] space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
            Get in Touch
          </span>
          <TextReveal
            text="Contact Macklemore Fashion"
            as="h1"
            className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-[#1F1A17]"
          />
          <p className="max-w-2xl text-sm sm:text-base text-[#5C5147] leading-relaxed">
            Whether you are a customer, a fashion brand exploring representation, or a retail partner, choose an option below to connect with our team in Toronto and Lagos.
          </p>
        </div>
      </section>

      {/* Channel Tabs + Contact Form */}
      <section className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-16">
        {/* 4 Contact Option Cards with layoutId Spring Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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
                className={`relative p-5 rounded-lg border text-left transition-colors duration-200 cursor-pointer overflow-hidden ${
                  isSelected
                    ? "border-[#1F1A17] text-white shadow-md"
                    : "bg-white border-[#EADFD0] text-[#1F1A17] hover:border-[#7A491D] hover:bg-[#FAF5EE]"
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="contact-channel-tab"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 32,
                    }}
                    className="absolute inset-0 bg-[#1F1A17] rounded-[7px]"
                  />
                )}
                <span
                  className={`relative z-10 text-xs font-medium block mb-1 ${
                    isSelected ? "text-[#D4860B]" : "text-[#7A491D]"
                  }`}
                >
                  {ch.label}
                </span>
                <div className="relative z-10 font-display text-base font-semibold">
                  {ch.deskTitle}
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-lg border border-[#EADFD0] bg-white overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
          {/* Left Info Column */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#EADFD0] p-6 sm:p-10 bg-[#FAF5EE]/60 flex flex-col justify-between">
            <div className="space-y-5">
              <span className="inline-block px-3 py-1 rounded-md bg-[#E31E24]/10 text-[#E31E24] text-xs font-medium">
                {currentChannelMeta.label}
              </span>
              <h2 className="font-display text-2xl font-semibold text-[#1F1A17]">
                {currentChannelMeta.deskTitle}
              </h2>
              <p className="text-sm text-[#5C5147] leading-relaxed">
                {currentChannelMeta.description}
              </p>

              <div className="border-t border-[#E6DACB] pt-5 space-y-2.5 text-xs text-[#5C5147]">
                <div className="flex justify-between">
                  <span>Offices:</span>
                  <span className="text-[#1F1A17] font-semibold">
                    {currentChannelMeta.office}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Direct Email:</span>
                  <span className="text-[#7A491D] font-semibold">
                    {currentChannelMeta.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Locations */}
            <div className="mt-10 border-t border-[#E6DACB] pt-6 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7A491D] block">
                Our Offices &amp; Showrooms
              </span>
              <div className="space-y-2.5 text-xs">
                <div className="rounded-md border border-[#EADFD0] p-3.5 bg-white">
                  <div className="text-[#E31E24] font-semibold">
                    Lagos Operational HQ
                  </div>
                  <div className="text-[#5C5147] mt-0.5">
                    14 Adeola Odeku Street, Victoria Island, Lagos, Nigeria
                  </div>
                </div>
                <div className="rounded-md border border-[#EADFD0] p-3.5 bg-white">
                  <div className="text-[#D4860B] font-semibold">
                    Toronto Corporate HQ
                  </div>
                  <div className="text-[#5C5147] mt-0.5">
                    620 King Street West, Toronto, ON, Canada
                  </div>
                </div>
                <div className="rounded-md border border-[#EADFD0] p-3.5 bg-white">
                  <div className="text-[#E05C1A] font-semibold">
                    East Africa Hub
                  </div>
                  <div className="text-[#5C5147] mt-0.5">
                    Westlands Corridor, Nairobi, Kenya
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 bg-white">
            {submittedRef ? (
              <div className="rounded-lg border border-[#2E6B4E]/30 bg-[#FAF5EE] p-8 space-y-3">
                <div className="text-xs text-[#2E6B4E] font-semibold">
                  ✓ Message Received (Reference: {submittedRef})
                </div>
                <h3 className="font-display text-2xl font-semibold text-[#1F1A17]">
                  Thank You for Contacting Macklemore Fashion
                </h3>
                <p className="text-sm text-[#5C5147] leading-relaxed">
                  Your message has been sent to our{" "}
                  <strong>{currentChannelMeta.label}</strong> team. We will reply shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedRef(null);
                    setMessage("");
                  }}
                  className="rounded-md bg-[#1F1A17] px-5 py-2.5 text-xs font-medium text-white hover:bg-[#E31E24] transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5C5147] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-md border border-[#E2D6C5] bg-[#FFFDF9] px-3.5 py-2.5 text-sm text-[#1F1A17] focus:border-[#7A491D] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5C5147] mb-1.5">
                      Brand / Company / Order # (Optional)
                    </label>
                    <input
                      type="text"
                      value={brandOrCompanyName}
                      onChange={(e) => setBrandOrCompanyName(e.target.value)}
                      placeholder="Optional"
                      className="w-full rounded-md border border-[#E2D6C5] bg-[#FFFDF9] px-3.5 py-2.5 text-sm text-[#1F1A17] focus:border-[#7A491D] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5C5147] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-md border border-[#E2D6C5] bg-[#FFFDF9] px-3.5 py-2.5 text-sm text-[#1F1A17] focus:border-[#7A491D] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5C5147] mb-1.5">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 / +1 / +254 / +44"
                      className="w-full rounded-md border border-[#E2D6C5] bg-[#FFFDF9] px-3.5 py-2.5 text-sm text-[#1F1A17] focus:border-[#7A491D] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5C5147] mb-1.5">
                    Country / Region
                  </label>
                  <select
                    value={headquartersCountry}
                    onChange={(e) => setHeadquartersCountry(e.target.value)}
                    className="w-full rounded-md border border-[#E2D6C5] bg-[#FFFDF9] px-3.5 py-2.5 text-sm text-[#1F1A17] focus:border-[#7A491D] outline-none"
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="Canada">Canada</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Ghana">Ghana</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Europe">Europe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5C5147] mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can our team help you?"
                    className="w-full rounded-md border border-[#E2D6C5] bg-[#FFFDF9] p-3.5 text-sm text-[#1F1A17] focus:border-[#7A491D] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-[#1F1A17] py-3.5 text-xs sm:text-sm font-medium text-white hover:bg-[#E31E24] transition-colors cursor-pointer shadow-xs"
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
