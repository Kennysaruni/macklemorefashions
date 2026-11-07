"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePlatform } from "@/lib/platform-context";
import {
  CurtainReveal,
  StaggeredText,
} from "@/components/motion/MotionPrimitives";
import {
  TribalCornerWatermark,
  TribalPatternRibbon,
  TribalSectionSeparator,
} from "@/components/vectors/TribalVectors";
import { EditorialProductCard } from "@/components/commerce/EditorialProductCard";
import { ContinentalMapBanner } from "@/components/vectors/ContinentalMapBanner";

const HERO_SLIDES = [
  {
    id: "slide-01",
    eyebrow: "Macklemore Fashion · Canada & Nigeria",
    headline: "Where International Luxury Meets African Reach.",
    subcopy:
      "A Canadian-based fashion house with operational headquarters in Lagos—curating contemporary collections and connecting global brands with dynamic markets across West and East Africa.",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1800&q=85",
    secondaryImage:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
    ctaHref: "/shop",
    ctaLabel: "Explore the Shop",
    captionTitle: "Seasonal Edit — Lagos & Toronto",
    captionSub: "Curated Ready-to-Wear & Heritage Tailoring",
  },
  {
    id: "slide-02",
    eyebrow: "Partner Brand Spotlight · LUCA",
    headline: "LUCA: Contemporary Tailoring & Effortless Drape.",
    subcopy:
      "Represented across West and East Africa by Macklemore Fashion. Discover architectural outerwear, relaxed suiting, and refined essentials.",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=85",
    secondaryImage:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1200&q=85",
    ctaHref: "/brands/luca",
    ctaLabel: "Discover LUCA",
    captionTitle: "LUCA Flagship Collection",
    captionSub: "Represented by Macklemore Fashion",
  },
  {
    id: "slide-03",
    eyebrow: "Elevated Everyday Comfort",
    headline: "Crafted for Warmth, Culture & Modern Living.",
    subcopy:
      "Heavyweight cotton sets, structured layers, and artisan-woven pieces designed to travel effortlessly between Toronto, London, Lagos, Accra, and Nairobi.",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1800&q=85",
    secondaryImage:
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85",
    ctaHref: "/collections",
    ctaLabel: "View Featured Collections",
    captionTitle: "Signature Sets & Layers",
    captionSub: "Available for International & Regional Delivery",
  },
];

const SEGMENT_CARDS = [
  {
    tag: "Women",
    title: "Women's Collection",
    subtitle: "Tailored silhouettes, silk-cotton sets & statement outerwear",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
    href: "/shop?gender=WOMEN",
  },
  {
    tag: "Men",
    title: "Men's Collection",
    subtitle: "Structured jackets, relaxed tailoring & heavyweight essentials",
    image:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=80",
    href: "/shop?gender=MEN",
  },
  {
    tag: "Featured",
    title: "New Arrivals",
    subtitle: "The latest seasonal pieces from Macklemore & partner brands",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80",
    href: "/collections",
  },
  {
    tag: "Houses",
    title: "Partner Brands",
    subtitle: "Explore LUCA and our curated portfolio of fashion labels",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80",
    href: "/brands",
  },
];

export default function HomePage() {
  const { products, brands, collections } = usePlatform();
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  const activeSlide = HERO_SLIDES[activeSlideIdx];
  const featuredProducts = products.slice(0, 6);
  const lucaBrand = brands.find((b) => b.slug === "luca") || brands[1];
  const lucaProducts = products.filter((p) => p.brandSlug === "luca");

  return (
    <div className="bg-[#FFFDF9] text-[#1F1A17]">
      {/* =====================================================================
          1. WARM, WELCOMING LIFESTYLE HERO
         ===================================================================== */}
      <section className="relative border-b border-[#EADFD0] bg-[#FFFDF9] overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.05} />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <div className="rounded-lg border border-[#EADFD0] bg-[#FAF5EE] overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
            {/* Left 6 Columns: Minimalist Copy & Clear Positioning */}
            <div className="lg:col-span-6 p-6 sm:p-12 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EADFD0]">
              <div className="space-y-6">
                {/* Slide Selector Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {HERO_SLIDES.map((slide, i) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveSlideIdx(i)}
                      className={`px-3.5 py-1.5 rounded-md text-xs font-medium border transition-all duration-200 cursor-pointer ${
                        activeSlideIdx === i
                          ? "border-[#1F1A17] bg-[#1F1A17] text-white shadow-2xs"
                          : "border-[#E2D6C5] bg-white text-[#5C5147] hover:border-[#7A491D] hover:text-[#1F1A17]"
                      }`}
                    >
                      0{i + 1} · {slide.eyebrow.split("·")[0].trim()}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 pt-1">
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#E31E24] block">
                    {activeSlide.eyebrow}
                  </span>

                  <StaggeredText
                    key={activeSlide.headline}
                    text={activeSlide.headline}
                    as="h1"
                    className="font-display text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.08] text-[#1F1A17]"
                  />
                </div>

                <p className="text-sm sm:text-base text-[#5C5147] max-w-xl leading-relaxed">
                  {activeSlide.subcopy}
                </p>

                {/* Primary & Secondary Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href={activeSlide.ctaHref}
                    className="px-6 py-3.5 rounded-md bg-[#1F1A17] hover:bg-[#E31E24] text-white text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 shadow-xs hover:shadow-md"
                  >
                    {activeSlide.ctaLabel} →
                  </Link>
                  <Link
                    href="/partnerships"
                    className="px-5 py-3.5 rounded-md border border-[#D4B895] bg-white hover:bg-[#1F1A17] hover:text-white hover:border-[#1F1A17] text-xs sm:text-sm font-medium text-[#1F1A17] transition-all duration-200"
                  >
                    Brand Partnerships
                  </Link>
                </div>
              </div>

              {/* Three Clear Positioning Pillars */}
              <div className="grid grid-cols-3 gap-4 pt-8 mt-10 border-t border-[#E6DACB]">
                <div>
                  <span className="text-xs text-[#7A491D] font-medium block">
                    Global Headquarters
                  </span>
                  <span className="text-sm font-semibold text-[#1F1A17] mt-0.5 block">
                    Toronto, Canada
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#7A491D] font-medium block">
                    Operations Hub
                  </span>
                  <span className="text-sm font-semibold text-[#1F1A17] mt-0.5 block">
                    Lagos, Nigeria
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#7A491D] font-medium block">
                    Market Reach
                  </span>
                  <span className="text-sm font-semibold text-[#1F1A17] mt-0.5 block">
                    West &amp; East Africa + Global
                  </span>
                </div>
              </div>
            </div>

            {/* Right 6 Columns: Warm Lifestyle Photography */}
            <div className="lg:col-span-6 relative bg-[#F3EAE0] min-h-[440px] sm:min-h-[560px] flex flex-col justify-end overflow-hidden">
              <CurtainReveal
                key={activeSlide.image}
                duration={0.95}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={activeSlide.image}
                  alt={activeSlide.headline}
                  className="w-full h-full object-cover object-center"
                />
              </CurtainReveal>

              {/* Floating Warm Caption Card */}
              <div className="relative z-10 m-5 sm:m-6 p-4 rounded-lg bg-[#FFFDF9]/95 backdrop-blur-md border border-[#EADFD0] shadow-md flex items-center justify-between gap-4 max-w-md ml-auto">
                <div>
                  <span className="text-[11px] font-medium text-[#7A491D] block">
                    {activeSlide.captionTitle}
                  </span>
                  <p className="font-display text-sm font-semibold text-[#1F1A17] mt-0.5">
                    {activeSlide.captionSub}
                  </p>
                </div>
                <img
                  src={activeSlide.secondaryImage}
                  alt="Collection detail"
                  className="w-14 h-16 object-cover rounded-md border border-[#EADFD0] shrink-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. SHOP BY SEGMENT (WOMEN · MEN · NEW ARRIVALS · PARTNER BRANDS)
         ===================================================================== */}
      <section className="py-14 sm:py-20 bg-[#FFFDF9]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
                Curated Segments
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F1A17] mt-1">
                Explore by Category
              </h2>
            </div>
            <Link
              href="/shop"
              className="editorial-link text-sm font-medium text-[#7A491D] hover:text-[#E31E24] transition-colors"
            >
              Browse Full Catalog →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SEGMENT_CARDS.map((card, idx) => (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-lg overflow-hidden border border-[#EADFD0] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#D4B895] flex flex-col justify-between"
              >
                <CurtainReveal delay={idx * 0.05} duration={0.85}>
                  <div className="aspect-[4/5] overflow-hidden bg-[#FAF5EE] relative">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover object-center scale-100 group-hover:scale-[1.04] transition-transform duration-700"
                    />
                    <span className="absolute top-3 left-3 bg-[#FFFDF9]/90 backdrop-blur-xs border border-[#EADFD0] rounded-md px-2.5 py-1 text-xs font-medium text-[#7A491D]">
                      {card.tag}
                    </span>
                  </div>
                </CurtainReveal>
                <div className="p-5 bg-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold text-[#1F1A17] group-hover:text-[#E31E24] transition-colors">
                      {card.title}
                    </h3>
                    <span className="text-sm text-[#7A491D] group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                  <p className="text-xs text-[#6E6359] mt-1 leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. NEW ARRIVALS & FEATURED PIECES
         ===================================================================== */}
      <section className="py-14 sm:py-20 bg-[#FAF5EE] border-y border-[#EADFD0]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
                New Arrivals &amp; Signature Pieces
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-semibold tracking-tight text-[#1F1A17] mt-1">
                Latest Releases
              </h2>
            </div>
            <Link
              href="/shop"
              className="px-5 py-2.5 rounded-md bg-[#1F1A17] text-white hover:bg-[#E31E24] text-xs font-medium tracking-wide transition-colors self-start md:self-auto"
            >
              View All {products.length} Pieces →
            </Link>
          </div>

          <TribalSectionSeparator
            label="Curated Across Lagos, Toronto, Accra & Nairobi"
            className="my-6"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {featuredProducts.map((product, index) => (
              <EditorialProductCard
                key={product.id}
                product={product}
                theme="light"
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. PARTNER BRANDS & LUCA SPOTLIGHT
         ===================================================================== */}
      <section className="py-16 sm:py-20 bg-[#FFFDF9] relative overflow-hidden">
        <TribalCornerWatermark position="bottom-right" opacity={0.04} />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12">
          {/* Partner Brand Spotlight: LUCA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-5 rounded-lg border border-[#EADFD0] bg-[#FAF5EE] p-6 sm:p-10 flex flex-col justify-between shadow-2xs">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-md bg-[#E31E24]/10 text-[#E31E24] text-xs font-medium">
                  Partner Brand Spotlight
                </span>

                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1F1A17]">
                  {lucaBrand.name}
                </h2>

                <p className="text-sm font-medium text-[#7A491D]">
                  {lucaBrand.tagline}
                </p>

                <p className="text-sm text-[#5C5147] leading-relaxed">
                  {lucaBrand.story}
                </p>

                <div className="p-4 rounded-md border border-[#EADFD0] bg-white text-xs text-[#5C5147] space-y-1.5">
                  <div>
                    <strong className="text-[#1F1A17]">Origin:</strong>{" "}
                    {lucaBrand.originCity}
                  </div>
                  <div>
                    <strong className="text-[#1F1A17]">Market Reach:</strong>{" "}
                    {lucaBrand.allocatedRegions.join(" · ")}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E6DACB] flex flex-wrap gap-3">
                <Link
                  href="/brands/luca"
                  className="flex-1 py-3 px-5 rounded-md bg-[#1F1A17] hover:bg-[#E31E24] text-white text-center text-xs font-medium transition-colors"
                >
                  Explore LUCA Brand Page →
                </Link>
                <Link
                  href="/brands"
                  className="py-3 px-5 rounded-md border border-[#D4B895] bg-white hover:bg-[#1F1A17] hover:text-white text-center text-xs font-medium text-[#1F1A17] transition-colors"
                >
                  All Brands
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {lucaProducts.slice(0, 2).map((prod, idx) => (
                <EditorialProductCard
                  key={prod.id}
                  product={prod}
                  theme="light"
                  index={idx}
                />
              ))}
            </div>
          </div>

          {/* Partner Brand Directory Strip */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-semibold text-[#1F1A17]">
                Represented &amp; Partner Houses
              </h3>
              <Link
                href="/brands"
                className="text-xs font-medium text-[#7A491D] hover:text-[#E31E24] transition-colors"
              >
                View All Brands →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="p-5 rounded-lg border border-[#EADFD0] bg-white hover:bg-[#FAF5EE] hover:-translate-y-0.5 hover:shadow-md hover:border-[#D4B895] transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[11px] font-medium text-[#7A491D] block">
                      {brand.originCity}
                    </span>
                    <h4 className="font-display text-base font-semibold text-[#1F1A17] group-hover:text-[#E31E24] transition-colors mt-1">
                      {brand.name}
                    </h4>
                    <p className="text-xs text-[#6E6359] line-clamp-2 mt-1.5 leading-relaxed">
                      {brand.tagline}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-[#7A491D] group-hover:text-[#E31E24] mt-4 pt-2.5 border-t border-[#F2EAE0] block">
                    View Brand →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. OUR MARKETS & INTERNATIONAL REACH MAP
         ===================================================================== */}
      <ContinentalMapBanner />

      {/* =====================================================================
          6. FEATURED COLLECTIONS & B2B BRAND PARTNERSHIPS INVITATION
         ===================================================================== */}
      <section className="py-16 sm:py-20 bg-[#FFFDF9]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-16">
          {/* Featured Seasonal Collections */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
                  Seasonal Campaigns
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1F1A17] mt-1">
                  Featured Collections
                </h2>
              </div>
              <Link
                href="/collections"
                className="text-sm font-medium text-[#7A491D] hover:text-[#E31E24] transition-colors"
              >
                Explore All Collections →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collections.slice(0, 2).map((col, idx) => (
                <Link
                  key={col.id}
                  href="/collections"
                  className="group rounded-lg border border-[#EADFD0] bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#D4B895] flex flex-col justify-between"
                >
                  <CurtainReveal delay={idx * 0.08} duration={0.9}>
                    <div className="aspect-[16/9] relative overflow-hidden bg-[#FAF5EE]">
                      <img
                        src={col.heroImageUrl}
                        alt={col.title}
                        className="w-full h-full object-cover scale-100 group-hover:scale-[1.03] transition-transform duration-700"
                      />
                      <span className="absolute top-3 left-3 bg-[#FFFDF9]/90 backdrop-blur-xs border border-[#EADFD0] rounded-md px-3 py-1 text-xs font-medium text-[#7A491D]">
                        {col.brandName}
                      </span>
                    </div>
                  </CurtainReveal>
                  <div className="p-6 space-y-2.5 bg-white">
                    <h3 className="font-display text-xl font-semibold text-[#1F1A17] group-hover:text-[#E31E24] transition-colors">
                      {col.title}
                    </h3>
                    <p className="text-sm text-[#5C5147] line-clamp-2 leading-relaxed">
                      {col.manifesto}
                    </p>
                    <span className="inline-block pt-1 text-xs font-medium text-[#7A491D] group-hover:text-[#E31E24]">
                      View Collection →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Warm B2B Brand Partnerships & Distribution Banner */}
          <div className="rounded-lg border border-[#EADFD0] bg-[#FAF5EE] overflow-hidden shadow-xs">
            <TribalPatternRibbon />
            <div className="p-8 sm:p-12 relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#E31E24] block">
                    Brand Partnerships &amp; African Distribution
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1F1A17] leading-snug">
                    Partner With Macklemore Fashion to Reach West &amp; East African Markets
                  </h2>
                  <p className="text-sm sm:text-base text-[#5C5147] max-w-2xl leading-relaxed">
                    We support international and African fashion brands with regional representation, showroom curation in Lagos, retail distribution, and market expansion across Nigeria, Ghana, Kenya, and beyond.
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                  <Link
                    href="/partnerships"
                    className="py-3.5 px-6 rounded-md bg-[#1F1A17] hover:bg-[#E31E24] text-white text-center text-xs sm:text-sm font-medium transition-colors shadow-xs"
                  >
                    Explore Brand Partnerships →
                  </Link>
                  <Link
                    href="/our-story"
                    className="py-3.5 px-6 rounded-md border border-[#D4B895] bg-white hover:bg-[#1F1A17] hover:text-white text-center text-xs sm:text-sm font-medium text-[#1F1A17] transition-colors"
                  >
                    Read Our Story
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
