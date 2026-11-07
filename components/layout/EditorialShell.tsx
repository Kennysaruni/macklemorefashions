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
  MacklemoreHamburgerIcon,
  MacklemoreCloseIcon,
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
  const [reservationSent, setReservationSent] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const currencyMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const shouldShow = window.scrollY > 320;
      setShowBackToTop((prev) => (prev !== shouldShow ? shouldShow : prev));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-clip flex flex-col bg-[#FFFDF9] text-[#1F1A17]">
      {/* Multi-color Tribal Ribbon Accent (Infinite Left-to-Right Motion) */}
      <TribalPatternRibbon />

      {/* 1. Compact Welcome Ribbon */}
      <div className="w-full bg-[#FAF5EE] text-[#5C5147] border-b border-[#EADFD0] px-4 sm:px-8 py-1.5 text-[11px] sm:text-xs flex items-center justify-between gap-2 z-40">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-block w-1.5 h-1.5 rotate-45 bg-[#E31E24] shrink-0" />
          <span className="font-medium text-[#1F1A17] truncate">
            Canadian-Based · Lagos Operations
          </span>
          <span className="hidden md:inline text-[#7D7065] truncate">
            — Connecting international luxury &amp; African fashion across West Africa, East Africa &amp; global markets
          </span>
        </div>

        <Link
          href="/partnerships"
          className="hidden sm:inline-block shrink-0 text-[11px] font-medium text-[#7A491D] hover:text-[#E31E24] transition-colors"
        >
          Brand Partnerships →
        </Link>
      </div>

      {/* 2. Warm Minimalist Header with Iconic Controls */}
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EADFD0]">
        <div className="max-w-[1440px] mx-auto px-3.5 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-6">
          {/* Left: Official Macklemore Logo */}
          <Link
            href="/"
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

          {/* Right: Compact Luxury Currency Toggle + Iconic Bag Button + Custom Hamburger/X */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Compact & Elegant Currency Popover Switcher */}
            <div ref={currencyMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsCurrencyMenuOpen((prev) => !prev)}
                aria-label="Select currency"
                aria-expanded={isCurrencyMenuOpen}
                className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-md bg-[#FAF5EE] hover:bg-white border border-[#E2D6C5] hover:border-[#D4860B] text-[#1F1A17] text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs"
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

            {/* Iconic Shopping Bag Button */}
            <button
              type="button"
              onClick={() => {
                setReservationSent(false);
                setIsCartOpen(true);
              }}
              aria-label={`Shopping bag with ${cartCount} items`}
              className="h-9 sm:h-10 px-2.5 sm:px-3.5 rounded-md bg-[#1F1A17] text-white hover:bg-[#E31E24] text-xs font-medium transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex items-center gap-1.5"
            >
              <MacklemoreBagIcon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Bag</span>
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#D4860B] text-[#1F1A17] text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </button>

            {/* Custom Luxury Hamburger / X Toggle Button (Mobile & Tablet) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              className="xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-md border border-[#E2D6C5] bg-white hover:border-[#D4860B] hover:bg-[#FAF5EE] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xs"
            >
              {isMobileMenuOpen ? (
                <MacklemoreCloseIcon className="w-5 h-5" />
              ) : (
                <MacklemoreHamburgerIcon className="w-5 h-5" />
              )}
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
      </header>

      {/* Mobile Navigation Drawer (Weighted Non-Bouncy Bezier Curve) */}
      <EditorialDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="Macklemore Fashion"
        subtitle="Navigation & Shop Categories"
        widthClass="max-w-sm"
      >
        <div className="p-5 sm:p-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A491D] block mb-2">
              Navigation
            </span>
            <div className="grid grid-cols-1 gap-2">
              {PRIMARY_NAV_LINKS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-md border text-xs font-medium transition-colors flex items-center justify-between ${
                      isActive
                        ? "border-[#1F1A17] bg-[#1F1A17] text-white"
                        : "border-[#EADFD0] bg-[#FAF5EE] text-[#1F1A17] hover:border-[#E31E24] hover:bg-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span>→</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#EADFD0]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A491D] block mb-2">
              Shop Categories
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/shop?category=Men+Wears", label: "Men Wears" },
                { href: "/shop?category=Male+Accessories", label: "Male Accessories" },
                { href: "/shop?category=Women+Wears", label: "Women Wears" },
                { href: "/shop?category=Female+Accessories", label: "Female Accessories" },
                { href: "/shop?category=Kids+Wears", label: "Kids Wears" },
                { href: "/shop?category=Fabrics", label: "Prints & Fabrics" },
              ].map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-md border border-[#EADFD0] bg-white text-xs font-medium text-[#5C5147] hover:border-[#7A491D] hover:text-[#1F1A17] transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </EditorialDrawer>

      {/* 3. Main Page Content */}
      <main className="flex-1 w-full max-w-[100vw] overflow-x-clip">
        {children}
      </main>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={scrollToTop}
            aria-label="Scroll to top of page"
            className="fixed bottom-5 right-4 sm:right-5 z-40 px-3.5 py-2.5 rounded-md bg-[#1F1A17] hover:bg-[#E31E24] text-white border border-[#D4860B]/40 shadow-lg flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 cursor-pointer transform-gpu"
          >
            <span className="text-[#D4860B] font-bold">↑</span>
            <span>{pathname === "/shop" ? "Top & Filters" : "Top"}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 4. Compact, Refined Luxury Footer */}
      <footer className="bg-[#FAF5EE] text-[#1F1A17] border-t border-[#EADFD0] mt-12">
        <TribalPatternRibbon />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start lg:items-center pb-6 sm:pb-8 border-b border-[#EADFD0]">
            {/* Brand Identity (6 Cols) */}
            <div className="lg:col-span-6 space-y-2.5">
              <MacklemoreLogo showSubline theme="light" />
              <p className="text-xs sm:text-sm text-[#5C5147] leading-relaxed max-w-lg">
                A Canadian-based fashion company with operational headquarters in Lagos, Nigeria—curating authentic African luxury and connecting international brands across West Africa, East Africa, and global markets.
              </p>
            </div>

            {/* Global Hubs Pill Grid (6 Cols) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-md border border-[#EADFD0] bg-[#FFFDF9]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D4860B] block">
                  Canada HQ
                </span>
                <span className="text-xs font-semibold text-[#1F1A17] mt-0.5 block">
                  King St. West, Toronto
                </span>
              </div>
              <div className="p-3 rounded-md border border-[#EADFD0] bg-[#FFFDF9]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#E31E24] block">
                  West Africa HQ
                </span>
                <span className="text-xs font-semibold text-[#1F1A17] mt-0.5 block">
                  Victoria Island, Lagos
                </span>
              </div>
              <div className="p-3 rounded-md border border-[#EADFD0] bg-[#FFFDF9]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1A7A6E] block">
                  East Africa Hub
                </span>
                <span className="text-xs font-semibold text-[#1F1A17] mt-0.5 block">
                  Westlands, Nairobi
                </span>
              </div>
            </div>
          </div>

          <div className="pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] sm:text-xs text-[#7D7065]">
            <span>
              © 2026 Macklemore Fashion Inc. (Canada · Nigeria). All rights reserved.
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
