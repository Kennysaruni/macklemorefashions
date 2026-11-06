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
    <div className="min-h-screen bg-[#0B0B0C] text-[#F6F5F1]">
      {/* Hero Section */}
      <section className="relative border-b border-stone-800 px-4 py-20 md:px-8 md:py-28 overflow-hidden">
        <TribalCornerWatermark
          position="top-left"
          className="text-[#D4860B]"
          opacity={0.07}
        />
        <TribalCornerWatermark
          position="bottom-right"
          className="text-[#E31E24]"
          opacity={0.07}
        />

        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <div className="font-mono text-[10px] tracking-[0.28em] text-[#D4860B] uppercase mb-4">
                [ THE BRAND MANIFESTO // TORONTO — LAGOS — NAIROBI ]
              </div>
              <StaggeredText
                text="SOVEREIGNTY IN CLOTH. AUTHORITY IN LOGISTICS."
                as="h1"
                className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.03em] uppercase leading-[0.93]"
              />
              <p className="mt-8 max-w-2xl text-base text-stone-300 leading-relaxed">
                Macklemore Fashion is a Canadian-incorporated luxury fashion enterprise with primary operational and creative headquarters in Victoria Island, Lagos, Nigeria. We exist to bridge the creative and logistical divide between the global diaspora and the African continent.
              </p>
            </div>
            <div className="lg:col-span-4 border border-stone-800 bg-[#111113] p-6">
              <MacklemoreLogo showSubline className="mb-4" />
              <div className="border-t border-stone-800 pt-4 space-y-2 font-mono text-[10px] tracking-[0.18em] text-stone-400 uppercase">
                <div className="flex justify-between">
                  <span>INCORPORATION:</span>
                  <span className="text-[#F6F5F1]">TORONTO, ONTARIO, CANADA</span>
                </div>
                <div className="flex justify-between">
                  <span>OPERATIONAL HQ:</span>
                  <span className="text-[#F6F5F1]">VICTORIA ISLAND, LAGOS</span>
                </div>
                <div className="flex justify-between">
                  <span>EAST AFRICA NODE:</span>
                  <span className="text-[#F6F5F1]">WESTLANDS, NAIROBI</span>
                </div>
                <div className="flex justify-between">
                  <span>TEXTILE STANDARD:</span>
                  <span className="text-[#D4860B]">480–620 GSM ARCHIVAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Identity Section on Bone Canvas */}
      <section className="bg-[#F6F5F1] text-[#0B0B0C] border-b border-neutral-300 px-4 py-20 md:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <CurtainReveal className="aspect-[4/5] border border-neutral-300 bg-neutral-900">
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85"
                  alt="Macklemore Atelier Lagos"
                  className="h-full w-full object-cover"
                />
              </CurtainReveal>
            </div>
            <div className="lg:col-span-6 space-y-6">
              <div className="font-mono text-[11px] tracking-[0.25em] text-[#7A491D] uppercase">
                [ PILLAR 01 // THE TORONTO–LAGOS BRIDGE ]
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-[-0.03em] uppercase leading-[0.98]">
                TWO HEMISPHERES. ONE UNIFIED STANDARD.
              </h2>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                For decades, African luxury consumers and international fashion houses faced a fractured ecosystem: indigenous craftsmanship was exported without institutional infrastructure, while global luxury houses viewed West and East Africa as unreachable secondary markets due to customs friction and payment fragmentation.
              </p>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                Macklemore Fashion engineered the solution from the ground up. By anchoring our corporate treasury and North American distribution hub in Toronto (Hub B) while operating our primary creative studio, bonded warehouse, and ECOWAS logistics command in Lagos (Hub A), we operate as a true trans-continental bridge.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 border border-neutral-300 bg-white divide-y sm:divide-y-0 sm:divide-x divide-neutral-300 pt-0">
                <div className="p-6">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-[#E31E24] uppercase mb-2">
                    [ PROPRIETARY ATELIER ]
                  </div>
                  <div className="font-display text-xl font-bold uppercase mb-2">
                    MACKLEMORE LABEL
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Seasonal architectural drops combining 600 GSM Canadian-milled fleece and virgin wool with hand-loomed Nigerian Aso Oke and Abeokuta Adire.
                  </p>
                </div>
                <div className="p-6">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-[#7A491D] uppercase mb-2">
                    [ CONTINENTAL SYNDICATE ]
                  </div>
                  <div className="font-display text-xl font-bold uppercase mb-2">
                    PARTNER HOUSES
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Exclusive African representation, bonded warehousing, and localized checkout for partner houses including LUCA, Kojo Accra, and Savannah Studio 254.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TribalSectionSeparator />

      {/* Supply Chain & Sustainability Standards */}
      <section className="mx-auto max-w-[1600px] px-4 py-20 md:px-8">
        <div className="mb-12">
          <div className="font-mono text-[10px] tracking-[0.26em] text-[#D4860B] uppercase mb-3">
            [ PILLAR 02 // MATERIAL INTEGRITY & SUPPLY CHAIN ]
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-[-0.03em] uppercase">
            HERITAGE WEAVING MEETS INDUSTRIAL SPECIFICATION.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-stone-800 divide-y md:divide-y-0 md:divide-x divide-stone-800">
          <div className="p-8 bg-[#0E0E10]">
            <div className="font-mono text-xs text-[#D4860B] mb-3">
              [ 01 // ISEYIN & ABEOKUTA ARTISAN GUILDS ]
            </div>
            <h3 className="font-display text-2xl font-bold uppercase mb-4">
              DIRECT ARTISAN EQUITY
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              We contract directly with master strip-weavers in Iseyin (Oyo State), indigo fermentation vats in Abeokuta (Ogun State), and Kente looms in Bonwire (Ashanti Region). Every yard carries a provenance serial code and pays 3.4x standard regional artisan wages.
            </p>
          </div>

          <div className="p-8 bg-[#0E0E10]">
            <div className="font-mono text-xs text-[#E31E24] mb-3">
              [ 02 // HEAVYWEIGHT GSM ARCHITECTURE ]
            </div>
            <h3 className="font-display text-2xl font-bold uppercase mb-4">
              ZERO-DISPOSABILITY MILLING
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              We reject fast-fashion obsolescence. Our knitwear and jersey programs start at a minimum of 460 GSM up to 620 GSM double-faced wool, engineered for multi-decade structural permanence and numbered allocation runs.
            </p>
          </div>

          <div className="p-8 bg-[#0E0E10]">
            <div className="font-mono text-xs text-[#D4860B] mb-3">
              [ 03 // BI-HEMISPHERE FULFILLMENT ]
            </div>
            <h3 className="font-display text-2xl font-bold uppercase mb-4">
              REDUCED AIR-MILE ROUTING
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              By stocking African-manufactured garments directly inside Hub A (Lagos) for West & East African patrons, we eliminate redundant round-trip air freight to Europe or North America before reaching African consumers.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border border-stone-800 bg-[#111113] p-8">
          <div>
            <div className="font-mono text-[10px] tracking-[0.22em] text-[#D4860B] uppercase">
              [ READY TO EXPLORE THE ECOSYSTEM? ]
            </div>
            <div className="font-display text-2xl font-bold uppercase mt-1">
              SHOP THE ARCHIVE OR APPLY FOR CONTINENTAL REPRESENTATION.
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="bg-[#E31E24] px-6 py-3.5 font-mono text-xs font-semibold tracking-[0.2em] text-white uppercase hover:bg-[#D4860B] hover:text-black transition-colors"
            >
              ENTER THE CATALOG →
            </Link>
            <Link
              href="/partnerships"
              className="border border-stone-700 px-6 py-3.5 font-mono text-xs tracking-[0.2em] text-[#F6F5F1] uppercase hover:border-[#D4860B]"
            >
              B2B REPRESENTATION PORTAL →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

