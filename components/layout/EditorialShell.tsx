"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MacklemoreLogo,
  TribalCornerWatermark,
  TribalSectionSeparator,
} from "@/components/vectors/TribalVectors";
import { EditorialDrawer } from "@/components/motion/MotionPrimitives";
import { usePlatform } from "@/lib/platform-context";
import {
  CURRENCIES,
  CurrencyCode,
  calculateLogisticsForDestination,
  convertPrice,
  formatCurrencyValue,
} from "@/lib/store-data";

const NAV_LINKS = [
  { href: "/shop", label: "SHOP" },
  { href: "/collections", label: "COLLECTIONS" },
  { href: "/brands", label: "BRANDS" },
  { href: "/brands/luca", label: "LUCA" },
  { href: "/partnerships", label: "B2B PARTNERSHIPS" },
  { href: "/markets", label: "MARKETS" },
  { href: "/journal", label: "JOURNAL" },
  { href: "/our-story", label: "OUR STORY" },
  { href: "/contact", label: "CONTACT" },
];

export function EditorialShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    currency,
    setCurrency,
    detectedRegion,
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartCount,
    vipTribalTeaserMode,
    setVipTribalTeaserMode,
    vipUnlockedByGuest,
    setVipUnlockedByGuest,
  } = usePlatform();

  const [isCurrencyDrawerOpen, setIsCurrencyDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [vipContactInput, setVipContactInput] = useState("");
  const [vipSubmitted, setVipSubmitted] = useState(false);

  const subtotalInActiveCurrency = cart.reduce(
    (sum, item) =>
      sum + convertPrice(item.product, currency) * item.quantity,
    0
  );

  const sampleCountry = CURRENCIES[currency].sampleCountryIso;
  const logistics = calculateLogisticsForDestination(
    sampleCountry,
    currency,
    subtotalInActiveCurrency
  );

  // If VIP Tribal Teaser Mode is enabled (and user isn't on /admin and hasn't unlocked preview)
  const showTeaserVault =
    vipTribalTeaserMode && !vipUnlockedByGuest && !pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0C] text-[#F6F5F1] selection:bg-[#E31E24] selection:text-white">
      {/* Top Technical Telemetry & Drop Ticker Bar */}
      <div className="border-b border-stone-800 bg-[#080809] text-[10px] font-mono uppercase tracking-[0.18em]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="inline-block w-1.5 h-1.5 bg-[#E31E24] shrink-0" />
            <span className="text-[#F6F5F1] truncate">
              [ DROP 04: HARMATTAN &amp; FROST // LIVE ALLOCATION ]
            </span>
            <span className="hidden xl:inline text-stone-500">
              // [ {detectedRegion} ]
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setVipUnlockedByGuest(false);
                setVipTribalTeaserMode(!vipTribalTeaserMode);
              }}
              className={`px-2 py-0.5 border transition-colors cursor-pointer ${
                vipTribalTeaserMode
                  ? "border-[#E05C1A] bg-[#E05C1A]/20 text-[#E05C1A]"
                  : "border-stone-800 text-stone-400 hover:border-[#D4860B] hover:text-[#D4860B]"
              }`}
            >
              [ VIP TEASER: {vipTribalTeaserMode ? "ON" : "OFF"} ]
            </button>
            <Link
              href="/admin"
              className={`px-2 py-0.5 border transition-colors ${
                pathname.startsWith("/admin")
                  ? "border-[#E31E24] bg-[#E31E24] text-white font-bold"
                  : "border-stone-800 text-[#D4860B] hover:border-[#D4860B]"
              }`}
            >
              [ /ADMIN CONSOLE ]
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Editorial Header */}
      <header className="sticky top-0 z-40 bg-[#0B0B0C]/95 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          {/* Left: Vector Brand Identity */}
          <Link href="/" className="shrink-0">
            <MacklemoreLogo showWordmark={true} showSubline={false} theme="dark" />
          </Link>

          {/* Center: Architectural Navigation */}
          <nav
            aria-label="Primary"
            className="hidden xl:flex items-center gap-5 font-mono text-[11px] tracking-[0.15em] uppercase"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-active={isActive}
                  className={`editorial-link py-1 transition-colors ${
                    isActive
                      ? "text-[#D4860B] font-semibold"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Multi-Currency Switcher & Side-Cart Trigger */}
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase">
            <button
              type="button"
              onClick={() => setIsCurrencyDrawerOpen(true)}
              className="px-3 py-2 border border-stone-800 hover:border-[#D4860B] text-stone-200 transition-colors cursor-pointer"
              title="Switch Currency & Regional Fulfillment Hub"
            >
              <span className="text-[#D4860B]">[</span> {CURRENCIES[currency].symbol}{" "}
              <span className="text-[#D4860B]">]</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="px-3.5 py-2 border border-stone-800 hover:border-[#E31E24] bg-[#121214] text-[#F6F5F1] transition-colors cursor-pointer"
            >
              [ BAG ({String(cartCount).padStart(2, "0")}) ]
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden px-3 py-2 border border-stone-800 hover:border-[#D4860B] text-stone-200 cursor-pointer"
              aria-label="Toggle Menu"
            >
              [ {isMobileMenuOpen ? "CLOSE" : "MENU"} ]
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Navigation Console */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-stone-800 bg-[#0B0B0C] px-4 sm:px-8 py-6 grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs uppercase">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 border border-stone-800 hover:border-[#D4860B] text-stone-200"
              >
                [ {link.label} ]
              </Link>
            ))}
            <Link
              href="/checkout"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 border border-[#E31E24] text-[#E31E24] font-bold"
            >
              [ CHECKOUT DESK ]
            </Link>
          </div>
        )}
      </header>

      {/* VIP Tribal Teaser Mode Vault ("We're Weaving Something Monumental") */}
      {showTeaserVault ? (
        <main className="relative flex-1 flex items-center justify-center py-20 px-4 overflow-hidden bg-[#0B0B0C]">
          <TribalCornerWatermark position="top-left" opacity={0.08} />
          <TribalCornerWatermark position="top-right" opacity={0.08} />
          <TribalCornerWatermark position="bottom-left" opacity={0.08} />
          <TribalCornerWatermark position="bottom-right" opacity={0.08} />

          {/* Architectural Double-Border Frame (Digitized from macklemorefashions.com .frame) */}
          <div className="relative z-10 w-full max-w-2xl border border-[#D4860B] p-1.5 bg-[#0B0B0C]/95">
            <div className="border border-[#D4860B]/35 p-8 sm:p-14 text-center space-y-6">
              {/* Top Multi-Color Ankara Hairline Bar */}
              <div
                className="h-1 w-full"
                style={{
                  background:
                    "linear-gradient(90deg, #1A7A6E, #D4860B, #E05C1A, #E31E24, #2E6B35, #D4860B)",
                }}
              />

              <div className="flex justify-center pt-2">
                <MacklemoreLogo showWordmark={true} showSubline={true} theme="dark" />
              </div>

              <TribalSectionSeparator label="VIP DROP LOCKER ACTIVE" />

              <div className="space-y-3">
                <span className="inline-block border border-[#E05C1A] bg-[#E05C1A]/15 text-[#E05C1A] font-mono text-[10px] tracking-[0.25em] uppercase px-3 py-1">
                  [ PRIVATE ALLOCATION // DROP 05: EQUATORIAL MONOLITH ]
                </span>
                <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight leading-none">
                  WE ARE WEAVING SOMETHING MONUMENTAL
                </h1>
                <p className="text-sm text-stone-400 max-w-lg mx-auto leading-relaxed">
                  Our flagship digital storefront is currently in private VIP
                  Drop-Locker mode ahead of the Toronto–Lagos–Nairobi capsule
                  release. Enter your WhatsApp/SMS number or executive email for
                  priority allocation keys.
                </p>
              </div>

              {/* Countdown Telemetry Grid */}
              <div className="grid grid-cols-4 border border-stone-800 divide-x divide-stone-800 font-mono">
                {[
                  { label: "DAYS", val: "03" },
                  { label: "HOURS", val: "14" },
                  { label: "MINS", val: "48" },
                  { label: "SECS", val: "19" },
                ].map((unit) => (
                  <div key={unit.label} className="p-3 bg-[#121214]">
                    <span className="text-xl sm:text-2xl font-bold text-[#F6F5F1] block">
                      {unit.val}
                    </span>
                    <span className="text-[9px] text-[#D4860B] tracking-widest">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* VIP Drop-Locker Form */}
              {vipSubmitted ? (
                <div className="p-4 border border-[#D4860B] bg-[#D4860B]/10 font-mono text-xs text-[#D4860B] uppercase">
                  [ CREDENTIAL REGISTERED // VIP ACCESS KEY DISPATCHED TO{" "}
                  {vipContactInput} ]
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (vipContactInput.trim()) setVipSubmitted(true);
                  }}
                  className="flex flex-col sm:flex-row gap-2"
                >
                  <input
                    type="text"
                    required
                    value={vipContactInput}
                    onChange={(e) => setVipContactInput(e.target.value)}
                    placeholder="ENTER EMAIL OR WHATSAPP (+234 / +1 / +254)..."
                    className="flex-1 bg-[#121214] border border-stone-700 px-4 py-3 font-mono text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[#D4860B]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#E31E24] hover:bg-[#D4860B] hover:text-[#0B0B0C] text-white font-mono text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    [ REQUEST KEY ]
                  </button>
                </form>
              )}

              <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase">
                <span className="text-stone-500">
                  WEAR YOUR CULTURE. OWN YOUR STORY.
                </span>
                <button
                  type="button"
                  onClick={() => setVipUnlockedByGuest(true)}
                  className="text-[#D4860B] hover:text-white underline cursor-pointer"
                >
                  [ BYPASS VAULT &amp; ENTER FULL FLAGSHIP STOREFRONT → ]
                </button>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1">{children}</main>
      )}

      {/* Editorial Footer */}
      <footer className="bg-[#080809] text-[#F6F5F1] border-t border-stone-800 relative overflow-hidden">
        <TribalCornerWatermark position="bottom-right" opacity={0.05} />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-4">
              <MacklemoreLogo showWordmark={true} showSubline={true} theme="dark" />
              <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
                Canadian-based luxury fashion enterprise with primary operational
                headquarters in Victoria Island, Lagos, Nigeria. Acting as the
                premier retail platform and B2B distribution bridge across West
                Africa, East Africa, North America, and Europe.
              </p>
              <div className="font-mono text-[10px] text-[#D4860B] space-y-1 uppercase">
                <div>[ HUB A: VICTORIA ISLAND, LAGOS, NIGERIA ]</div>
                <div>[ HUB B: KING WEST, TORONTO, CANADA ]</div>
                <div>[ EAST AFRICA NODE: WESTLANDS, NAIROBI, KENYA ]</div>
              </div>
            </div>

            {/* Storefront Directory */}
            <div className="lg:col-span-2 space-y-3 font-mono text-xs uppercase">
              <div className="text-[10px] text-[#D4860B] tracking-widest">
                [ B2C MARKETPLACE ]
              </div>
              <ul className="space-y-2 text-stone-400">
                <li>
                  <Link href="/shop" className="hover:text-white">
                    The Catalog (/shop)
                  </Link>
                </li>
                <li>
                  <Link href="/collections" className="hover:text-white">
                    Curated Drops
                  </Link>
                </li>
                <li>
                  <Link href="/brands" className="hover:text-white">
                    Brand Directory
                  </Link>
                </li>
                <li>
                  <Link href="/brands/luca" className="hover:text-white">
                    LUCA Partner Microsite
                  </Link>
                </li>
                <li>
                  <Link href="/journal" className="hover:text-white">
                    Editorial Journal
                  </Link>
                </li>
              </ul>
            </div>

            {/* B2B & Institutional */}
            <div className="lg:col-span-3 space-y-3 font-mono text-xs uppercase">
              <div className="text-[10px] text-[#D4860B] tracking-widest">
                [ B2B &amp; DISTRIBUTION ]
              </div>
              <ul className="space-y-2 text-stone-400">
                <li>
                  <Link href="/partnerships" className="hover:text-white">
                    Brand Representation (/partnerships)
                  </Link>
                </li>
                <li>
                  <Link href="/markets" className="hover:text-white">
                    Continental Footprint (/markets)
                  </Link>
                </li>
                <li>
                  <Link href="/our-story" className="hover:text-white">
                    The Brand Manifesto (/our-story)
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Wholesale &amp; Concierge (/contact)
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-[#E31E24] hover:underline">
                    Terminal Admin Console (/admin)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Payment & Official Channels */}
            <div className="lg:col-span-3 space-y-4 font-mono text-xs">
              <div className="text-[10px] text-[#D4860B] tracking-widest uppercase">
                [ PAYMENT &amp; LOGISTICS RAIL ]
              </div>
              <div className="space-y-1.5 text-[11px] text-stone-400">
                <div>[ GLOBAL: STRIPE // APPLE PAY // GOOGLE PAY ]</div>
                <div>[ WEST AFRICA: PAYSTACK NGN &amp; GHS ]</div>
                <div>[ EAST AFRICA: M-PESA DARAJA 2.0 STK PUSH ]</div>
                <div>[ COURIERS: DHL EXPRESS // GIG // WELLS FARGO KE ]</div>
              </div>
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href="https://www.instagram.com/macklemore_fashion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 border border-stone-800 hover:border-[#D4860B] text-[10px] uppercase"
                >
                  [ INSTAGRAM ]
                </a>
                <a
                  href="https://www.linkedin.com/company/macklemore-fashions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 border border-stone-800 hover:border-[#D4860B] text-[10px] uppercase"
                >
                  [ LINKEDIN ]
                </a>
                <a
                  href="https://wa.me/message/HUNCVA6MG4BUK1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 border border-stone-800 hover:border-[#D4860B] text-[10px] uppercase"
                >
                  [ WHATSAPP CONCIERGE ]
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-stone-500 uppercase">
            <span>
              © 2026 MACKLEMORE FASHIONS INC. (CANADA &amp;
              NIGERIA). ALL RIGHTS RESERVED.
            </span>
            <span>WEAR YOUR CULTURE. OWN YOUR STORY.</span>
          </div>
        </div>
      </footer>

      {/* Multi-Currency & Geolocation Drawer */}
      <EditorialDrawer
        isOpen={isCurrencyDrawerOpen}
        onClose={() => setIsCurrencyDrawerOpen(false)}
        title="CURRENCY & HUB TELEMETRY"
        subtitle="[ MULTI-CURRENCY & GEOLOCATION ENGINE ]"
        widthClass="max-w-md"
      >
        <div className="p-6 space-y-6">
          <div className="p-3.5 border border-stone-800 bg-[#121214] font-mono text-xs space-y-1">
            <span className="text-[10px] text-[#D4860B] uppercase block">
              [ AUTO-DETECTED CORRIDOR ]
            </span>
            <span className="text-stone-200 block">{detectedRegion}</span>
            <span className="text-[10px] text-stone-400 block">
              Rates cached via Upstash Redis relative to CAD $1.00 base.
            </span>
          </div>

          <div className="space-y-2">
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
                  className={`w-full p-4 border text-left transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "border-[#E31E24] bg-[#E31E24]/10 text-white"
                      : "border-stone-800 bg-[#0B0B0C] hover:border-[#D4860B] text-stone-300"
                  }`}
                >
                  <div>
                    <div className="font-mono text-xs font-bold uppercase">
                      [ {cfg.symbol} ] — {cfg.label}
                    </div>
                    <div className="font-mono text-[10px] text-stone-400 mt-1">
                      {cfg.regionLabel} // GATEWAY: {cfg.defaultGateway}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-[#D4860B]">
                    1 CAD = {cfg.rateFromCad} {code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </EditorialDrawer>

      {/* Side-Cart & Multi-Hub Logistics Drawer */}
      <EditorialDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        title={`ALLOCATION BAG (${cartCount})`}
        subtitle="[ MULTI-HUB FULFILLMENT & CHECKOUT ]"
        widthClass="max-w-lg"
      >
        {cart.length === 0 ? (
          <div className="p-10 text-center space-y-4 font-mono">
            <p className="text-xs text-stone-400 uppercase">
              [ YOUR ALLOCATION BAG IS CURRENTLY EMPTY ]
            </p>
            <Link
              href="/shop"
              onClick={() => setIsCartOpen(false)}
              className="inline-block px-6 py-3 border border-[#D4860B] text-[#D4860B] hover:bg-[#D4860B] hover:text-[#0B0B0C] text-xs uppercase tracking-widest transition-colors"
            >
              [ EXPLORE THE CATALOG ]
            </Link>
          </div>
        ) : (
          <div className="flex flex-col justify-between h-full">
            <div className="divide-y divide-stone-800">
              {cart.map((item) => {
                const unitPrice = convertPrice(item.product, currency);
                return (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="p-5 flex gap-4 bg-[#0B0B0C]"
                  >
                    <img
                      src={item.product.editorialImageUrl}
                      alt={item.product.title}
                      className="w-20 h-28 object-cover border border-stone-800 shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-[10px] text-[#D4860B] uppercase block">
                          [ {item.product.brandName} ]
                        </span>
                        <h4 className="font-display text-sm font-bold uppercase mt-0.5">
                          {item.product.title}
                        </h4>
                        <div className="font-mono text-[10px] text-stone-400 mt-1">
                          [ SIZE: {item.size} ] // [ {item.product.fabricWeightGsm}{" "}
                          GSM ]
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3">
                        <div className="inline-flex items-center border border-stone-800 font-mono text-xs">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.size, -1)
                            }
                            className="px-2.5 py-1 hover:bg-stone-800 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 border-x border-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.size, 1)
                            }
                            className="px-2.5 py-1 hover:bg-stone-800 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="font-mono text-xs font-bold text-[#F6F5F1]">
                            {formatCurrencyValue(
                              unitPrice * item.quantity,
                              currency
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.product.id, item.size)
                            }
                            className="font-mono text-[10px] text-stone-500 hover:text-[#E31E24] uppercase cursor-pointer"
                          >
                            [ REMOVE ]
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Logistics & Multi-Gateway Summary Footer */}
            <div className="p-6 border-t border-stone-800 bg-[#101012] space-y-4 font-mono">
              <div className="p-3 border border-stone-800 bg-[#0B0B0C] text-[10px] space-y-1">
                <div className="text-[#D4860B] uppercase">
                  [ ASSIGNED FULFILLMENT HUB ]
                </div>
                <div className="text-stone-200">{logistics.hubName}</div>
                <div className="text-stone-400">
                  COURIER: {logistics.courierPartner} ({logistics.estimatedTransitDays})
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>SUBTOTAL</span>
                  <span>
                    {formatCurrencyValue(subtotalInActiveCurrency, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>ESTIMATED SHIPPING ({sampleCountry})</span>
                  <span>
                    {formatCurrencyValue(logistics.shippingFee, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#F6F5F1] pt-2 border-t border-stone-800">
                  <span>TOTAL ({currency})</span>
                  <span className="text-[#D4860B]">
                    {formatCurrencyValue(
                      subtotalInActiveCurrency + logistics.shippingFee,
                      currency
                    )}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-stone-400 uppercase">
                [ ACTIVE GATEWAY: {logistics.recommendedGateway} // STRIPE · PAYSTACK · M-PESA ]
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="block w-full py-3.5 bg-[#E31E24] hover:bg-[#D4860B] hover:text-[#0B0B0C] text-white text-center text-xs font-bold uppercase tracking-[0.2em] transition-colors"
              >
                [ PROCEED TO MULTI-GATEWAY CHECKOUT → ]
              </Link>
            </div>
          </div>
        )}
      </EditorialDrawer>
    </div>
  );
}

