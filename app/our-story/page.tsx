"use client";

import React from "react";
import Link from "next/link";
import { CurtainReveal, StaggeredText } from "@/components/motion/MotionPrimitives";
import {
  MacklemoreLogo,
  TribalCornerWatermark,
  TribalSectionSeparator,
} from "@/components/vectors/TribalVectors";

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111]">
      {/* Hero Section */}
      <section className="relative border-b border-[#E5E0D8] bg-white px-4 py-16 md:px-8 md:py-24 overflow-hidden">
        <TribalCornerWatermark
          position="top-left"
          className="text-[#7A491D]"
          opacity={0.05}
        />
        <TribalCornerWatermark
          position="bottom-right"
          className="text-[#E31E24]"
          opacity={0.05}
        />

        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <div className="font-mono text-[10px] tracking-[0.26em] text-[#7A491D] font-semibold uppercase mb-4">
                THE BRAND MANIFESTO // TORONTO — LAGOS — NAIROBI (254)
              </div>
              <StaggeredText
                text="A PIECE OF THE CONTINENT WHEREVER YOU GO. YOU BELONG."
                as="h1"
                className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95] text-[#111111]"
              />
              <p className="mt-6 max-w-2xl text-base text-[#4A4742] leading-relaxed">
                Macklemore Fashion is a Canadian-incorporated luxury &amp; streetwear enterprise with primary operational and creative headquarters in Victoria Island, Lagos, Nigeria, and regional presence in Nairobi (254) and Accra. We exist to unite authentic African pride and comfort with multi-brand international luxury curation.
              </p>
            </div>
            <div className="lg:col-span-4 border border-[#E5E0D8] bg-[#FAF9F6] p-6">
              <MacklemoreLogo showSubline theme="light" className="mb-4" />
              <div className="border-t border-[#E5E0D8] pt-4 space-y-2 font-mono text-[10px] tracking-[0.18em] text-[#6E6A63] uppercase">
                <div className="flex justify-between">
                  <span>INCORPORATION:</span>
                  <span className="text-[#111111] font-semibold">TORONTO, CANADA</span>
                </div>
                <div className="flex justify-between">
                  <span>OPERATIONAL HQ:</span>
                  <span className="text-[#111111] font-semibold">VICTORIA ISLAND, LAGOS</span>
                </div>
                <div className="flex justify-between">
                  <span>EAST AFRICA HUB:</span>
                  <span className="text-[#111111] font-semibold">WESTLANDS, NAIROBI (254)</span>
                </div>
                <div className="flex justify-between">
                  <span>TEXTILE STANDARD:</span>
                  <span className="text-[#7A491D] font-semibold">480–620 GSM ARCHIVAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Identity Section */}
      <section className="bg-[#FAF9F6] text-[#111111] border-b border-[#E5E0D8] px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <CurtainReveal className="aspect-[4/5] border border-[#E5E0D8] bg-[#F3EFEA]">
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85"
                  alt="Macklemore Atelier Lagos"
                  className="h-full w-full object-cover"
                />
              </CurtainReveal>
            </div>
            <div className="lg:col-span-6 space-y-6">
              <div className="font-mono text-[11px] tracking-[0.24em] text-[#7A491D] font-semibold uppercase">
                PILLAR 01 // THE TORONTO–LAGOS–NAIROBI BRIDGE
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight uppercase leading-[0.98] text-[#111111]">
                EVERYDAY COMFORT MEETS MULTI-BRAND LUXURY.
              </h2>
              <p className="text-sm sm:text-base text-[#4A4742] leading-relaxed">
                Inspired by the community warmth of East African streetwear and the curated gallery authority of global luxury retail, Macklemore Fashion bridges two worlds: heavyweight everyday staples and museum-grade designer tailoring.
              </p>
              <p className="text-sm sm:text-base text-[#4A4742] leading-relaxed">
                By anchoring our North American distribution hub in Toronto (Hub B) while operating our primary creative studio, bonded warehouse, and ECOWAS/EAC logistics command in Lagos (Hub A) and Nairobi (254), we deliver across both hemispheres in 24 to 72 hours.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 border border-[#E5E0D8] bg-white divide-y sm:divide-y-0 sm:divide-x divide-[#E5E0D8]">
                <div className="p-6">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-[#E31E24] font-semibold uppercase mb-2">
                    PROPRIETARY LABEL
                  </div>
                  <div className="font-display text-xl font-bold uppercase text-[#111111] mb-2">
                    MACKLEMORE ARCHIVE
                  </div>
                  <p className="text-xs text-[#4A4742] leading-relaxed">
                    Seasonal drops combining 540–620 GSM heavyweight fleece and virgin wool with hand-loomed Nigerian Aso Oke and Abeokuta Adire.
                  </p>
                </div>
                <div className="p-6">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-[#7A491D] font-semibold uppercase mb-2">
                    THE COLLECTIVE HOUSES
                  </div>
                  <div className="font-display text-xl font-bold uppercase text-[#111111] mb-2">
                    PARTNER DESIGNERS
                  </div>
                  <p className="text-xs text-[#4A4742] leading-relaxed">
                    Exclusive African representation, bonded warehousing, and localized checkout for partner houses including LUCA, Kojo Accra, and Savannah Studio 254.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TribalSectionSeparator theme="light" />

      {/* Supply Chain & Sustainability Standards */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-24">
        <div className="mb-12">
          <div className="font-mono text-[10px] tracking-[0.24em] text-[#7A491D] font-semibold uppercase mb-3">
            PILLAR 02 // MATERIAL INTEGRITY &amp; COMMUNITY IMPACT
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight uppercase text-[#111111]">
            HERITAGE WEAVING &amp; INTENTIONAL CRAFTSMANSHIP.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-[#E5E0D8] divide-y md:divide-y-0 md:divide-x divide-[#E5E0D8] bg-white">
          <div className="p-8">
            <div className="font-mono text-xs text-[#7A491D] font-semibold mb-3">
              01 // ISEYIN &amp; ABEOKUTA ARTISAN GUILDS
            </div>
            <h3 className="font-display text-2xl font-bold uppercase text-[#111111] mb-4">
              DIRECT ARTISAN EQUITY
            </h3>
            <p className="text-sm text-[#4A4742] leading-relaxed">
              We contract directly with master strip-weavers in Iseyin (Oyo State), indigo fermentation vats in Abeokuta (Ogun State), and Kente looms in Bonwire (Ashanti Region), paying 3.4x regional artisan wages.
            </p>
          </div>

          <div className="p-8">
            <div className="font-mono text-xs text-[#E31E24] font-semibold mb-3">
              02 // HEAVYWEIGHT GSM COMFORT
            </div>
            <h3 className="font-display text-2xl font-bold uppercase text-[#111111] mb-4">
              BUILT TO BELONG &amp; ENDURE
            </h3>
            <p className="text-sm text-[#4A4742] leading-relaxed">
              Every hoodie, lounge set, kaftan, and overcoat is milled between 460 GSM and 620 GSM for unmatched drape, everyday comfort, and multi-decade durability.
            </p>
          </div>

          <div className="p-8">
            <div className="font-mono text-xs text-[#7A491D] font-semibold mb-3">
              03 // BI-HEMISPHERE FULFILLMENT
            </div>
            <h3 className="font-display text-2xl font-bold uppercase text-[#111111] mb-4">
              LOCALIZED AFRICAN LOGISTICS
            </h3>
            <p className="text-sm text-[#4A4742] leading-relaxed">
              By stocking garments directly inside Hub A (Lagos) and our Nairobi 254 node, African shoppers enjoy local currency checkout (NGN, GHS, KES) and 24–72 hour delivery.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border border-[#E5E0D8] bg-white p-8">
          <div>
            <div className="font-mono text-[10px] tracking-[0.22em] text-[#7A491D] font-semibold uppercase">
              READY TO EXPLORE THE ECOSYSTEM?
            </div>
            <div className="font-display text-2xl font-bold uppercase text-[#111111] mt-1">
              SHOP THE CATALOG OR APPLY FOR BRAND REPRESENTATION.
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="bg-[#111111] px-6 py-3.5 font-mono text-xs font-semibold tracking-[0.2em] text-white uppercase hover:bg-[#E31E24] transition-colors"
            >
              SHOP THE CATALOG →
            </Link>
            <Link
              href="/partnerships"
              className="border border-[#111111] bg-white px-6 py-3.5 font-mono text-xs tracking-[0.2em] text-[#111111] uppercase hover:bg-[#111111] hover:text-white transition-colors"
            >
              B2B REPRESENTATION PORTAL →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
