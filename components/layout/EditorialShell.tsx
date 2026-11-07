"use client";

import React, { useEffect, useState } from "react";
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

  const [isCurrencyDrawerOpen, setIsCurrencyDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [reservationSent, setReservationSent] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const shouldShow = window.scrollY > 320;
      setShowBackToTop((prev) => (prev !== shouldShow ? shouldShow : prev));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#1F1A17]">
      {/* Multi-color Tribal Ribbon Accent */}
      <TribalPatternRibbon />

      {/* 1. Warm Top Welcome & Currency Bar */}
      <div className="w-full bg-[#FAF5EE] text-[#5C5147] border-b border-[#EADFD0] px-4 sm:px-8 py-2 text-xs flex flex-wrap items-center justify-between gap-2 z-40">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#D4860B]" />
          <span className="font-medium text-[#1F1A17]">
            Canadian-Based · Lagos Operations
          </span>
          <span className="hidden md:inline text-[#7D7065]">
            — Connecting international luxury &amp; African fashion across West Africa, East Africa &amp; global markets
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsCurrencyDrawerOpen(true)}
            className="px-2.5 py-1 rounded-md bg-white border border-[#E2D6C5] hover:border-[#7A491D] text-[#1F1A17] text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span className="text-[#7A491D] font-semibold">{currency}</span>
            <span>({CURRENCIES[currency].symbol})</span>
            <span className="text-[10px] text-[#8C7E71]">▾</span>
          </button>
        </div>
      </div>

      {/* 2. Warm Minimalist Header */}
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EADFD0]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-6">
          {/* Left: Official Macklemore Logo */}
          <Link href="/" className="shrink-0 transition-transform duration-200 hover:scale-[1.02]">
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

          {/* Right: Quick Segment Links + Shopping Bag + Mobile Menu */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/brands/luca"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-[#E2D6C5] bg-[#FAF5EE] hover:bg-[#F3EAE0] hover:border-[#D4860B] text-xs font-medium text-[#7A491D] transition-all duration-200"
            >
              <span>Featured:</span>
              <span className="font-semibold text-[#1F1A17]">LUCA</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setReservationSent(false);
                setIsCartOpen(true);
              }}
              className="px-4 py-2.5 rounded-md bg-[#1F1A17] text-white hover:bg-[#E31E24] text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
            >
              Bag ({cartCount})
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden px-3.5 py-2.5 rounded-md border border-[#E2D6C5] bg-white text-xs font-medium text-[#1F1A17] hover:bg-[#FAF5EE] transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {/* Sub-Bar: Active Shop Categories from macklemorefashions.com */}
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
              href="/partnerships"
              className="text-[#7A491D] font-medium hover:text-[#E31E24] transition-colors"
            >
              Brand Representation &amp; African Distribution →
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
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A491D] block mb-2">
              Menu
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
                    className={`px-4 py-3 rounded-md border text-xs font-medium transition-colors flex items-center justify-between ${
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
      <main className="flex-1">{children}</main>

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
            className="fixed bottom-5 right-5 z-40 px-4 py-2.5 rounded-md bg-[#1F1A17] hover:bg-[#E31E24] text-white border border-[#D4860B]/40 shadow-lg flex items-center gap-2 text-xs font-medium transition-colors duration-200 cursor-pointer transform-gpu"
          >
            <span className="text-[#D4860B] font-bold">↑</span>
            <span>{pathname === "/shop" ? "Top & Filters" : "Back to Top"}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 4. Warm Multi-Column Footer */}
      <footer className="bg-[#FAF5EE] text-[#1F1A17] border-t border-[#EADFD0] mt-16">
        <TribalPatternRibbon />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#EADFD0]">
            {/* Brand Identity Column (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <MacklemoreLogo showSubline theme="light" />
              <p className="text-sm text-[#5C5147] leading-relaxed max-w-sm">
                A Canadian-based fashion company with operational headquarters in Lagos, Nigeria—curating premium fashion and connecting international brands with dynamic markets across West and East Africa.
              </p>
              <div className="text-xs text-[#7A491D] font-medium space-y-1 pt-1">
                <div>Canada HQ: King Street West, Toronto</div>
                <div>West Africa HQ: Victoria Island, Lagos</div>
                <div>East Africa Hub: Westlands, Nairobi</div>
              </div>
            </div>

            {/* Shopping & Categories (2 Cols) */}
            <div className="lg:col-span-2 space-y-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
                Shop Categories
              </span>
              <ul className="space-y-2.5 text-sm text-[#5C5147]">
                <li>
                  <Link href="/shop?category=Men+Wears" className="hover:text-[#E31E24] transition-colors">
                    Men Wears
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=Male+Accessories" className="hover:text-[#E31E24] transition-colors">
                    Male Accessories
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=Women+Wears" className="hover:text-[#E31E24] transition-colors">
                    Women Wears
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=Female+Accessories" className="hover:text-[#E31E24] transition-colors">
                    Female Accessories
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=Kids+Wears" className="hover:text-[#E31E24] transition-colors">
                    Kids Wears
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=Fabrics" className="hover:text-[#E31E24] transition-colors">
                    Prints &amp; Fabrics
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company & B2B Distribution (3 Cols) */}
            <div className="lg:col-span-3 space-y-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
                Company &amp; Partnerships
              </span>
              <ul className="space-y-2.5 text-sm text-[#5C5147]">
                <li>
                  <Link href="/our-story" className="hover:text-[#E31E24] transition-colors">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/partnerships" className="hover:text-[#E31E24] transition-colors">
                    Brand Partnerships &amp; Distribution
                  </Link>
                </li>
                <li>
                  <Link href="/markets" className="hover:text-[#E31E24] transition-colors">
                    Our Markets
                  </Link>
                </li>
                <li>
                  <Link href="/journal" className="hover:text-[#E31E24] transition-colors">
                    Journal &amp; Stories
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#E31E24] transition-colors">
                    Contact &amp; Showrooms
                  </Link>
                </li>
              </ul>
            </div>

            {/* Currency Switcher (3 Cols) */}
            <div className="lg:col-span-3 space-y-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
                Shopping Currency
              </span>
              <p className="text-xs text-[#5C5147] leading-relaxed">
                Preview pricing in your local currency across our North American, European, and African markets.
              </p>
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                  const isActive = currency === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setCurrency(code)}
                      className={`relative py-2 rounded-md border text-xs font-medium cursor-pointer transition-colors duration-200 overflow-hidden ${
                        isActive
                          ? "border-[#1F1A17] text-white shadow-xs"
                          : "border-[#E2D6C5] bg-white text-[#5C5147] hover:border-[#7A491D] hover:text-[#1F1A17]"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="footer-currency-pill"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                          }}
                          className="absolute inset-0 bg-[#1F1A17] rounded-[5px]"
                        />
                      )}
                      <span className="relative z-10">{code}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7D7065]">
            <span>
              © 2026 Macklemore Fashion Inc. (Canada · Nigeria). All rights reserved.
            </span>
            <span className="text-[#7A491D] font-medium">
              Premium Fashion · International Credibility · African Market Reach
            </span>
          </div>
        </div>
      </footer>

      {/* 5. Currency & Region Switcher Drawer */}
      <EditorialDrawer
        isOpen={isCurrencyDrawerOpen}
        onClose={() => setIsCurrencyDrawerOpen(false)}
        title="Select Your Currency"
        subtitle="International & Regional Pricing"
        widthClass="max-w-md"
      >
        <div className="p-6 space-y-4">
          <p className="text-sm text-[#5C5147] leading-relaxed">
            Choose your preferred currency to browse collections across Canada, the UK, Europe, Nigeria, Ghana, and Kenya.
          </p>

          <div className="space-y-2.5">
            {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
              const cfg = CURRENCIES[code];
              const isSelected = currency === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setCurrency(code);
                    setIsCurrencyDrawerOpen(false);
                  }}
                  className={`w-full p-4 rounded-lg border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "border-[#7A491D] bg-[#FAF5EE] shadow-xs"
                      : "border-[#EADFD0] bg-white hover:border-[#7A491D] hover:bg-[#FFFDF9]"
                  }`}
                >
                  <div>
                    <span className="text-xs text-[#7A491D] font-medium block">
                      {cfg.regionLabel}
                    </span>
                    <span className="font-display text-base font-semibold text-[#1F1A17] mt-0.5 block">
                      {cfg.code} — {cfg.label} ({cfg.symbol})
                    </span>
                  </div>
                  <span
                    className={`w-3.5 h-3.5 rounded-full border ${
                      isSelected
                        ? "bg-[#E31E24] border-[#E31E24]"
                        : "border-[#C5BEB3]"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </EditorialDrawer>

      {/* 6. Shopping Bag Drawer */}
      <EditorialDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        title={`Shopping Bag (${cartCount})`}
        subtitle={`Prices shown in ${currency}`}
        widthClass="max-w-lg"
      >
        {reservationSent ? (
          <div className="p-8 text-center space-y-4 my-auto">
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
                    className="p-5 flex gap-4 bg-white"
                  >
                    <img
                      src={item.product.editorialImageUrl}
                      alt={item.product.title}
                      className="w-20 h-24 object-cover rounded-md border border-[#EADFD0] shrink-0 bg-[#FAF5EE]"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs text-[#7A491D] font-medium">
                            {item.product.brandName}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.product.id, item.size)
                            }
                            className="text-xs text-[#8C7E71] hover:text-[#E31E24] transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                        <h4 className="font-display text-sm font-semibold text-[#1F1A17] mt-0.5">
                          {item.product.title}
                        </h4>
                        <span className="text-xs text-[#7D7065] block mt-0.5">
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
            <div className="p-6 bg-[#FAF5EE] border-t border-[#EADFD0] space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-[#5C5147]">
                  <span>Subtotal</span>
                  <span>{formatCurrencyValue(cartSubtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-[#5C5147]">
                  <span>Estimated Shipping ({logisticsEstimate.estimatedTransitDays})</span>
                  <span>
                    {formatCurrencyValue(
                      logisticsEstimate.shippingFee,
                      currency
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#1F1A17] pt-2 border-t border-[#EADFD0]">
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
