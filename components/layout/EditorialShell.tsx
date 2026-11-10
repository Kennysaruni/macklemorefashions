"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { usePlatform } from "@/lib/platform-context";
import {
  CURRENCIES,
  CurrencyCode,
  convertPrice,
  formatCurrencyValue,
  calculateLogisticsForDestination,
} from "@/lib/store-data";
import {
  MacklemoreLogo,
  TribalPatternRibbon,
  MacklemoreMenuToggleIcon,
  MacklemoreBagIcon,
  MacklemoreCurrencyIcon,
} from "@/components/vectors/TribalVectors";
import { EditorialDrawer } from "@/components/motion/MotionPrimitives";

const PRIMARY_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/brands", label: "Brands" },
  { href: "/our-story", label: "Our Story" },
  { href: "/partnerships", label: "Partnerships" },
  { href: "/markets", label: "Our Markets" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

const MOBILE_ACCORDION_GROUPS = [
  {
    id: "shop",
    label: "Shop",
    items: [
      { href: "/shop", label: "All Shop Catalog" },
      { href: "/collections", label: "Featured Collections" },
      { href: "/shop?category=Men+Wears", label: "Men Wears" },
      { href: "/shop?category=Male+Accessories", label: "Male Accessories" },
      { href: "/shop?category=Women+Wears", label: "Women Wears" },
      { href: "/shop?category=Female+Accessories", label: "Female Accessories" },
      { href: "/shop?category=Kids+Wears", label: "Kids Wears" },
      { href: "/shop?category=Fabrics", label: "Prints & Fabrics" },
    ],
  },
  {
    id: "company",
    label: "Company",
    items: [
      { href: "/brands", label: "Our Brands" },
      { href: "/brands/luca", label: "Partner Brand: LUCA" },
      { href: "/brands/deji-and-kola", label: "Partner Brand: Deji & Kola" },
      { href: "/our-story", label: "Our Story" },
      { href: "/partnerships", label: "Brand Partnerships" },
      { href: "/markets", label: "Our Markets" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    items: [
      { href: "/journal", label: "Journal & Stories" },
      { href: "/contact", label: "Contact & Showrooms" },
    ],
  },
];

export function EditorialShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    currency,
    setCurrency,
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartCount,
  } = usePlatform();

  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>("shop");
  const [reservationSent, setReservationSent] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const currencyMenuRef = useRef<HTMLDivElement>(null);

  // Track scroll position & calculate 0..1 scroll progress for circular progress ring
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const shouldShow = y > 240;
      setShowBackToTop((prev) => (prev !== shouldShow ? shouldShow : prev));

      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const ratio = Math.min(1, Math.max(0, y / maxScroll));
      setScrollProgress(ratio);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Lock main page scrolling while mobile menu or shopping bag drawer is open
  useEffect(() => {
    if (isMobileMenuOpen || isCartOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isMobileMenuOpen, isCartOpen]);

  // Close currency menu on outside click
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        currencyMenuRef.current &&
        !currencyMenuRef.current.contains(e.target as Node)
      ) {
        setIsCurrencyMenuOpen(false);
      }
    };
    if (isCurrencyMenuOpen) {
      document.addEventListener("mousedown", onClickOutside);
    }
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isCurrencyMenuOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cartSubtotal = cart.reduce(
    (acc, item) =>
      acc + convertPrice(item.product, currency) * item.quantity,
    0
  );

  const sampleCountry = CURRENCIES[currency].sampleCountryIso;
  const logisticsEstimate = calculateLogisticsForDestination(
    sampleCountry,
    currency,
    cartSubtotal
  );

  const handleBagReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setReservationSent(true);
    setTimeout(() => {
      clearCart();
    }, 400);
  };

  const circleCircumference = 2 * Math.PI * 25.5; // r = 25.5 inside 60x60 viewBox
  const strokeDashoffset = circleCircumference * (1 - scrollProgress);

  // For Admin studio & login routes, bypass customer storefront shell to prevent duplicate navbars & footers
  if (pathname?.startsWith("/admin")) {
    return <div className="min-h-screen w-full bg-[#FFFDF9] text-[#1F1A17]">{children}</div>;
  }

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-clip flex flex-col bg-[#FFFDF9] text-[#1F1A17]">
      {/* Multi-color Tribal Ribbon Accent (Infinite Left-to-Right Motion) */}
      <TribalPatternRibbon />

      {/* 1. Compact Welcome Ribbon */}
      <div className="w-full bg-[#FAF5EE] text-[#5C5147] border-b border-[#EADFD0] px-4 sm:px-8 py-1.5 text-[11px] sm:text-xs flex items-center justify-between gap-2 z-50">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-block w-1.5 h-1.5 rotate-45 bg-[#E31E24] shrink-0" />
          <span className="font-medium text-[#1F1A17] truncate">
            Toronto, Canada · Nigeria
          </span>
          <span className="hidden md:inline text-[#7D7065] truncate">
            · Connecting international luxury &amp; African fashion across global markets
          </span>
        </div>

        <Link
          href="/partnerships"
          className="hidden sm:inline-block shrink-0 text-[11px] font-medium text-[#7A491D] hover:text-[#E31E24] transition-colors"
        >
          Brand Partnerships →
        </Link>
      </div>

      {/* 2. Sticky Header (Remains Visible Above the Mobile Menu so Logo & Cart Stay Accessible) */}
      <header className="sticky top-0 z-50 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EADFD0]">
        <div className="max-w-[1440px] mx-auto px-3.5 sm:px-8 h-18 sm:h-22 lg:h-24 flex items-center justify-between gap-2 sm:gap-6">
          {/* Left: Official Macklemore Logo */}
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="shrink-0 transition-transform duration-200 hover:scale-[1.02]"
          >
            <MacklemoreLogo theme="light" showSubline={false} />
          </Link>

          {/* Center: Clean Minimalist Navigation with layoutId Gliding Indicator */}
          <nav
            aria-label="Primary Navigation"
            className="hidden xl:flex items-center gap-7"
          >
            {PRIMARY_NAV_LINKS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors py-1.5 ${
                    isActive
                      ? "text-[#E31E24] font-semibold"
                      : "text-[#1F1A17] hover:text-[#7A491D]"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="primary-nav-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-[#E31E24] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Compact Currency Toggle + Borderless/Background-Free Cart & Morphing Hamburger/X */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Compact & Elegant Currency Popover Switcher */}
            <div ref={currencyMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsCurrencyMenuOpen((prev) => !prev)}
                aria-label="Select currency"
                aria-expanded={isCurrencyMenuOpen}
                className="h-9 px-2.5 rounded-md bg-[#FAF5EE]/80 hover:bg-white border border-[#E2D6C5]/80 hover:border-[#D4860B] text-[#1F1A17] text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5"
              >
                <MacklemoreCurrencyIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="tracking-tight">{currency}</span>
                <span
                  className={`text-[9px] text-[#7A491D] transition-transform duration-200 ${
                    isCurrencyMenuOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>

              <AnimatePresence>
                {isCurrencyMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-2 w-40 rounded-lg border border-[#E2D6C5] bg-[#FFFDF9]/98 backdrop-blur-md shadow-xl p-1.5 z-50"
                  >
                    {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                      const cfg = CURRENCIES[code];
                      const isSelected = currency === code;
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            setCurrency(code);
                            setIsCurrencyMenuOpen(false);
                          }}
                          className={`w-full px-3 py-2 rounded-md text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[#1F1A17] text-white font-semibold"
                              : "text-[#1F1A17] hover:bg-[#FAF5EE]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`w-1.5 h-1.5 rotate-45 ${
                                isSelected ? "bg-[#D4860B]" : "bg-[#D4B895]"
                              }`}
                            />
                            <span>{cfg.code}</span>
                          </span>
                          <span
                            className={`text-[11px] ${
                              isSelected ? "text-[#D4860B]" : "text-[#7A491D]"
                            }`}
                          >
                            {cfg.symbol.replace(cfg.code, "").trim() || "$"}
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Borderless, Background-Free Iconic Shopping Bag Button */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setReservationSent(false);
                setIsCartOpen(true);
              }}
              aria-label={`Shopping bag with ${cartCount} items`}
              className="relative p-2 bg-transparent border-none text-[#1F1A17] hover:text-[#E31E24] transition-colors duration-200 cursor-pointer flex items-center justify-center"
            >
              <MacklemoreBagIcon className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
              <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#E31E24] text-white text-[10px] font-bold flex items-center justify-center shadow-2xs">
                {cartCount}
              </span>
            </button>

            {/* Borderless, Background-Free Morphing Hamburger <-> X Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={
                isMobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={isMobileMenuOpen}
              className="xl:hidden p-2 bg-transparent border-none flex items-center justify-center cursor-pointer"
            >
              <MacklemoreMenuToggleIcon
                isOpen={isMobileMenuOpen}
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>

        {/* Sub-Bar: Active Shop Categories from macklemorefashions.com (Desktop) */}
        <div className="hidden md:block border-t border-[#F0E6D8] bg-[#FAF5EE]/60">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-2 flex items-center justify-between text-xs text-[#5C5147]">
            <div className="flex items-center gap-6">
              <Link
                href="/shop?category=Men+Wears"
                className="hover:text-[#E31E24] transition-colors font-medium text-[#1F1A17]"
              >
                Men Wears
              </Link>
              <Link
                href="/shop?category=Male+Accessories"
                className="hover:text-[#E31E24] transition-colors"
              >
                Male Accessories
              </Link>
              <Link
                href="/shop?category=Women+Wears"
                className="hover:text-[#E31E24] transition-colors font-medium text-[#1F1A17]"
              >
                Women Wears
              </Link>
              <Link
                href="/shop?category=Female+Accessories"
                className="hover:text-[#E31E24] transition-colors"
              >
                Female Accessories
              </Link>
              <Link
                href="/shop?category=Kids+Wears"
                className="hover:text-[#E31E24] transition-colors"
              >
                Kids Wears
              </Link>
              <Link
                href="/shop?category=Fabrics"
                className="hover:text-[#E31E24] transition-colors"
              >
                Prints &amp; Fabrics
              </Link>
            </div>
            <Link
              href="/brands/luca"
              className="text-[#7A491D] font-medium hover:text-[#E31E24] transition-colors"
            >
              Featured Partner: LUCA →
            </Link>
          </div>
        </div>

        {/* Semi-Transparent Mobile Menu with Accordion Dropdowns (Logo & Cart remain visible in Header above) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Subtle Backdrop to close when tapping outside */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-x-0 top-16 sm:top-20 bottom-0 bg-[#1F1A17]/25 backdrop-blur-[2px] xl:hidden z-40"
              />

              {/* Semi-Transparent Accordion Menu Panel */}
              <motion.div
                data-native-scroll="true"
                data-lenis-prevent
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 right-0 top-full xl:hidden z-50 max-h-[calc(100dvh-5rem)] overflow-y-auto bg-[#FFFDF9]/90 backdrop-blur-md border-b border-[#EADFD0] shadow-xl px-4 py-4"
              >
                <div className="max-w-lg mx-auto divide-y divide-[#EADFD0]/80">
                  {/* Direct Home Link */}
                  <div className="py-1">
                    <Link
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-2.5 px-2 text-sm font-semibold transition-colors ${
                        pathname === "/"
                          ? "text-[#E31E24]"
                          : "text-[#1F1A17] hover:text-[#7A491D]"
                      }`}
                    >
                      <span>Home</span>
                      <span className="text-xs text-[#7A491D]">→</span>
                    </Link>
                  </div>

                  {/* Collapsible Dropdown Groups: Shop, Company, Resources */}
                  {MOBILE_ACCORDION_GROUPS.map((group) => {
                    const isExpanded = openMobileGroup === group.id;
                    return (
                      <div key={group.id} className="py-1">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMobileGroup(isExpanded ? null : group.id)
                          }
                          className="w-full flex items-center justify-between py-2.5 px-2 text-sm font-semibold text-[#1F1A17] hover:text-[#7A491D] transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rotate-45 bg-[#D4860B]" />
                            <span>{group.label}</span>
                          </span>
                          <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.25 }}
                            className="text-xs text-[#7A491D]"
                          >
                            ▾
                          </motion.span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: 0.3,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="overflow-hidden"
                            >
                              <div className="pl-5 pr-2 pb-2.5 pt-1 grid grid-cols-1 gap-1">
                                {group.items.map((item) => (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="py-2 px-3 rounded-md text-xs font-medium text-[#5C5147] hover:text-[#E31E24] hover:bg-[#FAF5EE]/90 flex items-center justify-between transition-colors"
                                  >
                                    <span>{item.label}</span>
                                    <span className="text-[10px] text-[#8C7E71]">
                                      →
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* 3. Main Page Content */}
      <main className="flex-1 w-full max-w-[100vw] overflow-x-clip">
        {children}
      </main>

      {/* Circular Scroll-Progress Back to Top Button with Tribal Pattern Border */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-5 right-4 sm:right-6 z-40 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFFDF9]/95 backdrop-blur-md shadow-xl flex items-center justify-center cursor-pointer group transform-gpu hover:scale-105 transition-transform duration-200"
          >
            {/* Circular SVG Scroll Progress Ring with Macklemore Tribal Pattern */}
            <svg
              viewBox="0 0 60 60"
              className="absolute inset-0 w-full h-full -rotate-90"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="macklemore-scroll-tribal-pattern"
                  x="0"
                  y="0"
                  width="12"
                  height="12"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="12" height="12" fill="#7A491D" />
                  <path d="M0 12L6 0L12 12H8.5L6 5.5L3.5 12H0Z" fill="#E31E24" />
                  <polygon points="6,1 11,6 6,11 1,6" fill="#D4860B" />
                  <polygon points="6,3 9,6 6,9 3,6" fill="#1A7A6E" />
                  <polygon points="6,4.5 7.5,6 6,7.5 4.5,6" fill="#FFFDF9" />
                  <polygon points="0,0 3.5,0 0,3.5" fill="#E05C1A" />
                  <polygon points="12,0 8.5,0 12,3.5" fill="#E05C1A" />
                </pattern>
              </defs>
              {/* Subtle Track Circle */}
              <circle
                cx="30"
                cy="30"
                r="25.5"
                fill="none"
                stroke="#EADFD0"
                strokeWidth="4.6"
              />
              {/* Dynamic Tribal-Pattern Scroll Progress Circle */}
              <circle
                cx="30"
                cy="30"
                r="25.5"
                fill="none"
                stroke="url(#macklemore-scroll-tribal-pattern)"
                strokeWidth="5.4"
                strokeLinecap="butt"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-[stroke-dashoffset] duration-150 ease-out"
              />
            </svg>

            {/* Centered Upward Arrow Icon (No Percentage Text) */}
            <div className="relative z-10 flex items-center justify-center">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="w-5 h-5 text-[#1F1A17] group-hover:text-[#E31E24] group-hover:-translate-y-0.5 transition-all duration-200"
                aria-hidden="true"
              >
                <path
                  d="M10 15.5V4.5M10 4.5L5.25 9.25M10 4.5L14.75 9.25"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 4. Compact, Refined Luxury Footer (Without Specific Street Locations) */}
      <footer className="bg-[#FAF5EE] text-[#1F1A17] border-t border-[#EADFD0] mt-12">
        <TribalPatternRibbon />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 sm:pb-7 border-b border-[#EADFD0]">
            <div className="space-y-2.5 max-w-2xl">
              <MacklemoreLogo showSubline theme="light" />
              <p className="text-xs sm:text-sm text-[#5C5147] leading-relaxed">
                A Canadian-based fashion company in Toronto, Canada with operational presence in Nigeria, curating authentic African luxury and delivering to customers and partner brands across West Africa, East Africa, and global markets.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                href="/shop"
                className="px-4 py-2.5 rounded-md bg-[#1F1A17] hover:bg-[#E31E24] text-white text-xs font-medium transition-colors"
              >
                Explore Shop
              </Link>
              <Link
                href="/partnerships"
                className="px-4 py-2.5 rounded-md border border-[#D4B895] bg-[#FFFDF9] hover:bg-[#1F1A17] hover:text-white text-xs font-medium text-[#1F1A17] transition-colors"
              >
                Brand Partnerships
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2.5 rounded-md border border-[#EADFD0] bg-[#FFFDF9] hover:border-[#7A491D] text-xs font-medium text-[#5C5147] hover:text-[#1F1A17] transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] sm:text-xs text-[#7D7065]">
            <span>
              © 2026 Macklemore Fashion Inc. (Toronto, Canada · Nigeria). All rights reserved.
            </span>
            <span className="text-[#7A491D] font-medium">
              Premium Fashion · International Credibility · African Market Reach
            </span>
          </div>
        </div>
      </footer>

      {/* 5. Shopping Bag Drawer (Fits Mobile Screen Cleanly Without Horizontal Scroll) */}
      <EditorialDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        title={`Shopping Bag (${cartCount})`}
        subtitle={`Prices shown in ${currency}`}
        widthClass="max-w-md"
      >
        {reservationSent ? (
          <div className="p-6 sm:p-8 text-center space-y-4 my-auto">
            <div className="w-12 h-12 rounded-full bg-[#2E6B4E]/10 text-[#2E6B4E] flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h4 className="font-display text-xl font-semibold text-[#1F1A17]">
              Selection Reserved
            </h4>
            <p className="text-sm text-[#5C5147] leading-relaxed">
              Thank you. Our client concierge team in Lagos and Toronto has received your reservation request{guestEmail ? ` for ${guestEmail}` : ""} and will follow up shortly with delivery details.
            </p>
            <button
              type="button"
              onClick={() => {
                setReservationSent(false);
                setIsCartOpen(false);
              }}
              className="px-6 py-3 rounded-md bg-[#1F1A17] text-white text-xs font-medium hover:bg-[#E31E24] transition-colors cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FAF5EE] border border-[#EADFD0] text-[#1F1A17] flex items-center justify-center mx-auto">
              <MacklemoreBagIcon className="w-5 h-5" />
            </div>
            <p className="text-sm text-[#5C5147]">
              Your shopping bag is currently empty.
            </p>
            <Link
              href="/shop"
              onClick={() => setIsCartOpen(false)}
              className="inline-block px-6 py-3 rounded-md bg-[#1F1A17] text-white text-xs font-medium hover:bg-[#E31E24] transition-colors"
            >
              Explore the Shop
            </Link>
          </div>
        ) : (
          <div className="flex flex-col justify-between h-full">
            <div className="divide-y divide-[#EADFD0]">
              {cart.map((item) => {
                const unitPrice = convertPrice(item.product, currency);
                return (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="p-4 sm:p-5 flex gap-3.5 bg-white"
                  >
                    <img
                      src={item.product.editorialImageUrl}
                      alt={item.product.title}
                      className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-md border border-[#EADFD0] shrink-0 bg-[#FAF5EE]"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs text-[#7A491D] font-medium truncate">
                            {item.product.brandName}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.product.id, item.size)
                            }
                            className="text-xs text-[#8C7E71] hover:text-[#E31E24] transition-colors cursor-pointer shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                        <h4 className="font-display text-sm font-semibold text-[#1F1A17] mt-0.5 line-clamp-2">
                          {item.product.title}
                        </h4>
                        <span className="text-xs text-[#7D7065] block mt-0.5 truncate">
                          Size: {item.size} · {item.product.colorName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F0E6D8]">
                        <div className="flex items-center rounded-md border border-[#E2D6C5] bg-[#FAF5EE] overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.size, -1)
                            }
                            className="px-2.5 py-1 text-xs text-[#1F1A17] hover:bg-[#EADFD0] cursor-pointer"
                          >
                            −
                          </button>
                          <span className="px-2.5 py-1 text-xs font-medium text-[#1F1A17]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.size, 1)
                            }
                            className="px-2.5 py-1 text-xs text-[#1F1A17] hover:bg-[#EADFD0] cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-[#1F1A17]">
                          {formatCurrencyValue(
                            unitPrice * item.quantity,
                            currency
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bag Summary & Direct Concierge Reservation */}
            <div className="p-4 sm:p-6 bg-[#FAF5EE] border-t border-[#EADFD0] space-y-4">
              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between text-[#5C5147]">
                  <span>Subtotal</span>
                  <span>{formatCurrencyValue(cartSubtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-[#5C5147] gap-2">
                  <span className="truncate">
                    Est. Shipping ({logisticsEstimate.estimatedTransitDays})
                  </span>
                  <span className="shrink-0">
                    {formatCurrencyValue(
                      logisticsEstimate.shippingFee,
                      currency
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-semibold text-[#1F1A17] pt-2 border-t border-[#EADFD0]">
                  <span>Estimated Total</span>
                  <span className="text-[#E31E24]">
                    {formatCurrencyValue(
                      cartSubtotal + logisticsEstimate.shippingFee,
                      currency
                    )}
                  </span>
                </div>
              </div>

              <form onSubmit={handleBagReservation} className="space-y-2.5 pt-1">
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Enter your email to reserve items"
                  className="w-full px-3.5 py-2.5 rounded-md bg-white border border-[#E2D6C5] text-xs text-[#1F1A17] focus:border-[#7A491D] outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-md bg-[#1F1A17] hover:bg-[#E31E24] text-white text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer shadow-xs"
                >
                  Reserve Selection with Concierge →
                </button>
              </form>
            </div>
          </div>
        )}
      </EditorialDrawer>
    </div>
  );
}
