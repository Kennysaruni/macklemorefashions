"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePlatform } from "@/lib/platform-context";
import {
  calculateLogisticsForDestination,
  convertPrice,
  CURRENCIES,
  CurrencyCode,
  formatCurrencyValue,
  OrderRecord,
  PaymentProvider,
} from "@/lib/store-data";

const DESTINATION_COUNTRIES: {
  iso: string;
  name: string;
  defaultCity: string;
  suggestedCurrency: CurrencyCode;
}[] = [
  {
    iso: "NG",
    name: "Nigeria (West Africa — Hub A Direct)",
    defaultCity: "Victoria Island, Lagos",
    suggestedCurrency: "NGN",
  },
  {
    iso: "GH",
    name: "Ghana (West Africa — ECOWAS Corridor)",
    defaultCity: "Osu, Accra",
    suggestedCurrency: "GHS",
  },
  {
    iso: "KE",
    name: "Kenya (East Africa — Nairobi Node)",
    defaultCity: "Westlands, Nairobi",
    suggestedCurrency: "KES",
  },
  {
    iso: "CA",
    name: "Canada (North America — Hub B Direct)",
    defaultCity: "Toronto, ON",
    suggestedCurrency: "CAD",
  },
  {
    iso: "US",
    name: "United States (North America)",
    defaultCity: "SoHo, New York",
    suggestedCurrency: "USD",
  },
  {
    iso: "GB",
    name: "United Kingdom (Europe / UK)",
    defaultCity: "Mayfair, London",
    suggestedCurrency: "GBP",
  },
  {
    iso: "FR",
    name: "European Union (Milan / Paris)",
    defaultCity: "Milan / Paris",
    suggestedCurrency: "EUR",
  },
];

export default function CheckoutPage() {
  const { cart, currency, setCurrency, createOrder, clearCart } = usePlatform();

  const [destinationIso, setDestinationIso] = useState<string>("NG");
  const [customerName, setCustomerName] = useState("Tunde Bakare");
  const [customerEmail, setCustomerEmail] = useState("t.bakare@vi-holdings.ng");
  const [customerPhone, setCustomerPhone] = useState("+234 809 442 1900");
  const [destinationCity, setDestinationCity] = useState(
    "Victoria Island, Lagos"
  );
  const [mpesaPhone, setMpesaPhone] = useState("254712345678");
  const [paystackChannel, setPaystackChannel] = useState<
    "CARD" | "BANK_TRANSFER" | "USSD"
  >("CARD");

  // Payment Gateway Override (defaults to recommended gateway for destination)
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + convertPrice(item.product, currency) * item.quantity,
    0
  );

  const logistics = calculateLogisticsForDestination(
    destinationIso,
    currency,
    subtotal
  );

  const [selectedGateway, setSelectedGateway] = useState<PaymentProvider>(
    logistics.recommendedGateway
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [stkPushStage, setStkPushStage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(
    null
  );

  const handleCountryChange = (iso: string) => {
    setDestinationIso(iso);
    const meta = DESTINATION_COUNTRIES.find((c) => c.iso === iso);
    if (meta) {
      setDestinationCity(meta.defaultCity);
      setCurrency(meta.suggestedCurrency);
      const nextLogistics = calculateLogisticsForDestination(
        iso,
        meta.suggestedCurrency,
        subtotal
      );
      setSelectedGateway(nextLogistics.recommendedGateway);
    }
  };

  const totalAmount = subtotal + logistics.shippingFee + logistics.dutiesFee;

  const handleExecuteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessing(true);
    if (selectedGateway === "MPESA_DARAJA") {
      setStkPushStage(
        `[ DARAJA 2.0 ] TRANSMITTING STK PUSH TO ${mpesaPhone}... CHECK HANDSET FOR M-PESA PIN.`
      );
    } else if (selectedGateway === "PAYSTACK") {
      setStkPushStage(
        `[ PAYSTACK ] INITIALIZING ${paystackChannel} SETTLEMENT IN ${currency}...`
      );
    } else {
      setStkPushStage(
        `[ STRIPE ELEMENTS ] AUTHORIZING MULTI-CURRENCY SETTLEMENT IN ${currency}...`
      );
    }

    setTimeout(() => {
      const countryObj = DESTINATION_COUNTRIES.find(
        (c) => c.iso === destinationIso
      );
      const waybillPrefix =
        logistics.assignedHub === "HUB_A_LAGOS"
          ? destinationIso === "KE"
            ? "FGO-KE"
            : "GIG-LOS"
          : "DHL-YYZ";

      const newOrd = createOrder({
        customerName,
        customerEmail,
        customerPhone:
          selectedGateway === "MPESA_DARAJA" ? mpesaPhone : customerPhone,
        destinationCountry: countryObj?.name || destinationIso,
        destinationCity,
        currency,
        subtotalAmount: subtotal,
        shippingAmount: logistics.shippingFee,
        dutiesAmount: logistics.dutiesFee,
        totalAmount,
        assignedHub: logistics.assignedHub,
        courierPartner: logistics.courierPartner,
        waybillNumber: `${waybillPrefix}-${Math.floor(
          100000 + Math.random() * 900000
        )}`,
        status: "ALLOCATED_TO_HUB",
        paymentProvider: selectedGateway,
        paymentReference:
          selectedGateway === "MPESA_DARAJA"
            ? `ws_CO_06112026${Math.floor(10000 + Math.random() * 89999)}`
            : selectedGateway === "PAYSTACK"
            ? `PSK_${Math.floor(10000000 + Math.random() * 90000000)}`
            : `pi_3Q8Mkm${Math.floor(100000 + Math.random() * 900000)}`,
        mpesaReceiptNumber:
          selectedGateway === "MPESA_DARAJA"
            ? `SJK${Math.floor(10 + Math.random() * 89)}M89Q2`
            : undefined,
        paymentStatus: "SUCCEEDED",
        items: cart.map((item) => ({
          productId: item.product.id,
          productTitle: item.product.title,
          brandName: item.product.brandName,
          size: item.size,
          quantity: item.quantity,
          unitPrice: convertPrice(item.product, currency),
        })),
      });

      setIsProcessing(false);
      setStkPushStage(null);
      setCompletedOrder(newOrd);
      clearCart();
    }, 950);
  };

  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] text-[#F6F5F1] px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl border border-[#D4860B] bg-[#0E0E10] p-8 md:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-6 mb-8">
            <div>
              <span className="font-mono text-[10px] tracking-[0.26em] text-emerald-400 uppercase block">
                [ SETTLEMENT VERIFIED // DISPATCH DOSSIER GENERATED ]
              </span>
              <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase mt-2">
                ORDER {completedOrder.orderNumber}
              </h1>
            </div>
            <div className="border border-stone-700 bg-black px-4 py-2 font-mono text-xs text-[#D4860B] uppercase">
              [ WAYBILL: {completedOrder.waybillNumber} ]
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-stone-800 bg-[#0B0B0C] p-6 mb-8 font-mono text-xs">
            <div className="space-y-2">
              <div className="text-stone-500 text-[10px]">
                [ CLIENT & DESTINATION ]
              </div>
              <div className="text-[#F6F5F1] font-semibold">
                {completedOrder.customerName}
              </div>
              <div className="text-stone-400">{completedOrder.customerEmail}</div>
              <div className="text-stone-400">
                {completedOrder.destinationCity},{" "}
                {completedOrder.destinationCountry}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-stone-500 text-[10px]">
                [ LOGISTICS & PAYMENT TELEMETRY ]
              </div>
              <div>
                ASSIGNED HUB:{" "}
                <span className="text-[#D4860B]">
                  {completedOrder.assignedHub}
                </span>
              </div>
              <div>
                COURIER:{" "}
                <span className="text-[#F6F5F1]">
                  {completedOrder.courierPartner}
                </span>
              </div>
              <div>
                GATEWAY:{" "}
                <span className="text-emerald-400">
                  {completedOrder.paymentProvider} (
                  {completedOrder.paymentReference})
                </span>
              </div>
              {completedOrder.mpesaReceiptNumber && (
                <div>
                  M-PESA RECEIPT:{" "}
                  <span className="text-[#D4860B]">
                    {completedOrder.mpesaReceiptNumber}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="border border-stone-800 divide-y divide-stone-800 mb-8">
            {completedOrder.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 font-mono text-xs"
              >
                <div>
                  <span className="text-[#D4860B] mr-2">[{item.brandName}]</span>
                  <span className="text-[#F6F5F1] font-semibold">
                    {item.productTitle}
                  </span>{" "}
                  <span className="text-stone-400">
                    // SIZE: {item.size} × {item.quantity}
                  </span>
                </div>
                <div className="text-[#F6F5F1]">
                  {formatCurrencyValue(
                    item.unitPrice * item.quantity,
                    completedOrder.currency
                  )}
                </div>
              </div>
            ))}
            <div className="p-4 bg-black flex justify-between font-mono text-sm font-bold">
              <span>TOTAL SETTLED ({completedOrder.currency})</span>
              <span className="text-[#D4860B]">
                [ {formatCurrencyValue(completedOrder.totalAmount, completedOrder.currency)} ]
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin"
              className="bg-[#E31E24] px-6 py-3.5 font-mono text-xs font-semibold tracking-[0.2em] text-white uppercase hover:bg-[#D4860B] hover:text-black transition-colors"
            >
              INSPECT ORDER IN /ADMIN CONSOLE →
            </Link>
            <Link
              href="/shop"
              className="border border-stone-700 px-6 py-3.5 font-mono text-xs tracking-[0.2em] text-[#F6F5F1] uppercase hover:border-[#D4860B]"
            >
              RETURN TO CATALOG
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F6F5F1]">
      {/* Header */}
      <section className="border-b border-stone-800 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-[1600px] flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] tracking-[0.28em] text-[#D4860B] uppercase mb-2">
              [ MULTI-GATEWAY PAYMENT & MULTI-HUB LOGISTICS ORCHESTRATION ]
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-[-0.03em] uppercase">
              ALLOCATION CHECKOUT & DISPATCH
            </h1>
          </div>
          <div className="font-mono text-xs text-stone-400 uppercase">
            ACTIVE CURRENCY:{" "}
            <span className="text-[#D4860B] font-semibold">
              [ {currency} // {CURRENCIES[currency].label} ]
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left 7 Cols: Logistics Routing & Payment Gateway Orchestrator */}
          <form
            onSubmit={handleExecuteCheckout}
            className="lg:col-span-7 space-y-8"
          >
            {/* Step 1: Destination Corridor & Automatic Hub Assignment */}
            <div className="border border-stone-800 bg-[#0E0E10] p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#D4860B] uppercase">
                  01 // DESTINATION CORRIDOR & WAREHOUSE HUB ASSIGNMENT
                </span>
                <span className="font-mono text-[10px] tracking-[0.18em] text-stone-400 uppercase">
                  [ AUTO-ROUTED ]
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-2">
                    SELECT DESTINATION COUNTRY (AUTO-COMPUTES NEAREST HUB & CURRENCY)
                  </label>
                  <select
                    value={destinationIso}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full border border-stone-700 bg-[#141418] px-4 py-3.5 font-mono text-xs text-[#F6F5F1] focus:border-[#D4860B] focus:outline-none"
                  >
                    {DESTINATION_COUNTRIES.map((c) => (
                      <option key={c.iso} value={c.iso}>
                        {c.name} — Default Currency: {c.suggestedCurrency}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-2">
                    RECIPIENT FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border border-stone-700 bg-[#141418] px-4 py-3 font-mono text-xs text-[#F6F5F1] focus:border-[#D4860B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-2">
                    DISPATCH EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full border border-stone-700 bg-[#141418] px-4 py-3 font-mono text-xs text-[#F6F5F1] focus:border-[#D4860B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-2">
                    DELIVERY CITY & DISTRICT *
                  </label>
                  <input
                    type="text"
                    required
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="w-full border border-stone-700 bg-[#141418] px-4 py-3 font-mono text-xs text-[#F6F5F1] focus:border-[#D4860B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-2">
                    CONTACT PHONE *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full border border-stone-700 bg-[#141418] px-4 py-3 font-mono text-xs text-[#F6F5F1] focus:border-[#D4860B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Computed Fulfillment Hub Box */}
              <div className="border border-stone-700 bg-[#0B0B0C] p-5 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-[#D4860B]">
                  <span>[ ASSIGNED FULFILLMENT HUB ]</span>
                  <span>[{logistics.assignedHub}]</span>
                </div>
                <div className="text-[#F6F5F1] font-semibold">
                  {logistics.hubName}
                </div>
                <div className="text-stone-400 text-[11px]">
                  COURIER PARTNER: {logistics.courierPartner} // TRANSIT:{" "}
                  {logistics.estimatedTransitDays}
                </div>
              </div>
            </div>

            {/* Step 2: Multi-Gateway Payment Orchestration */}
            <div className="border border-stone-800 bg-[#0E0E10] p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#D4860B] uppercase">
                  02 // MULTI-GATEWAY PAYMENT ORCHESTRATION
                </span>
                <span className="font-mono text-[10px] tracking-[0.18em] text-emerald-400 uppercase">
                  [ RECOMMENDED: {logistics.recommendedGateway} ]
                </span>
              </div>

              {/* Gateway Selector Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 border border-stone-800 divide-y sm:divide-y-0 sm:divide-x divide-stone-800">
                <button
                  type="button"
                  onClick={() => setSelectedGateway("STRIPE")}
                  className={`p-4 text-left transition-colors ${
                    selectedGateway === "STRIPE"
                      ? "bg-[#E31E24] text-white"
                      : "bg-[#0B0B0C] text-stone-400 hover:text-white"
                  }`}
                >
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase">
                    [ GLOBAL / NORTH AMERICA / EU ]
                  </div>
                  <div className="font-display text-base font-bold uppercase mt-1">
                    STRIPE CHECKOUT
                  </div>
                  <div className="font-mono text-[10px] mt-1 opacity-80">
                    CARDS · APPLE PAY · CAD/USD/GBP/EUR
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGateway("PAYSTACK")}
                  className={`p-4 text-left transition-colors ${
                    selectedGateway === "PAYSTACK"
                      ? "bg-[#E31E24] text-white"
                      : "bg-[#0B0B0C] text-stone-400 hover:text-white"
                  }`}
                >
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase">
                    [ WEST AFRICA // NIGERIA & GHANA ]
                  </div>
                  <div className="font-display text-base font-bold uppercase mt-1">
                    PAYSTACK AFRICA
                  </div>
                  <div className="font-mono text-[10px] mt-1 opacity-80">
                    NGN & GHS · CARDS · TRANSFER · USSD
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGateway("MPESA_DARAJA")}
                  className={`p-4 text-left transition-colors ${
                    selectedGateway === "MPESA_DARAJA"
                      ? "bg-[#E31E24] text-white"
                      : "bg-[#0B0B0C] text-stone-400 hover:text-white"
                  }`}
                >
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase">
                    [ EAST AFRICA // KENYA ]
                  </div>
                  <div className="font-display text-base font-bold uppercase mt-1">
                    M-PESA DARAJA 2.0
                  </div>
                  <div className="font-mono text-[10px] mt-1 opacity-80">
                    EXPRESS STK PUSH · KES SETTLEMENT
                  </div>
                </button>
              </div>

              {/* Dynamic Gateway Console */}
              {selectedGateway === "STRIPE" && (
                <div className="border border-stone-800 bg-[#0B0B0C] p-6 space-y-4">
                  <div className="font-mono text-[11px] tracking-[0.2em] text-[#D4860B] uppercase">
                    [ STRIPE ELEMENTS // INTERNATIONAL CARD & APPLE PAY ]
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-mono text-[10px] text-stone-400 uppercase mb-1">
                        CARD NUMBER
                      </label>
                      <input
                        type="text"
                        defaultValue="4242 •••• •••• 4242"
                        className="w-full border border-stone-700 bg-[#141418] px-4 py-2.5 font-mono text-xs text-[#F6F5F1]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-stone-400 uppercase mb-1">
                        EXPIRY
                      </label>
                      <input
                        type="text"
                        defaultValue="08 / 29"
                        className="w-full border border-stone-700 bg-[#141418] px-4 py-2.5 font-mono text-xs text-[#F6F5F1]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-stone-400 uppercase mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        defaultValue="884"
                        className="w-full border border-stone-700 bg-[#141418] px-4 py-2.5 font-mono text-xs text-[#F6F5F1]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedGateway === "PAYSTACK" && (
                <div className="border border-stone-800 bg-[#0B0B0C] p-6 space-y-4">
                  <div className="font-mono text-[11px] tracking-[0.2em] text-[#D4860B] uppercase">
                    [ PAYSTACK WEST AFRICA // NIGERIA (NGN) & GHANA (GHS) ]
                  </div>
                  <div className="flex gap-2">
                    {(["CARD", "BANK_TRANSFER", "USSD"] as const).map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setPaystackChannel(ch)}
                        className={`border px-4 py-2 font-mono text-[10px] tracking-[0.18em] uppercase ${
                          paystackChannel === ch
                            ? "border-[#D4860B] bg-[#D4860B]/15 text-[#D4860B]"
                            : "border-stone-700 text-stone-400"
                        }`}
                      >
                        {ch.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                  <p className="font-mono text-xs text-stone-400">
                    Instant NGN / GHS settlement with automatic webhook reconciliation to Hub A (Victoria Island, Lagos).
                  </p>
                </div>
              )}

              {selectedGateway === "MPESA_DARAJA" && (
                <div className="border border-stone-800 bg-[#0B0B0C] p-6 space-y-4">
                  <div className="font-mono text-[11px] tracking-[0.2em] text-emerald-400 uppercase">
                    [ SAFARICOM M-PESA DARAJA 2.0 // EXPRESS STK PUSH ]
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-2">
                      SAFARICOM M-PESA MOBILE NUMBER (FORMAT: 2547XXXXXXXX) *
                    </label>
                    <input
                      type="text"
                      required
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      className="w-full border border-stone-700 bg-[#141418] px-4 py-3 font-mono text-xs text-[#F6F5F1] focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <p className="font-mono text-[11px] text-stone-400">
                    Clicking &ldquo;AUTHORIZE SETTLEMENT&rdquo; triggers an instant Daraja 2.0 Express STK prompt to your handset and logs the callback receipt in the Macklemore Admin Ledger.
                  </p>
                </div>
              )}

              {stkPushStage && (
                <div className="border border-[#D4860B] bg-[#17120A] p-4 font-mono text-xs text-[#D4860B]">
                  {stkPushStage}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing || cart.length === 0}
                className="w-full bg-[#E31E24] py-4 font-mono text-xs font-semibold tracking-[0.24em] text-white uppercase hover:bg-[#D4860B] hover:text-black transition-colors disabled:opacity-50"
              >
                {isProcessing
                  ? "ORCHESTRATING PAYMENT & HUB ALLOCATION..."
                  : `AUTHORIZE SETTLEMENT via ${selectedGateway} — [ ${formatCurrencyValue(
                      totalAmount,
                      currency
                    )} ]`}
              </button>
            </div>
          </form>

          {/* Right 5 Cols: Order Manifest & Landed Duty Ledger */}
          <div className="lg:col-span-5">
            <div className="border border-stone-800 bg-[#0E0E10] p-6 md:p-8 sticky top-28 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#F6F5F1] uppercase">
                  [ ALLOCATION MANIFEST // {cart.length} LINE ITEMS ]
                </span>
                <Link
                  href="/shop"
                  className="font-mono text-[10px] tracking-[0.18em] text-[#D4860B] uppercase hover:underline"
                >
                  MODIFY BAG
                </Link>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center font-mono text-xs text-stone-500">
                  YOUR ALLOCATION BAG IS EMPTY.{" "}
                  <Link href="/shop" className="text-[#D4860B] underline">
                    BROWSE CATALOG
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-stone-800">
                  {cart.map((item) => {
                    const unitPrice = convertPrice(item.product, currency);
                    return (
                      <div
                        key={`${item.product.id}-${item.size}`}
                        className="py-4 flex items-start justify-between gap-4"
                      >
                        <div className="flex gap-3">
                          <img
                            src={item.product.editorialImageUrl}
                            alt={item.product.title}
                            className="h-20 w-16 object-cover border border-stone-800"
                          />
                          <div>
                            <div className="font-mono text-[10px] tracking-[0.18em] text-[#D4860B] uppercase">
                              {item.product.brandName}
                            </div>
                            <div className="font-display text-sm font-bold uppercase text-[#F6F5F1]">
                              {item.product.title}
                            </div>
                            <div className="font-mono text-[10px] text-stone-400 uppercase mt-1">
                              [ SIZE: {item.size} // QTY: {item.quantity} //{" "}
                              {item.product.fabricWeightGsm} GSM ]
                            </div>
                          </div>
                        </div>
                        <div className="font-mono text-xs text-[#F6F5F1] whitespace-nowrap">
                          {formatCurrencyValue(
                            unitPrice * item.quantity,
                            currency
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Totals Breakdown */}
              <div className="border-t border-stone-800 pt-4 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>GARMENT SUBTOTAL</span>
                  <span className="text-[#F6F5F1]">
                    {formatCurrencyValue(subtotal, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>
                    HUB DISPATCH ({logistics.assignedHub})
                  </span>
                  <span className="text-[#F6F5F1]">
                    {formatCurrencyValue(logistics.shippingFee, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>ESTIMATED CUSTOMS / ECOWAS DUTY</span>
                  <span className="text-[#F6F5F1]">
                    {logistics.dutiesFee === 0
                      ? "DUTY-CLEARED (0)"
                      : formatCurrencyValue(logistics.dutiesFee, currency)}
                  </span>
                </div>
                <div className="border-t border-stone-800 pt-3 flex justify-between text-sm font-bold">
                  <span className="text-[#D4860B]">TOTAL LANDED SETTLEMENT</span>
                  <span className="text-[#F6F5F1]">
                    [ {formatCurrencyValue(totalAmount, currency)} ]
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

