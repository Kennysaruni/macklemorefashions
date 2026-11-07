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
    <div className="min-h-screen bg-[#FFFDF9] text-[#1F1A17]">
      {/* Hero Section */}
      <section className="relative border-b border-[#EADFD0] bg-[#FAF5EE] px-4 py-12 md:px-8 md:py-16 overflow-hidden">
        <TribalCornerWatermark position="top-left" opacity={0.05} />
        <TribalCornerWatermark position="bottom-right" opacity={0.05} />

        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
                Our Story · Canada &amp; Nigeria
              </span>
              <StaggeredText
                text="Bridging International Fashion With Africa's Growing Markets."
                as="h1"
                className="font-display text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.08] text-[#1F1A17]"
              />
              <p className="text-sm sm:text-base text-[#5C5147] max-w-2xl leading-relaxed">
                Macklemore Fashion is a Canadian-based fashion company with operational headquarters in Lagos, Nigeria. We are positioned at the intersection of international fashion and Africa&apos;s most dynamic consumer markets.
              </p>
            </div>

            <div className="lg:col-span-4 rounded-lg border border-[#EADFD0] bg-white p-6 shadow-2xs">
              <MacklemoreLogo showSubline theme="light" className="mb-4" />
              <div className="border-t border-[#F2EAE0] pt-4 space-y-2 text-xs text-[#5C5147]">
                <div className="flex justify-between">
                  <span>Founder &amp; CEO:</span>
                  <span className="text-[#1F1A17] font-semibold">Micah Elechi</span>
                </div>
                <div className="flex justify-between">
                  <span>Corporate Base:</span>
                  <span className="text-[#1F1A17] font-semibold">Toronto, Canada</span>
                </div>
                <div className="flex justify-between">
                  <span>Operations HQ:</span>
                  <span className="text-[#1F1A17] font-semibold">Victoria Island, Lagos</span>
                </div>
                <div className="flex justify-between">
                  <span>Regional Reach:</span>
                  <span className="text-[#7A491D] font-semibold">West &amp; East Africa + Global</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Identity Section */}
      <section className="px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CurtainReveal className="aspect-[4/5] rounded-lg overflow-hidden border border-[#EADFD0] bg-[#FAF5EE] shadow-xs">
                <img
                  src="https://macklemorefashions.com/wp-content/uploads/2025/05/Torontofw1.jpg"
                  alt="Macklemore Fashion at Toronto Fashion Week"
                  className="h-full w-full object-cover"
                />
              </CurtainReveal>
              <CurtainReveal delay={0.1} className="aspect-[4/5] rounded-lg overflow-hidden border border-[#EADFD0] bg-[#FAF5EE] shadow-xs">
                <img
                  src="https://macklemorefashions.com/wp-content/uploads/2025/05/Micah-sewing-.jpg"
                  alt="Micah Elechi in the Macklemore Fashion Atelier"
                  className="h-full w-full object-cover"
                />
              </CurtainReveal>
            </div>
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
                Our Vision &amp; Heritage
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-semibold tracking-tight text-[#1F1A17]">
                From the Atelier to Toronto Fashion Week &amp; Continental Distribution.
              </h2>
              <p className="text-sm sm:text-base text-[#5C5147] leading-relaxed">
                Founded by creative entrepreneur <strong>Micah Elechi</strong>, Macklemore Fashion bridges traditional Nigerian textile artistry—Aso-Oke, Agbada embroidery, and bridal couture—with contemporary international silhouettes showcased at <strong>Toronto Fashion Week 2024</strong>, <strong>RAW Toronto 2024</strong>, and the <strong>Kay Foundation Charity Showcase</strong>.
              </p>
              <p className="text-sm sm:text-base text-[#5C5147] leading-relaxed">
                By combining Canadian corporate standards with deep operational roots in Lagos, Accra, and Nairobi, we serve as both a flagship fashion house and a trusted distribution bridge for partner labels like <strong>Deji &amp; Kola</strong> and <strong>LUCA</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-lg border border-[#EADFD0] bg-[#FAF5EE]">
                  <span className="text-xs font-semibold text-[#E31E24] block mb-1">
                    Curated Retail
                  </span>
                  <h3 className="font-display text-lg font-semibold text-[#1F1A17] mb-1.5">
                    Signature Collections
                  </h3>
                  <p className="text-xs text-[#5C5147] leading-relaxed">
                    Contemporary silhouettes, heavyweight sets, and heritage-inspired tailoring crafted for everyday luxury.
                  </p>
                </div>
                <div className="p-5 rounded-lg border border-[#EADFD0] bg-[#FAF5EE]">
                  <span className="text-xs font-semibold text-[#7A491D] block mb-1">
                    Brand Representation
                  </span>
                  <h3 className="font-display text-lg font-semibold text-[#1F1A17] mb-1.5">
                    Partner Houses
                  </h3>
                  <p className="text-xs text-[#5C5147] leading-relaxed">
                    Dedicated brand pages, showroom representation, and regional distribution for international and African labels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TribalSectionSeparator label="Our Three Core Commitments" />

      {/* Three Pillars */}
      <section className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-lg border border-[#EADFD0] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <span className="text-xs font-semibold text-[#E31E24] block mb-2">
              01 · Premium Fashion
            </span>
            <h3 className="font-display text-xl font-semibold text-[#1F1A17] mb-2.5">
              Uncompromising Quality
            </h3>
            <p className="text-sm text-[#5C5147] leading-relaxed">
              Every garment we carry—from structured outerwear to relaxed cotton sets and artisan-woven pieces—is selected for exceptional fabric quality, fit, and longevity.
            </p>
          </div>

          <div className="p-7 rounded-lg border border-[#EADFD0] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <span className="text-xs font-semibold text-[#D4860B] block mb-2">
              02 · International Credibility
            </span>
            <h3 className="font-display text-xl font-semibold text-[#1F1A17] mb-2.5">
              Global Standards
            </h3>
            <p className="text-sm text-[#5C5147] leading-relaxed">
              Anchored in Canada with operations in Lagos, we provide international fashion brands and discerning customers with reliable, transparent service.
            </p>
          </div>

          <div className="p-7 rounded-lg border border-[#EADFD0] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <span className="text-xs font-semibold text-[#1A7A6E] block mb-2">
              03 · African Market Reach
            </span>
            <h3 className="font-display text-xl font-semibold text-[#1F1A17] mb-2.5">
              West &amp; East Africa Access
            </h3>
            <p className="text-sm text-[#5C5147] leading-relaxed">
              Our regional presence across Nigeria, Ghana, and Kenya ensures that collections reach customers swiftly across key African fashion capitals.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-[#EADFD0] bg-[#FAF5EE] p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold text-[#7A491D] uppercase block">
              Explore Macklemore Fashion
            </span>
            <h3 className="font-display text-2xl font-semibold text-[#1F1A17] mt-1">
              Discover Our Collections or Partner With Us
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="px-6 py-3 rounded-md bg-[#1F1A17] text-white text-xs sm:text-sm font-medium hover:bg-[#E31E24] transition-colors"
            >
              Explore the Shop →
            </Link>
            <Link
              href="/partnerships"
              className="px-6 py-3 rounded-md border border-[#D4B895] bg-white text-[#1F1A17] text-xs sm:text-sm font-medium hover:bg-[#1F1A17] hover:text-white transition-colors"
            >
              Brand Partnerships
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
