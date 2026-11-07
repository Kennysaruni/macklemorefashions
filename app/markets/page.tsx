"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ContinentalMapBanner } from "@/components/vectors/ContinentalMapBanner";
import { StaggeredText } from "@/components/motion/MotionPrimitives";
import {
  CURRENCIES,
  CurrencyCode,
  calculateLogisticsForDestination,
  formatCurrencyValue,
} from "@/lib/store-data";
import {
  TribalCornerWatermark,
  TribalSectionSeparator,
} from "@/components/vectors/TribalVectors";

const SAMPLE_DESTINATIONS = [
  { iso: "NG", label: "Lagos / Abuja, Nigeria (ECOWAS Hub A)", defaultCurrency: "NGN" as CurrencyCode },
  { iso: "KE", label: "Nairobi / Mombasa, Kenya (East Africa 254 Node)", defaultCurrency: "KES" as CurrencyCode },
  { iso: "GH", label: "Accra / Kumasi, Ghana (West Africa Corridor)", defaultCurrency: "GHS" as CurrencyCode },
  { iso: "CA", label: "Toronto / Montreal, Canada (Hub B HQ)", defaultCurrency: "CAD" as CurrencyCode },
  { iso: "US", label: "New York / Los Angeles, United States", defaultCurrency: "USD" as CurrencyCode },
  { iso: "GB", label: "London / Manchester, United Kingdom", defaultCurrency: "GBP" as CurrencyCode },
  { iso: "FR", label: "Paris / Milan, Continental Europe", defaultCurrency: "EUR" as CurrencyCode },
];

export default function MarketsFootprintPage() {
  const [selectedDestIso, setSelectedDestIso] = useState("NG");
  const [simCurrency, setSimCurrency] = useState<CurrencyCode>("NGN");
  const [simOrderValueCad, setSimOrderValueCad] = useState(650);

  const subtotalInCurrency = Math.round(
    simOrderValueCad * CURRENCIES[simCurrency].rateFromCad
  );

  const logistics = calculateLogisticsForDestination(
    selectedDestIso,
    simCurrency,
    subtotalInCurrency
  );

  const handleSelectCountry = (iso: string, defCurr: CurrencyCode) => {
    setSelectedDestIso(iso);
    setSimCurrency(defCurr);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111]">
      {/* Page Hero */}
      <section className="relative border-b border-[#E5E0D8] bg-white px-4 sm:px-8 py-14 sm:py-20 overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.05} className="text-[#7A491D]" />
        <div className="max-w-[1440px] mx-auto space-y-4">
          <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-[#7A491D] font-semibold block">
            GLOBAL STORE &amp; LOGISTICS FOOTPRINT // YOU BELONG EVERYWHERE
          </span>
          <StaggeredText
            text="CONTINENTAL OPERATING PRESENCE & SHIPPING CORRIDORS"
            as="h1"
            className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight max-w-4xl leading-[0.98] text-[#111111]"
          />
          <p className="text-sm sm:text-base text-[#4A4742] max-w-2xl leading-relaxed">
            Explore our dual-hemisphere warehouse architecture (Hub A: Victoria Island, Lagos, Nairobi 254 Node, and Hub B: King West, Toronto) and simulate real-time courier routing, customs clearance, and payment gateway orchestration.
          </p>
        </div>
      </section>

      {/* Interactive Continental Map */}
      <ContinentalMapBanner />

      {/* Live Logistics & Duty Calculator Simulator */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <TribalSectionSeparator
          label="REAL-TIME MULTI-HUB SHIPPING & CUSTOMS DUTY SIMULATOR"
          theme="light"
          className="mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 border border-[#E5E0D8] divide-y lg:divide-y-0 lg:divide-x divide-[#E5E0D8] bg-white">
          {/* Left 6 Columns: Controls */}
          <div className="lg:col-span-6 p-6 sm:p-10 space-y-6">
            <div>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#7A491D] font-semibold block">
                01 // SELECT DESTINATION MARKET
              </span>
              <div className="grid grid-cols-1 gap-2 mt-3">
                {SAMPLE_DESTINATIONS.map((dest) => {
                  const isSelected = selectedDestIso === dest.iso;
                  return (
                    <button
                      key={dest.iso}
                      type="button"
                      onClick={() =>
                        handleSelectCountry(dest.iso, dest.defaultCurrency)
                      }
                      className={`p-3.5 border text-left font-mono text-xs uppercase flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? "border-[#111111] bg-[#111111] text-white font-bold"
                          : "border-[#E5E0D8] bg-[#FAF9F6] text-[#4A4742] hover:border-[#111111]"
                      }`}
                    >
                      <span>
                        [{dest.iso}] {dest.label}
                      </span>
                      <span
                        className={
                          isSelected ? "text-[#E5E0D8]" : "text-[#7A491D]"
                        }
                      >
                        {dest.defaultCurrency}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E5E0D8]">
              <div>
                <label className="font-mono text-[10px] uppercase text-[#6E6A63] block mb-2">
                  SIMULATED BASKET VALUE (BASE CAD)
                </label>
                <input
                  type="range"
                  min={200}
                  max={2500}
                  step={50}
                  value={simOrderValueCad}
                  onChange={(e) => setSimOrderValueCad(Number(e.target.value))}
                  className="w-full accent-[#E31E24]"
                />
                <span className="font-mono text-xs text-[#7A491D] font-bold block mt-1">
                  BASE BASKET: CAD ${simOrderValueCad}
                </span>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase text-[#6E6A63] block mb-2">
                  SETTLEMENT CURRENCY OVERRIDE
                </label>
                <select
                  value={simCurrency}
                  onChange={(e) =>
                    setSimCurrency(e.target.value as CurrencyCode)
                  }
                  className="w-full px-3 py-2 border border-[#E5E0D8] bg-[#FAF9F6] font-mono text-xs text-[#111111] outline-none"
                >
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                    <option key={c} value={c}>
                      {c} — {CURRENCIES[c].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Right 6 Columns: Calculated Routing Output */}
          <div className="lg:col-span-6 p-6 sm:p-10 bg-[#FAF9F6] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#E31E24] font-semibold block">
                02 // COMPUTED FULFILLMENT &amp; GATEWAY ROUTING
              </span>

              <div className="p-5 border border-[#E5E0D8] bg-white space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-[#E5E0D8] pb-2">
                  <span className="text-[#6E6A63]">ASSIGNED WAREHOUSE HUB</span>
                  <span className="text-[#7A491D] font-bold">
                    {logistics.assignedHub}
                  </span>
                </div>
                <div className="text-[#111111] font-semibold">
                  {logistics.hubName}
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E5E0D8]">
                  <span className="text-[#6E6A63]">COURIER DISPATCH</span>
                  <span className="text-[#111111]">
                    {logistics.courierPartner}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6A63]">TRANSIT WINDOW</span>
                  <span className="text-[#2E6B35] font-semibold">
                    {logistics.estimatedTransitDays}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6A63]">PAYMENT GATEWAY</span>
                  <span className="text-[#E31E24] font-bold">
                    {logistics.recommendedGateway}
                  </span>
                </div>
              </div>

              <div className="p-5 border border-[#E5E0D8] bg-white space-y-2 font-mono text-xs">
                <div className="flex justify-between text-[#4A4742]">
                  <span>CONVERTED SUBTOTAL</span>
                  <span>
                    {formatCurrencyValue(subtotalInCurrency, simCurrency)}
                  </span>
                </div>
                <div className="flex justify-between text-[#4A4742]">
                  <span>COURIER FREIGHT RATE</span>
                  <span>
                    {formatCurrencyValue(logistics.shippingFee, simCurrency)}
                  </span>
                </div>
                <div className="flex justify-between text-[#4A4742]">
                  <span>ESTIMATED CUSTOMS / DUTY</span>
                  <span>
                    {logistics.dutiesFee === 0
                      ? "0 (DUTY-CLEARED CORRIDOR)"
                      : formatCurrencyValue(logistics.dutiesFee, simCurrency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#111111] pt-3 border-t border-[#E5E0D8]">
                  <span>LANDED TOTAL ({simCurrency})</span>
                  <span className="text-[#E31E24]">
                    {formatCurrencyValue(
                      subtotalInCurrency +
                        logistics.shippingFee +
                        logistics.dutiesFee,
                      simCurrency
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="flex-1 py-3.5 px-5 bg-[#111111] hover:bg-[#E31E24] text-white text-center font-mono text-xs uppercase tracking-[0.2em] font-bold transition-colors"
              >
                SHOP WITH THIS ROUTING →
              </Link>
              <Link
                href="/partnerships"
                className="py-3.5 px-5 border border-[#111111] bg-white hover:bg-[#111111] hover:text-white font-mono text-xs uppercase tracking-widest text-[#111111] transition-colors"
              >
                B2B LOGISTICS INQUIRY
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
