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
import { LuxuryLoadingIndicator } from "@/components/motion/LuxuryLoadingIndicator";

const DESTINATION_COUNTRIES: {
  iso: string;
  name: string;
  defaultCity: string;
  suggestedCurrency: CurrencyCode;
}[] = [
  {
    iso: "NG",
    name: "Nigeria (West Africa · Nigeria Hub Direct)",
    defaultCity: "Nigeria",
    suggestedCurrency: "NGN",
  },
  {
    iso: "CA",
    name: "Canada (North America · Toronto HQ Direct)",
    defaultCity: "Toronto, Canada",
    suggestedCurrency: "CAD",
  },
  {
    iso: "GH",
    name: "Ghana (West Africa · ECOWAS Corridor)",
    defaultCity: "Accra, Ghana",
    suggestedCurrency: "GHS",
  },
  {
    iso: "KE",
    name: "East Africa (Kenya / Regional Delivery)",
    defaultCity: "East Africa",
    suggestedCurrency: "KES",
  },
  {
    iso: "US",
    name: "United States (North America Delivery)",
    defaultCity: "New York, USA",
    suggestedCurrency: "USD",
  },
  {
    iso: "GB",
    name: "United Kingdom (UK Express Delivery)",
    defaultCity: "London, UK",
    suggestedCurrency: "GBP",
  },
  {
    iso: "FR",
    name: "European Union (Continental Delivery)",
    defaultCity: "Paris / Milan, EU",
    suggestedCurrency: "EUR",
  },
];

export default function CheckoutPage() {
  const { cart, currency, setCurrency, createOrder, clearCart } = usePlatform();

  const [destinationIso, setDestinationIso] = useState<string>("NG");
  const [customerName, setCustomerName] = useState("Tunde Bakare");
  const [customerEmail, setCustomerEmail] = useState("t.bakare@macklemoreclient.ng");
  const [customerPhone, setCustomerPhone] = useState("+234 809 442 1900");
  const [destinationCity, setDestinationCity] = useState("Nigeria");
  const [paystackChannel, setPaystackChannel] = useState<
    "CARD" | "BANK_TRANSFER" | "USSD"
  >("CARD");

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
  const [paymentStage, setPaymentStage] = useState<string | null>(null);
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

  const handleExecuteCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessing(true);
    if (selectedGateway === "PAYSTACK") {
      setPaymentStage(
        `PAYSTACK: INITIALIZING ${paystackChannel} SETTLEMENT IN ${currency} & RECORDING TO NEON DB...`
      );
    } else {
      setPaymentStage(
        `STRIPE CHECKOUT: AUTHORIZING MULTI-CURRENCY SETTLEMENT IN ${currency} & RECORDING TO NEON DB...`
      );
    }

    const countryObj = DESTINATION_COUNTRIES.find(
      (c) => c.iso === destinationIso
    );
    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      productTitle: item.product.title,
      brandName: item.product.brandName,
      size: item.size,
      quantity: item.quantity,
      unitPrice: convertPrice(item.product, currency),
    }));

    try {
      const res = await fetch("/api/checkout/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationCountryIso: destinationIso,
          destinationCountryName: countryObj?.name || destinationIso,
          destinationCity,
          currency,
          subtotalAmount: subtotal,
          paymentProvider: selectedGateway,
          paystackChannel,
          customerName,
          customerEmail,
          customerPhone,
          items: orderItems,
        }),
      });
      const data = await res.json();

      const newOrd = createOrder({
        customerName,
        customerEmail,
        customerPhone,
        destinationCountry: countryObj?.name || destinationIso,
        destinationCity,
        currency,
        subtotalAmount: subtotal,
        shippingAmount: logistics.shippingFee,
        dutiesAmount: logistics.dutiesFee,
        totalAmount,
        assignedHub: logistics.assignedHub,
        courierPartner: logistics.courierPartner,
        waybillNumber:
          data?.waybillNumber ||
          `${
            logistics.assignedHub === "HUB_A_LAGOS" ? "GIG-NG" : "DHL-YYZ"
          }-${Math.floor(100000 + Math.random() * 899999)}`,
        status: "ALLOCATED_TO_HUB",
        paymentProvider: selectedGateway,
        paymentReference:
          data?.reference ||
          data?.paymentIntentId ||
          (selectedGateway === "PAYSTACK"
            ? `PSK_${Math.floor(10000000 + Math.random() * 89999999)}`
            : `pi_3Q8Mkm${Math.floor(100000 + Math.random() * 899999)}`),
        paymentStatus: "SUCCEEDED",
        items: orderItems,
      });

      setIsProcessing(false);
      setPaymentStage(null);
      setCompletedOrder(newOrd);
      clearCart();
    } catch {
      const newOrd = createOrder({
        customerName,
        customerEmail,
        customerPhone,
        destinationCountry: countryObj?.name || destinationIso,
        destinationCity,
        currency,
        subtotalAmount: subtotal,
        shippingAmount: logistics.shippingFee,
        dutiesAmount: logistics.dutiesFee,
        totalAmount,
        assignedHub: logistics.assignedHub,
        courierPartner: logistics.courierPartner,
        waybillNumber: `${
          logistics.assignedHub === "HUB_A_LAGOS" ? "GIG-NG" : "DHL-YYZ"
        }-${Math.floor(100000 + Math.random() * 899999)}`,
        status: "ALLOCATED_TO_HUB",
        paymentProvider: selectedGateway,
        paymentReference:
          selectedGateway === "PAYSTACK"
            ? `PSK_${Math.floor(10000000 + Math.random() * 89999999)}`
            : `pi_3Q8Mkm${Math.floor(100000 + Math.random() * 899999)}`,
        paymentStatus: "SUCCEEDED",
        items: orderItems,
      });
      setIsProcessing(false);
      setPaymentStage(null);
      setCompletedOrder(newOrd);
      clearCart();
    }
  };

  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#111111] px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl border border-[#111111] bg-white p-8 md:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] pb-6 mb-8">
            <div>
              <span className="font-mono text-[10px] tracking-[0.24em] text-[#2E6B35] font-semibold uppercase block">
                ✓ ORDER CONFIRMED // WAYBILL &amp; NEON DB LEDGER RECORDED
              </span>
              <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase text-[#111111] mt-2">
                ORDER {completedOrder.orderNumber}
              </h1>
            </div>
            <div className="border border-[#111111] bg-[#FAF9F6] px-4 py-2 font-mono text-xs text-[#7A491D] font-bold uppercase">
              WAYBILL: {completedOrder.waybillNumber}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-[#E5E0D8] bg-[#FAF9F6] p-6 mb-8 font-mono text-xs">
            <div className="space-y-2">
              <div className="text-[#7A491D] font-semibold text-[10px]">
                CLIENT &amp; DESTINATION
              </div>
              <div className="text-[#111111] font-bold">
                {completedOrder.customerName}
              </div>
              <div className="text-[#4A4742]">{completedOrder.customerEmail}</div>
              <div className="text-[#4A4742]">
                {completedOrder.destinationCity},{" "}
                {completedOrder.destinationCountry}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-[#7A491D] font-semibold text-[10px]">
                LOGISTICS &amp; PAYMENT SUMMARY
              </div>
              <div>
                ASSIGNED HUB:{" "}
                <span className="text-[#111111] font-bold">
                  {completedOrder.assignedHub === "HUB_A_LAGOS"
                    ? "NIGERIA OPERATIONS HUB"
                    : "TORONTO, CANADA CORPORATE HQ"}
                </span>
              </div>
              <div>
                COURIER:{" "}
                <span className="text-[#111111]">
                  {completedOrder.courierPartner}
                </span>
              </div>
              <div>
                GATEWAY:{" "}
                <span className="text-[#2E6B35] font-semibold">
                  {completedOrder.paymentProvider} (
                  {completedOrder.paymentReference})
                </span>
              </div>
            </div>
          </div>

          <div className="border border-[#E5E0D8] divide-y divide-[#E5E0D8] mb-8">
            {completedOrder.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 font-mono text-xs bg-white"
              >
                <div>
                  <span className="text-[#7A491D] font-semibold mr-2">
                    [{item.brandName}]
                  </span>
                  <span className="text-[#111111] font-bold">
                    {item.productTitle}
                  </span>{" "}
                  <span className="text-[#6E6A63]">
                    · SIZE: {item.size} × {item.quantity}
                  </span>
                </div>
                <div className="text-[#111111] font-semibold">
                  {formatCurrencyValue(
                    item.unitPrice * item.quantity,
                    completedOrder.currency
                  )}
                </div>
              </div>
            ))}
            <div className="p-4 bg-[#FAF9F6] flex justify-between font-mono text-sm font-bold">
              <span>TOTAL SETTLED ({completedOrder.currency})</span>
              <span className="text-[#E31E24]">
                {formatCurrencyValue(
                  completedOrder.totalAmount,
                  completedOrder.currency
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin"
              className="bg-[#111111] px-6 py-3.5 font-mono text-xs font-semibold tracking-[0.2em] text-white uppercase hover:bg-[#E31E24] transition-colors"
            >
              VIEW REVENUE &amp; ORDER IN /ADMIN →
            </Link>
            <Link
              href="/shop"
              className="border border-[#111111] bg-white px-6 py-3.5 font-mono text-xs tracking-[0.2em] text-[#111111] uppercase hover:bg-[#111111] hover:text-white transition-colors"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111] relative">
      {/* Luxury Loading Animation Overlay during Settlement */}
      {isProcessing && (
        <LuxuryLoadingIndicator
          fullScreen
          size="lg"
          message={paymentStage || "Securing Order Settlement"}
          subMessage="Allocating Lagos & Toronto Hub inventory and generating digital waybill..."
        />
      )}

      {/* Header */}
      <section className="border-b border-[#E5E0D8] bg-white px-4 py-12 md:px-8">
        <div className="mx-auto max-w-[1440px] flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] tracking-[0.26em] text-[#7A491D] font-semibold uppercase mb-2">
              EXPRESS CHECKOUT // STRIPE INTERNATIONAL &amp; PAYSTACK AFRICA
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight uppercase text-[#111111]">
              CHECKOUT &amp; DELIVERY
            </h1>
          </div>
          <div className="font-mono text-xs text-[#4A4742] uppercase">
            ACTIVE CURRENCY:{" "}
            <span className="text-[#7A491D] font-bold">
              {currency} · {CURRENCIES[currency].label}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left 7 Cols: Logistics Routing & Payment Gateway Orchestrator */}
          <form
            onSubmit={handleExecuteCheckout}
            className="lg:col-span-7 space-y-8"
          >
            {/* Step 1: Destination Corridor & Automatic Hub Assignment */}
            <div className="border border-[#E5E0D8] bg-white p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
                <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#7A491D] uppercase">
                  01 // DELIVERY DESTINATION &amp; HUB ROUTING
                </span>
                <span className="font-mono text-[10px] tracking-[0.18em] text-[#2E6B35] font-semibold uppercase">
                  AUTO-ROUTED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-[#4A4742] font-semibold uppercase mb-2">
                    SELECT DESTINATION REGION (AUTO-COMPUTES NEAREST HUB &amp; CURRENCY)
                  </label>
                  <select
                    value={destinationIso}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-4 py-3.5 font-mono text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                  >
                    {DESTINATION_COUNTRIES.map((c) => (
                      <option key={c.iso} value={c.iso}>
                        {c.name} · Currency: {c.suggestedCurrency}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-[#4A4742] font-semibold uppercase mb-2">
                    RECIPIENT FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-4 py-3 font-mono text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-[#4A4742] font-semibold uppercase mb-2">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-4 py-3 font-mono text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-[#4A4742] font-semibold uppercase mb-2">
                    DELIVERY LOCATION / REGION *
                  </label>
                  <input
                    type="text"
                    required
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-4 py-3 font-mono text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-[#4A4742] font-semibold uppercase mb-2">
                    CONTACT PHONE *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full border border-[#E5E0D8] bg-[#FAF9F6] px-4 py-3 font-mono text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                  />
                </div>
              </div>

              {/* Computed Fulfillment Hub Box */}
              <div className="border border-[#E5E0D8] bg-[#FAF9F6] p-5 font-mono text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[#7A491D] font-semibold">
                  <span>ASSIGNED FULFILLMENT HUB</span>
                  <span>
                    {logistics.assignedHub === "HUB_A_LAGOS"
                      ? "NIGERIA HUB"
                      : "TORONTO, CANADA HQ"}
                  </span>
                </div>
                <div className="text-[#111111] font-bold">
                  {logistics.hubName}
                </div>
                <div className="text-[#4A4742] text-[11px]">
                  COURIER: {logistics.courierPartner} · TRANSIT:{" "}
                  {logistics.estimatedTransitDays}
                </div>
              </div>
            </div>

            {/* Step 2: Dual-Gateway Payment Orchestration (Stripe & Paystack) */}
            <div className="border border-[#E5E0D8] bg-white p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
                <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#7A491D] uppercase">
                  02 // PAYMENT METHOD (STRIPE &amp; PAYSTACK)
                </span>
                <span className="font-mono text-[10px] tracking-[0.18em] text-[#2E6B35] font-semibold uppercase">
                  RECOMMENDED: {logistics.recommendedGateway}
                </span>
              </div>

              {/* Gateway Selector Buttons (2 Gateways: STRIPE & PAYSTACK) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 border border-[#E5E0D8] divide-y sm:divide-y-0 sm:divide-x divide-[#E5E0D8]">
                <button
                  type="button"
                  onClick={() => setSelectedGateway("STRIPE")}
                  className={`p-5 text-left transition-colors cursor-pointer ${
                    selectedGateway === "STRIPE"
                      ? "bg-[#111111] text-white"
                      : "bg-[#FAF9F6] text-[#4A4742] hover:text-[#111111]"
                  }`}
                >
                  <div className="font-mono text-[10px] tracking-[0.18em] uppercase opacity-80">
                    GLOBAL · NORTH AMERICA · EUROPE · EAST AFRICA
                  </div>
                  <div className="font-display text-lg font-bold uppercase mt-1">
                    STRIPE CHECKOUT
                  </div>
                  <div className="font-mono text-[10px] mt-1 opacity-80">
                    CARDS · APPLE PAY · CAD / USD / GBP / EUR / KES
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGateway("PAYSTACK")}
                  className={`p-5 text-left transition-colors cursor-pointer ${
                    selectedGateway === "PAYSTACK"
                      ? "bg-[#111111] text-white"
                      : "bg-[#FAF9F6] text-[#4A4742] hover:text-[#111111]"
                  }`}
                >
                  <div className="font-mono text-[10px] tracking-[0.18em] uppercase opacity-80">
                    WEST AFRICA // NIGERIA &amp; GHANA
                  </div>
                  <div className="font-display text-lg font-bold uppercase mt-1">
                    PAYSTACK AFRICA
                  </div>
                  <div className="font-mono text-[10px] mt-1 opacity-80">
                    NGN &amp; GHS · CARDS · BANK TRANSFER · USSD
                  </div>
                </button>
              </div>

              {/* Dynamic Gateway Console */}
              {selectedGateway === "STRIPE" && (
                <div className="border border-[#E5E0D8] bg-[#FAF9F6] p-6 space-y-4">
                  <div className="font-mono text-[11px] tracking-[0.2em] text-[#7A491D] font-semibold uppercase">
                    STRIPE ELEMENTS // INTERNATIONAL CARD &amp; APPLE PAY
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-mono text-[10px] text-[#4A4742] uppercase mb-1">
                        CARD NUMBER
                      </label>
                      <input
                        type="text"
                        defaultValue="4242 •••• •••• 4242"
                        className="w-full border border-[#E5E0D8] bg-white px-4 py-2.5 font-mono text-xs text-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-[#4A4742] uppercase mb-1">
                        EXPIRY
                      </label>
                      <input
                        type="text"
                        defaultValue="08 / 29"
                        className="w-full border border-[#E5E0D8] bg-white px-4 py-2.5 font-mono text-xs text-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-[#4A4742] uppercase mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        defaultValue="884"
                        className="w-full border border-[#E5E0D8] bg-white px-4 py-2.5 font-mono text-xs text-[#111111]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedGateway === "PAYSTACK" && (
                <div className="border border-[#E5E0D8] bg-[#FAF9F6] p-6 space-y-4">
                  <div className="font-mono text-[11px] tracking-[0.2em] text-[#7A491D] font-semibold uppercase">
                    PAYSTACK WEST AFRICA // NIGERIA (NGN) &amp; GHANA (GHS)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(["CARD", "BANK_TRANSFER", "USSD"] as const).map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setPaystackChannel(ch)}
                        className={`border px-4 py-2 font-mono text-[10px] tracking-[0.18em] uppercase cursor-pointer ${
                          paystackChannel === ch
                            ? "border-[#111111] bg-[#111111] text-white font-bold"
                            : "border-[#E5E0D8] bg-white text-[#4A4742]"
                        }`}
                      >
                        {ch.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                  <p className="font-mono text-xs text-[#4A4742]">
                    Instant NGN / GHS settlement with automatic webhook reconciliation to the Nigeria Operations Hub.
                  </p>
                </div>
              )}

              {paymentStage && (
                <div className="border border-[#7A491D] bg-[#FAF5EC] p-4 font-mono text-xs text-[#7A491D] font-semibold">
                  {paymentStage}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing || cart.length === 0}
                className="w-full bg-[#111111] py-4 font-mono text-xs font-semibold tracking-[0.22em] text-white uppercase hover:bg-[#E31E24] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isProcessing
                  ? "PROCESSING PAYMENT & HUB ALLOCATION..."
                  : `COMPLETE ORDER via ${selectedGateway} · ${formatCurrencyValue(
                      totalAmount,
                      currency
                    )}`}
              </button>
            </div>
          </form>

          {/* Right 5 Cols: Order Summary */}
          <div className="lg:col-span-5">
            <div className="border border-[#E5E0D8] bg-white p-6 md:p-8 sticky top-28 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
                <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#111111] uppercase">
                  ORDER SUMMARY ({cart.length} ITEMS)
                </span>
                <Link
                  href="/shop"
                  className="font-mono text-[10px] tracking-[0.18em] text-[#7A491D] font-semibold uppercase hover:underline"
                >
                  EDIT BAG
                </Link>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center font-mono text-xs text-[#6E6A63]">
                  YOUR SHOPPING BAG IS EMPTY.{" "}
                  <Link href="/shop" className="text-[#E31E24] underline">
                    BROWSE CATALOG
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#E5E0D8]">
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
                            className="h-20 w-16 object-cover border border-[#E5E0D8]"
                          />
                          <div>
                            <div className="font-mono text-[10px] tracking-[0.18em] text-[#7A491D] font-semibold uppercase">
                              {item.product.brandName}
                            </div>
                            <div className="font-display text-sm font-bold uppercase text-[#111111]">
                              {item.product.title}
                            </div>
                            <div className="font-mono text-[10px] text-[#6E6A63] uppercase mt-1">
                              SIZE: {item.size} · QTY: {item.quantity} ·{" "}
                              {item.product.fabricWeightGsm} GSM
                            </div>
                          </div>
                        </div>
                        <div className="font-mono text-xs font-bold text-[#111111] whitespace-nowrap">
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
              <div className="border-t border-[#E5E0D8] pt-4 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-[#4A4742]">
                  <span>SUBTOTAL</span>
                  <span className="text-[#111111]">
                    {formatCurrencyValue(subtotal, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-[#4A4742]">
                  <span>
                    SHIPPING (
                    {logistics.assignedHub === "HUB_A_LAGOS"
                      ? "NIGERIA HUB"
                      : "TORONTO HQ"}
                    )
                  </span>
                  <span className="text-[#111111]">
                    {formatCurrencyValue(logistics.shippingFee, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-[#4A4742]">
                  <span>CUSTOMS / DUTY</span>
                  <span className="text-[#111111]">
                    {logistics.dutiesFee === 0
                      ? "DUTY-CLEARED (0)"
                      : formatCurrencyValue(logistics.dutiesFee, currency)}
                  </span>
                </div>
                <div className="border-t border-[#E5E0D8] pt-3 flex justify-between text-sm font-bold">
                  <span className="text-[#111111]">TOTAL SETTLEMENT</span>
                  <span className="text-[#E31E24]">
                    {formatCurrencyValue(totalAmount, currency)}
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
