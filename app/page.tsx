"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePlatform } from "@/lib/platform-context";
import { ShopCategory } from "@/lib/store-data";
import {
  CatalogGridSuspenseFallback,
  CurtainImage,
  TextReveal,
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
    eyebrow: "Canada · Nigeria",
    headline: "Authentic African Luxury.",
    subcopy:
      "Bespoke and ready-to-wear African fashion crafted between Toronto and Lagos for global markets.",
    image:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/168465240_271856821065695_3354743809372838221_n.jpg",
    secondaryImage:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/413888847_18015074198003708_3616451493638629856_n.jpg",
    ctaHref: "/shop?category=Men+Wears",
    ctaLabel: "Shop Men Wears",
    captionTitle: "Champagne Gold Aso-Oke Dashiki Set ($300)",
    captionSub: "Hand-Woven Yoruba Hat & Coral Beads",
  },
  {
    id: "slide-02",
    eyebrow: "Women Wears · Couture",
    headline: "Regal Gowns & Royal Gele.",
    subcopy:
      "Handcrafted Aso-Ebi gowns, flowing Boubou silhouettes, and bridal coral sets for unforgettable occasions.",
    image:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/7.jpg",
    secondaryImage:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/6.jpg",
    ctaHref: "/shop?category=Women+Wears",
    ctaLabel: "Shop Women Wears",
    captionTitle: "Green Aso-Ebi Gown ($250) & Aso-Oke Boubou ($150)",
    captionSub: "Custom & Ready-to-Wear Sizes",
  },
  {
    id: "slide-03",
    eyebrow: "Partner Brands",
    headline: "Global & African Fashion.",
    subcopy:
      "Showcasing signature collections and representing premier houses like Deji & Kola and LUCA across Africa.",
    image:
      "https://macklemorefashions.com/wp-content/uploads/2025/05/Torontofw1.jpg",
    secondaryImage:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/dejiandkola_africa_1712608765_3341927002288432016_30014923707.jpg",
    ctaHref: "/brands",
    ctaLabel: "Explore Our Brands",
    captionTitle: "Toronto Fashion Week & Partner Showcase",
    captionSub: "Founded by Micah Elechi",
  },
];

const SHOP_CATEGORY_CARDS = [
  {
    tag: "Men Wears",
    title: "Men Wears",
    subtitle: "Aso-Oke Dashiki sets ($300), White Agbadas ($200) & Senator Kaftans ($150)",
    image:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/Mencategory1.jpg",
    href: "/shop?category=Men+Wears",
  },
  {
    tag: "Women Wears",
    title: "Women Wears",
    subtitle: "Green Aso-Ebi Gowns ($250), Aso-Oke Boubou ($150) & Ankara Lace ($120)",
    image:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/womancategory11.jpg",
    href: "/shop?category=Women+Wears",
  },
  {
    tag: "Male Accessories",
    title: "Male Accessories",
    subtitle: "2-Layer Coral Beads ($65), Igbo Royal Red Hat ($60) & Hand Fans ($50)",
    image:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/maleaccessories.jpg",
    href: "/shop?category=Male+Accessories",
  },
  {
    tag: "Female Accessories",
    title: "Female Accessories",
    subtitle: "Royal Bridal Beads ($120), Green & Gold Beads ($120) & Auto-Gele Hats ($100)",
    image:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/femaleaccessories.jpg",
    href: "/shop?category=Female+Accessories",
  },
  {
    tag: "Kids Wears",
    title: "Kids Wears",
    subtitle: "Baby In Aso-Oke ($120), Yoruba, Hausa & Complete Baby Sets ($100)",
    image:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/child-baby.jpg",
    href: "/shop?category=Kids+Wears",
  },
  {
    tag: "Prints & Fabrics",
    title: "African Fabrics",
    subtitle: "Aso-Oke ($120–$240), Elegant Lace ($100–$200) & Ankara Wax Print ($50–$100)",
    image:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/Ankara.jpg",
    href: "/shop?category=Fabrics",
  },
];

const HOME_FILTER_TABS: { value: "ALL" | ShopCategory; label: string }[] = [
  { value: "ALL", label: "All Categories" },
  { value: "Men Wears", label: "Men Wears" },
  { value: "Women Wears", label: "Women Wears" },
  { value: "Male Accessories", label: "Male Accessories" },
  { value: "Female Accessories", label: "Female Accessories" },
  { value: "Kids Wears", label: "Kids Wears" },
  { value: "Fabrics", label: "Prints & Fabrics" },
];

export default function HomePage() {
  const { products, brands } = usePlatform();
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [homeCategory, setHomeCategory] = useState<"ALL" | ShopCategory>("ALL");

  const activeSlide = HERO_SLIDES[activeSlideIdx];

  const displayedProducts =
    homeCategory === "ALL"
      ? products.slice(0, 9)
      : products.filter((p) => p.category === homeCategory);

  const dejiBrand =
    brands.find((b) => b.slug === "deji-and-kola") || brands[1];
  const lucaBrand = brands.find((b) => b.slug === "luca") || brands[2];

  return (
    <div className="bg-[#FFFDF9] text-[#1F1A17]">
      {/* =====================================================================
          1. WARM, WELCOMING LIFESTYLE HERO (WITH OFFICIAL PHOTOS)
         ===================================================================== */}
      <section className="relative border-b border-[#EADFD0] bg-[#FFFDF9] overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.05} />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <div className="rounded-lg border border-[#EADFD0] bg-[#FAF5EE] overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
            {/* Left 6 Columns: Minimalist Copy & Clear Positioning */}
            <div className="lg:col-span-6 p-6 sm:p-12 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EADFD0]">
              <div className="space-y-6">
                {/* Slide Selector Pills with layoutId Gliding Indicator */}
                <div className="flex flex-wrap items-center gap-2">
                  {HERO_SLIDES.map((slide, i) => {
                    const isActive = activeSlideIdx === i;
                    return (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setActiveSlideIdx(i)}
                        className={`relative px-3.5 py-1.5 rounded-md text-xs font-medium border transition-colors duration-200 cursor-pointer overflow-hidden ${
                          isActive
                            ? "border-[#1F1A17] text-white shadow-2xs"
                            : "border-[#E2D6C5] bg-white text-[#5C5147] hover:border-[#7A491D] hover:text-[#1F1A17]"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="hero-slide-tab"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 32,
                            }}
                            className="absolute inset-0 bg-[#1F1A17] rounded-[5px]"
                          />
                        )}
                        <span className="relative z-10">
                          0{i + 1} · {slide.eyebrow.split("·")[0].trim()}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-3 pt-1">
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#E31E24] block">
                    {activeSlide.eyebrow}
                  </span>

                  <TextReveal
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
                    href="/shop"
                    className="px-5 py-3.5 rounded-md border border-[#D4B895] bg-white hover:bg-[#1F1A17] hover:text-white hover:border-[#1F1A17] text-xs sm:text-sm font-medium text-[#1F1A17] transition-all duration-200"
                  >
                    Browse All Categories
                  </Link>
                </div>
              </div>

              {/* Three Clear Positioning Pillars */}
              <div className="grid grid-cols-3 gap-4 pt-8 mt-10 border-t border-[#E6DACB]">
                <div>
                  <span className="text-xs text-[#7A491D] font-medium block">
                    Corporate Base
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
                    Nigeria
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#7A491D] font-medium block">
                    Delivery Reach
                  </span>
                  <span className="text-sm font-semibold text-[#1F1A17] mt-0.5 block">
                    West &amp; East Africa + Global
                  </span>
                </div>
              </div>
            </div>

            {/* Right 6 Columns: Official Macklemore Photography with CurtainImage */}
            <div className="lg:col-span-6 relative bg-[#F3EAE0] min-h-[460px] sm:min-h-[580px] flex flex-col justify-end overflow-hidden">
              <CurtainImage
                key={activeSlide.image}
                src={activeSlide.image}
                alt={activeSlide.headline}
                priority
                aspectClass="h-full w-full"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className=" !absolute inset-0"
              />

              {/* Floating Warm Caption Card */}
              <div className="relative z-10 m-5 sm:m-6 p-4 rounded-lg bg-[#FFFDF9]/95 backdrop-blur-md border border-[#EADFD0] shadow-md flex items-center justify-between gap-4 max-w-md ml-auto">
                <div>
                  <span className="text-[11px] font-semibold text-[#E31E24] block">
                    {activeSlide.captionTitle}
                  </span>
                  <p className="font-display text-xs sm:text-sm font-medium text-[#1F1A17] mt-0.5">
                    {activeSlide.captionSub}
                  </p>
                </div>
                <img
                  src={activeSlide.secondaryImage}
                  alt="Collection detail"
                  className="w-14 h-16 object-cover object-top rounded-md border border-[#EADFD0] shrink-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. SHOP BY CATEGORY (ALL 6 OFFICIAL CATEGORIES FROM MACKLEMOREFASHIONS.COM)
         ===================================================================== */}
      <section className="py-14 sm:py-20 bg-[#FFFDF9]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
                Official Store Departments
              </span>
              <TextReveal
                text="Shop by Category"
                as="h2"
                className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F1A17] mt-1"
              />
            </div>
            <Link
              href="/shop"
              className="editorial-link text-sm font-medium text-[#7A491D] hover:text-[#E31E24] transition-colors"
            >
              View All {products.length} Items →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SHOP_CATEGORY_CARDS.map((card, idx) => (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-lg overflow-hidden border border-[#EADFD0] bg-white transform-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#D4B895] flex flex-col justify-between"
              >
                <CurtainImage
                  src={card.image}
                  alt={card.title}
                  aspectClass="aspect-square"
                  delay={(idx % 3) * 0.05}
                  duration={1.1}
                >
                  <span className="absolute top-3 left-3 z-10 bg-[#FFFDF9]/90 backdrop-blur-xs border border-[#EADFD0] rounded-md px-2.5 py-1 text-xs font-medium text-[#7A491D]">
                    {card.tag}
                  </span>
                </CurtainImage>
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
          3. INTERACTIVE CATALOG SHOWCASE (WITH REAL PHOTOS & PRICES)
         ===================================================================== */}
      <section className="py-14 sm:py-20 bg-[#FAF5EE] border-y border-[#EADFD0]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
                Ready-to-Wear, Accessories &amp; Fabrics
              </span>
              <TextReveal
                text="Featured Collection"
                as="h2"
                className="font-display text-2xl sm:text-4xl font-semibold tracking-tight text-[#1F1A17] mt-1"
              />
            </div>
            <Link
              href="/shop"
              className="px-5 py-2.5 rounded-md bg-[#1F1A17] text-white hover:bg-[#E31E24] text-xs font-medium tracking-wide transition-colors self-start md:self-auto"
            >
              Open Full Shop ({products.length} Items) →
            </Link>
          </div>

          {/* Interactive Category Switcher Pills with layoutId Spring Indicator */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {HOME_FILTER_TABS.map((tab) => {
              const isActive = homeCategory === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setHomeCategory(tab.value)}
                  className={`relative px-3.5 py-2 rounded-md text-xs font-medium border transition-colors duration-200 cursor-pointer overflow-hidden ${
                    isActive
                      ? "border-[#1F1A17] text-white shadow-2xs"
                      : "border-[#E2D6C5] bg-white text-[#5C5147] hover:border-[#7A491D] hover:text-[#1F1A17]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="home-category-tab"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="absolute inset-0 bg-[#1F1A17] rounded-[5px]"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <TribalSectionSeparator
            label={
              homeCategory === "ALL"
                ? "Showing Featured Pieces Across All Categories"
                : `Category: ${homeCategory}`
            }
            className="my-6"
          />

          <Suspense fallback={<CatalogGridSuspenseFallback count={6} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {displayedProducts.map((product, index) => (
                <EditorialProductCard
                  key={`${homeCategory}-${product.id}`}
                  product={product}
                  theme="light"
                  index={index}
                />
              ))}
            </div>
          </Suspense>
        </div>
      </section>

      {/* =====================================================================
          4. PARTNER BRANDS & REPRESENTED HOUSES (DEJI & KOLA + LUCA)
         ===================================================================== */}
      <section className="py-16 sm:py-20 bg-[#FFFDF9] relative overflow-hidden">
        <TribalCornerWatermark position="bottom-right" opacity={0.04} />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
                Brand Representation &amp; Curated Houses
              </span>
              <TextReveal
                text="Our Brands & Partner Houses"
                as="h2"
                className="font-display text-2xl sm:text-3xl font-semibold text-[#1F1A17] mt-1"
              />
            </div>
            <Link
              href="/brands"
              className="text-sm font-medium text-[#7A491D] hover:text-[#E31E24] transition-colors"
            >
              Explore All Brands →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {brands.map((brand, idx) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="group rounded-lg border border-[#EADFD0] bg-white overflow-hidden transform-gpu hover:-translate-y-1 hover:shadow-lg hover:border-[#D4B895] transition-all duration-300 flex flex-col justify-between"
              >
                <CurtainImage
                  src={brand.lookbookBannerUrl}
                  alt={brand.name}
                  aspectClass="aspect-[4/3]"
                  delay={(idx % 4) * 0.05}
                  duration={1.1}
                >
                  <span className="absolute top-3 left-3 z-10 bg-[#FFFDF9]/90 backdrop-blur-xs border border-[#EADFD0] rounded-md px-2.5 py-1 text-[11px] font-medium text-[#7A491D]">
                    {brand.originCity}
                  </span>
                </CurtainImage>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[#1F1A17] group-hover:text-[#E31E24] transition-colors">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-[#6E6359] line-clamp-2 mt-1.5 leading-relaxed">
                      {brand.tagline}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-[#7A491D] group-hover:text-[#E31E24] mt-4 pt-3 border-t border-[#F2EAE0] block">
                    Enter Brand Page →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Spotlight on Deji & Kola and LUCA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-[#EADFD0] bg-[#FAF5EE] p-6 sm:p-8 flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <span className="inline-block px-2.5 py-1 rounded-md bg-[#7A491D]/10 text-[#7A491D] text-xs font-medium">
                  Nigerian Tailoring Spotlight
                </span>
                <h3 className="font-display text-2xl font-semibold text-[#1F1A17]">
                  {dejiBrand.name}
                </h3>
                <p className="text-sm text-[#5C5147] leading-relaxed">
                  {dejiBrand.story}
                </p>
              </div>
              <Link
                href={`/brands/${dejiBrand.slug}`}
                className="self-start px-5 py-2.5 rounded-md bg-[#1F1A17] hover:bg-[#E31E24] text-white text-xs font-medium transition-colors"
              >
                Explore {dejiBrand.name} →
              </Link>
            </div>

            <div className="rounded-lg border border-[#EADFD0] bg-[#FAF5EE] p-6 sm:p-8 flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <span className="inline-block px-2.5 py-1 rounded-md bg-[#E31E24]/10 text-[#E31E24] text-xs font-medium">
                  International Partner Spotlight
                </span>
                <h3 className="font-display text-2xl font-semibold text-[#1F1A17]">
                  {lucaBrand.name}
                </h3>
                <p className="text-sm text-[#5C5147] leading-relaxed">
                  {lucaBrand.story}
                </p>
              </div>
              <Link
                href={`/brands/${lucaBrand.slug}`}
                className="self-start px-5 py-2.5 rounded-md bg-[#1F1A17] hover:bg-[#E31E24] text-white text-xs font-medium transition-colors"
              >
                Explore {lucaBrand.name} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. OUR MARKETS & INTERNATIONAL REACH MAP
         ===================================================================== */}
      <ContinentalMapBanner />

      {/* =====================================================================
          6. CLIENT VOICES & B2B BRAND PARTNERSHIPS INVITATION
         ===================================================================== */}
      <section className="py-16 sm:py-20 bg-[#FFFDF9]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-16">
          {/* Authentic Customer & Red Carpet Testimonials from macklemorefashions.com */}
          <div>
            <div className="mb-8">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
                Client Reviews &amp; Red Carpet Moments
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1F1A17] mt-1">
                Worn With Pride Across Global Stages
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border border-[#EADFD0] bg-white flex flex-col justify-between gap-4 shadow-2xs">
                <p className="text-sm text-[#5C5147] leading-relaxed italic">
                  &ldquo;Wearing Macklemore Fashions on the red carpet was the perfect way to mark a milestone moment in my career. The outfit made a statement before I even spoke: regal, powerful, and full of cultural pride.&rdquo;
                </p>
                <div className="pt-3 border-t border-[#F2EAE0]">
                  <div className="font-display text-sm font-semibold text-[#1F1A17]">
                    Kosa Akaraiwe
                  </div>
                  <div className="text-xs text-[#7A491D]">
                    Lead Actor · &ldquo;Live Coach&rdquo; by Patricia · Award Ceremony Guest
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-[#EADFD0] bg-white flex flex-col justify-between gap-4 shadow-2xs">
                <p className="text-sm text-[#5C5147] leading-relaxed italic">
                  &ldquo;Wearing Macklemore to the Africa International Film Festival (AFRIFF) was the perfect choice. The outfit was sharp, modern, and completely me. It gave me that extra confidence to show up and represent with style.&rdquo;
                </p>
                <div className="pt-3 border-t border-[#F2EAE0]">
                  <div className="font-display text-sm font-semibold text-[#1F1A17]">
                    Emmkab
                  </div>
                  <div className="text-xs text-[#7A491D]">
                    MC &amp; Public Figure · AFRIFF Guest &amp; Excellence Award Host
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-[#EADFD0] bg-white flex flex-col justify-between gap-4 shadow-2xs">
                <p className="text-sm text-[#5C5147] leading-relaxed italic">
                  &ldquo;Wearing this piece by Macklemore Fashions made me feel powerful, elegant, and unforgettable. Every detail was flawless: the fit, the fabric, the finish. It was a true statement of luxury.&rdquo;
                </p>
                <div className="pt-3 border-t border-[#F2EAE0]">
                  <div className="font-display text-sm font-semibold text-[#1F1A17]">
                    Miss Esther &amp; Keshary
                  </div>
                  <div className="text-xs text-[#7A491D]">
                    Editorial Campaign Models · Toronto &amp; Lagos
                  </div>
                </div>
              </div>
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
