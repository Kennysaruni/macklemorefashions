"use client";

import React, { useState } from "react";
import { ContinentalMapBanner } from "@/components/vectors/ContinentalMapBanner";
import { StaggeredText } from "@/components/motion/MotionPrimitives";
import {
  TribalCornerWatermark,
  TribalSectionSeparator,
} from "@/components/vectors/TribalVectors";
import {
  CURRENCIES,
  CurrencyCode,
  calculateLogisticsForDestination,
  formatCurrencyValue,
} from "@/lib/store-data";

const COUNTRIES = [
  { iso: "NG", name: "Nigeria (Lagos / Abuja / Port Harcourt)", defaultCurr: "NGN" as CurrencyCode },
  { iso: "GH", name: "Ghana (Accra / Kumasi)", defaultCurr: "GHS" as CurrencyCode },
  { iso: "KE", name: "Kenya (Nairobi / Mombasa)", defaultCurr: "KES" as CurrencyCode },
  { iso: "CA", name: "Canada (Toronto / Vancouver / Montreal)", defaultCurr: "CAD" as CurrencyCode },
  { iso: "US", name: "United States (New York / Los Angeles / Atlanta)", defaultCurr: "USD" as CurrencyCode },
  { iso: "GB", name: "United Kingdom (London / Manchester)", defaultCurr: "GBP" as CurrencyCode },
  { iso: "FR", name: "European Union (Milan / Paris / Berlin)", defaultCurr: "EUR" as CurrencyCode },
];

export default function MarketsPage() {
  const [selectedCountry, setSelectedCountry] = useState("NG");
  const [orderValueCad, setOrderValueCad] = useState(500);

  const countryObj =
    COUNTRIES.find((c) => c.iso === selectedCountry) || COUNTRIES[0];
  const curr = countryObj.defaultCurr;
  const subtotalLocal = Math.round(orderValueCad * CURRENCIES[curr].rateFromCad);
  const sim = calculateLogisticsForDestination(
    selectedCountry,
    curr,
    subtotalLocal
  );

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F6F5F1]">
      <section className="relative border-b border-stone-800 py-14 sm:py-20 overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.06} />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#D4860B] block">
            [ CONTINENTAL LOGISTICS &amp; REGIONAL FULFILLMENT HUBS ]
          </span>
          <StaggeredText
            text="GLOBAL & AFRICAN DISTRIBUTION FOOTPRINT"
            as="h1"
            className="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight mt-2"
          />
          <p className="text-sm text-stone-400 max-w-2xl mt-4 leading-relaxed">
            Inspect our operating presence across Hub A (Victoria Island,
            Lagos), Hub B (Toronto), and our East African regional node
            (Westlands, Nairobi), complete with live duty, courier, and payment
            routing simulation.
          </p>
        </div>
      </section>

      {/* Interactive Map */}
      <ContinentalMapBanner compact={false} />

      {/* Live Logistics & Corridor Simulator */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 space-y-10">
        <TribalSectionSeparator label="INTERACTIVE CORRIDOR & DUTY SIMULATOR" />

        <div className="grid grid-cols-1 lg:grid-cols-12 border border-stone-800 bg-[#101012]">
          <div className="lg:col-span-5 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-stone-800 space-y-6 font-mono">
            <span className="text-[10px] text-[#D4860B] uppercase block">
              [ CONFIGURE DESTINATION PARAMETERS ]
            </span>
            <h2 className="font-display text-2xl font-bold uppercase">
              MULTI-HUB ROUTING CALCULATOR
            </h2>

            <div>
              <label className="text-[10px] text-stone-400 uppercase block mb-2">
                SELECT DESTINATION MARKET
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-3 bg-[#0B0B0C] border border-stone-800 text-xs text-white focus:outline-none focus:border-[#D4860B]"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.iso} value={c.iso}>
                    [{c.iso}] {c.name} ({c.defaultCurr})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-stone-400 uppercase block mb-2">
                SIMULATED ORDER VALUE: CAD ${orderValueCad}
              </label>
              <input
                type="range"
                min={120}
                max={2500}
                step={20}
                value={orderValueCad}
                onChange={(e) => setOrderValueCad(Number(e.target.value))}
                className="w-full accent-[#E31E24]"
              />
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 border border-stone-800 bg-[#0B0B0C]">
              <span className="text-[10px] text-[#D4860B] uppercase block">
                [ ASSIGNED FULFILLMENT HUB ]
              </span>
              <span className="font-bold text-white mt-1 block">
                {sim.hubName}
              </span>
            </div>
            <div className="p-4 border border-stone-800 bg-[#0B0B0C]">
              <span className="text-[10px] text-[#D4860B] uppercase block">
                [ DESIGNATED COURIER FLEET ]
              </span>
              <span className="font-bold text-white mt-1 block">
                {sim.courierPartner}
              </span>
            </div>
            <div className="p-4 border border-stone-800 bg-[#0B0B0C]">
              <span className="text-[10px] text-[#D4860B] uppercase block">
                [ ESTIMATED TRANSIT SLA ]
              </span>
              <span className="font-bold text-[#E05C1A] mt-1 block">
                {sim.estimatedTransitDays}
              </span>
            </div>
            <div className="p-4 border border-stone-800 bg-[#0B0B0C]">
              <span className="text-[10px] text-[#D4860B] uppercase block">
                [ PRIMARY PAYMENT GATEWAY ]
              </span>
              <span className="font-bold text-[#E31E24] mt-1 block">
                {sim.recommendedGateway} ({curr})
              </span>
            </div>
            <div className="sm:col-span-2 p-4 border border-stone-800 bg-[#0B0B0C] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-stone-400 block">
                  LOCAL SUBTOTAL: {formatCurrencyValue(subtotalLocal, curr)}
                </span>
                <span className="text-[10px] text-stone-400 block">
                  SHIPPING: {formatCurrencyValue(sim.shippingFee, curr)} //
                  DUTIES: {formatCurrencyValue(sim.dutiesFee, curr)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#D4860B] block">
                  LANDED TOTAL ({curr})
                </span>
                <span className="text-lg font-bold text-white">
                  {formatCurrencyValue(
                    subtotalLocal + sim.shippingFee + sim.dutiesFee,
                    curr
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

