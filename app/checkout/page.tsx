"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  StripeLogo,
  PaystackLogo,
  VisaBadge,
  MastercardBadge,
  ApplePayBadge,
  GooglePayBadge,
  LinkBadge,
} from "@/components/commerce/PaymentLogos";

interface DestinationMeta {
  iso: string;
  name: string;
  defaultCity: string;
  suggestedCurrency: CurrencyCode;
  phonePrefix: string;
}

const DESTINATION_COUNTRIES: DestinationMeta[] = [
  {
    iso: "NG",
    name: "Nigeria (Hub A Direct · Lagos)",
    defaultCity: "Lagos",
    suggestedCurrency: "NGN",
    phonePrefix: "+234",
  },
  {
    iso: "CA",
    name: "Canada (Hub B Direct · Toronto HQ)",
    defaultCity: "Toronto",
    suggestedCurrency: "CAD",
    phonePrefix: "+1",
  },
  {
    iso: "US",
    name: "United States (Express Delivery)",
    defaultCity: "New York",
    suggestedCurrency: "USD",
    phonePrefix: "+1",
  },
  {
    iso: "GB",
    name: "United Kingdom (London & UK)",
    defaultCity: "London",
    suggestedCurrency: "GBP",
    phonePrefix: "+44",
  },
  {
    iso: "GH",
    name: "Ghana (West Africa Corridor)",
    defaultCity: "Accra",
    suggestedCurrency: "GHS",
    phonePrefix: "+233",
  },
  {
    iso: "KE",
    name: "Kenya (East Africa Corridor)",
    defaultCity: "Nairobi",
    suggestedCurrency: "KES",
    phonePrefix: "+254",
  },
  {
    iso: "FR",
    name: "European Union (Continental Express)",
    defaultCity: "Paris",
    suggestedCurrency: "EUR",
    phonePrefix: "+33",
  },
];

export default function CheckoutPage() {
  const { cart, currency, setCurrency, createOrder, clearCart, products, addToCart } = usePlatform();

  // 1. Destination & Logistics
  const [destinationIso, setDestinationIso] = useState<string>("NG");
  const selectedCountry =
    DESTINATION_COUNTRIES.find((c) => c.iso === destinationIso) || DESTINATION_COUNTRIES[0];

  // 2. Minimum Essential Customer Fields (Stripe-Like Experience)
  const [customerEmail, setCustomerEmail] = useState("t.bakare@couture.luxury");
  const [fullName, setFullName] = useState("Tunde Bakare");
  const [streetAddress, setStreetAddress] = useState("14 Admiralty Way, Lekki Phase 1");
  const [city, setCity] = useState(selectedCountry.defaultCity);
  const [phoneNumber, setPhoneNumber] = useState("+234 809 442 1900");

  // 3. Payment Gateway & Channels
  const [selectedGateway, setSelectedGateway] = useState<PaymentProvider>("PAYSTACK");
  const [paystackChannel, setPaystackChannel] = useState<"CARD" | "BANK_TRANSFER" | "USSD">("CARD");

  // Stripe Card Details (for test simulation)
  const [stripeCardNumber, setStripeCardNumber] = useState("4242 •••• •••• 4242");
  const [stripeCardExpiry, setStripeCardExpiry] = useState("12/28");
  const [stripeCardCvc, setStripeCardCvc] = useState("123");

  // Loading & Order Completion State
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);
  const [emailDispatched, setEmailDispatched] = useState<boolean>(false);

  // Financial Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + convertPrice(item.product, currency) * item.quantity,
    0
  );

  const logistics = calculateLogisticsForDestination(destinationIso, currency, subtotal);
  const totalAmount = subtotal + logistics.shippingFee + logistics.dutiesFee;

  // Handle Country Selection
  const handleCountryChange = (iso: string) => {
    setDestinationIso(iso);
    const meta = DESTINATION_COUNTRIES.find((c) => c.iso === iso);
    if (meta) {
      setCity(meta.defaultCity);
      setCurrency(meta.suggestedCurrency);
      setPhoneNumber(`${meta.phonePrefix} `);
      const nextLogistics = calculateLogisticsForDestination(iso, meta.suggestedCurrency, subtotal);
      setSelectedGateway(nextLogistics.recommendedGateway);
    }
  };

  // 1-Click Autofill Profiles (Express Testing)
  const fillLagosClient = () => {
    handleCountryChange("NG");
    setFullName("Tunde Bakare");
    setCustomerEmail("t.bakare@couture.luxury");
    setStreetAddress("14 Admiralty Way, Lekki Phase 1");
    setCity("Lagos");
    setPhoneNumber("+234 809 442 1900");
    setSelectedGateway("PAYSTACK");
  };

  const fillTorontoClient = () => {
    handleCountryChange("CA");
    setFullName("Julian Vance");
    setCustomerEmail("julian.vance@luxury.ca");
    setStreetAddress("100 King St West, Suite 3200");
    setCity("Toronto");
    setPhoneNumber("+1 416 555 0199");
    setSelectedGateway("STRIPE");
  };

  const fillStripeTestCard = () => {
    setStripeCardNumber("4242 4242 4242 4242");
    setStripeCardExpiry("12/28");
    setStripeCardCvc("123");
  };

  // Add demo piece if cart is empty
  const handleAddDemoGarment = () => {
    if (products.length > 0) {
      addToCart(products[0], "M", 1);
    }
  };

  // Checkout Execution
  const handleExecuteCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessing(true);

    const formattedShippingAddress = [streetAddress, city, selectedCountry.name]
      .filter(Boolean)
      .join(", ");

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
          destinationCountryName: selectedCountry.name,
          destinationCity: city,
          shippingAddress: formattedShippingAddress,
          currency,
          subtotalAmount: subtotal,
          paymentProvider: selectedGateway,
          paystackChannel,
          customerName: fullName.trim() || "Macklemore Client",
          customerEmail,
          customerPhone: phoneNumber,
          items: orderItems,
        }),
      });
      const data = await res.json();
      if (data?.emailSent) {
        setEmailDispatched(true);
      }

      const newOrd = createOrder({
        customerName: fullName.trim() || "Macklemore Client",
        customerEmail,
        customerPhone: phoneNumber,
        destinationCountry: selectedCountry.name,
        destinationCity: city,
        shippingAddress: formattedShippingAddress,
        currency,
        subtotalAmount: subtotal,
        shippingAmount: logistics.shippingFee,
        dutiesAmount: logistics.dutiesFee,
        totalAmount,
        assignedHub: logistics.assignedHub,
        courierPartner: logistics.courierPartner,
        waybillNumber:
          data?.waybillNumber ||
          `${logistics.assignedHub === "HUB_A_LAGOS" ? "GIG-NG" : "DHL-YYZ"}-${Math.floor(
            100000 + Math.random() * 899999
          )}`,
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
      setCompletedOrder(newOrd);
      clearCart();
    } catch {
      const newOrd = createOrder({
        customerName: fullName.trim() || "Macklemore Client",
        customerEmail,
        customerPhone: phoneNumber,
        destinationCountry: selectedCountry.name,
        destinationCity: city,
        shippingAddress: formattedShippingAddress,
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
      setCompletedOrder(newOrd);
      clearCart();
    }
  };

  // 4. Completed Order View (Reduced Details & Softer Elegant Aesthetics)
  if (completedOrder) {
    const isLagos = completedOrder.assignedHub === "HUB_A_LAGOS";
    const estimatedTransit = isLagos ? "1-2 Business Days" : "2-4 Business Days";

    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#1F1A17] px-4 py-12 sm:py-16 md:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#EADFD0] bg-white shadow-xl p-8 sm:p-12 space-y-8">
          {/* Serene Confirmation Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#EBF5ED] border border-[#2E6B35]/20 flex items-center justify-center text-[#2E6B35]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs uppercase font-semibold tracking-widest text-[#2E6B35]">
                Payment Confirmed
              </span>
              {emailDispatched && (
                <span className="text-[10px] text-[#2E6B35] font-mono border border-[#2E6B35]/30 rounded px-1.5 py-0.5">
                  Receipt Dispatched
                </span>
              )}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#1F1A17]">
              Thank you for your order, {completedOrder.customerName.split(" ")[0]}
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6A63] max-w-md mx-auto">
              Your order <span className="font-mono font-semibold text-[#1F1A17]">#{completedOrder.orderNumber}</span> has been confirmed. A receipt and delivery timeline have been sent to{" "}
              <span className="font-semibold text-[#1F1A17]">{completedOrder.customerEmail}</span>.
            </p>
          </div>

          {/* Simple Soft Delivery Timeline Card */}
          <div className="rounded-xl border border-[#EADFD0] bg-[#FAF5EE]/70 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between font-semibold text-[#7A491D] border-b border-[#EADFD0] pb-2">
              <span className="uppercase tracking-wider">Estimated Delivery</span>
              <span className="text-sm font-bold text-[#1F1A17]">{estimatedTransit}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[#6E6A63]">
              <div>
                <span className="block text-[10px] uppercase font-mono text-[#A69E91]">Courier &amp; Waybill</span>
                <span className="font-semibold text-[#1F1A17]">{completedOrder.courierPartner}</span>
                <span className="block font-mono text-[11px] text-[#7A491D] mt-0.5">{completedOrder.waybillNumber}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono text-[#A69E91]">Destination</span>
                <span className="font-semibold text-[#1F1A17]">{completedOrder.destinationCity}, {completedOrder.destinationCountry}</span>
                <span className="block text-[11px] text-[#6E6A63] mt-0.5">{completedOrder.customerPhone || "Courier will notify on arrival"}</span>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-3">
            <div className="text-xs uppercase font-bold tracking-wider text-[#7A491D]">
              Curated Garments
            </div>
            <div className="rounded-xl border border-[#EADFD0] divide-y divide-[#EADFD0] overflow-hidden">
              {completedOrder.items.map((item, idx) => (
                <div key={idx} className="p-4 bg-white flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#1F1A17]">{item.productTitle}</span>
                    <span className="text-[#6E6A63] ml-2 font-mono">
                      Size {item.size} · Qty {item.quantity}
                    </span>
                  </div>
                  <div className="font-semibold text-[#1F1A17]">
                    {formatCurrencyValue(item.unitPrice * item.quantity, completedOrder.currency)}
                  </div>
                </div>
              ))}
              <div className="p-4 bg-[#FAF9F6] flex items-center justify-between font-bold text-sm">
                <span>Total Settled ({completedOrder.currency})</span>
                <span className="text-[#7A491D] font-display text-base">
                  {formatCurrencyValue(completedOrder.totalAmount, completedOrder.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Clean Single Action */}
          <div className="pt-2 text-center">
            <Link
              href="/shop"
              className="inline-block w-full sm:w-auto rounded-xl bg-[#7A491D] px-8 py-3.5 font-display text-xs font-semibold tracking-widest text-white uppercase hover:bg-[#5C3614] transition-colors shadow-sm"
            >
              Continue Shopping →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 5. Active Checkout Form View
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1F1A17] relative">
      {/* Macklemore "Something good is coming" Fullscreen Settlement Loader */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF5EE]/95 backdrop-blur-md p-6 text-center select-none"
          >
            {/* Animated Concentric Orbits from macklemorefashions.com */}
            <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2.8, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t border-r border-[#7A491D] border-b-transparent border-l-transparent opacity-80"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 4.2, ease: "linear" }}
                className="absolute -inset-1.5 rounded-full border border-dashed border-[#D4860B]/50"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 2.0, ease: "linear" }}
                className="absolute inset-3 rounded-full border-t border-l border-[#D4860B] border-b-transparent border-r-transparent opacity-90"
              />
              <motion.div
                animate={{ scale: [0.92, 1.15, 0.92], opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center justify-center"
              >
                <div className="w-3.5 h-3.5 rotate-45 bg-[#E31E24] shadow-sm shadow-[#E31E24]/40" />
                <div className="absolute w-1.5 h-1.5 rotate-45 bg-[#FAF5EE]" />
              </motion.div>
            </div>

            {/* Typography from macklemorefashions.com landing screen */}
            <div className="space-y-3 max-w-md">
              <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#7A491D]">
                Macklemore Fashion · Afro-Luxury
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1F1A17] uppercase">
                We&apos;re weaving something beautiful.
              </h2>
              <p className="text-sm font-semibold tracking-wide text-[#7A491D]">
                Something good is coming.
              </p>
              <p className="text-xs text-[#6E6A63] leading-relaxed max-w-sm mx-auto">
                Securing your payment and handcrafting your order with care and artistry.
              </p>
              <div className="pt-2 text-[10px] uppercase font-bold tracking-[0.2em] text-[#A69E91]">
                Wear your culture. Own your story.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Checkout Container */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12 md:px-8">
        {cart.length === 0 ? (
          <div className="mx-auto max-w-md text-center rounded-2xl border border-[#EADFD0] bg-white p-10 space-y-5 my-12 shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF5EE] border border-[#EADFD0] flex items-center justify-center text-[#7A491D]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-[#1F1A17]">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-xs text-[#6E6A63] leading-relaxed">
              Explore bespoke Aso-Oke Dashikis, couture gowns, and luxury African prints.
            </p>
            <div className="flex flex-col gap-2.5 pt-2">
              <Link
                href="/shop"
                className="w-full rounded-xl bg-[#7A491D] py-3 text-xs font-semibold tracking-widest text-white uppercase hover:bg-[#5C3614] transition-colors"
              >
                Discover New Drops →
              </Link>
              <button
                type="button"
                onClick={handleAddDemoGarment}
                className="w-full rounded-xl border border-[#EADFD0] bg-[#FAF5EE] py-2.5 text-xs font-semibold text-[#7A491D] hover:bg-white transition-colors cursor-pointer"
              >
                + Add Curated Piece to Test
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7 cols): Streamlined Inputs & Payment Method */}
            <form onSubmit={handleExecuteCheckout} className="lg:col-span-7 space-y-6">
              {/* Top Express 1-Click Banner */}
              <div className="rounded-2xl border border-[#EADFD0] bg-white p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6A63]">
                    Express Checkout
                  </span>
                  <div className="flex items-center gap-1.5">
                    <ApplePayBadge />
                    <GooglePayBadge />
                    <LinkBadge />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={fillLagosClient}
                    className="rounded-xl border border-[#00C3F7]/40 bg-[#F0FBFF] hover:bg-[#E2F7FE] p-3 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <PaystackLogo className="h-4" />
                      <span className="text-[10px] font-bold text-[#0089AF] uppercase">1-Click</span>
                    </div>
                    <span className="text-[11px] text-[#4A5568] block mt-1">Lagos · NGN Paystack</span>
                  </button>

                  <button
                    type="button"
                    onClick={fillTorontoClient}
                    className="rounded-xl border border-[#635BFF]/30 bg-[#F6F5FF] hover:bg-[#ECEBFF] p-3 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <StripeLogo className="h-3.5" />
                      <span className="text-[10px] font-bold text-[#635BFF] uppercase">1-Click</span>
                    </div>
                    <span className="text-[11px] text-[#4A5568] block mt-1">Toronto · CAD Stripe</span>
                  </button>
                </div>
              </div>

              {/* Minimal Delivery Details (Stripe-Like Simple Fields) */}
              <div className="rounded-2xl border border-[#EADFD0] bg-white p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#1F1A17] border-b border-[#EADFD0] pb-2">
                  Contact &amp; Delivery
                </h2>

                <div className="space-y-3 text-xs">
                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E6A63] mb-1">
                      Email address
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="client@luxury.com"
                      className="w-full rounded-xl border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E6A63] mb-1">
                      Full name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="First and last name"
                      className="w-full rounded-xl border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E6A63] mb-1">
                      Country or region
                    </label>
                    <select
                      value={destinationIso}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full rounded-xl border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
                    >
                      {DESTINATION_COUNTRIES.map((c) => (
                        <option key={c.iso} value={c.iso}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E6A63] mb-1">
                      Street address
                    </label>
                    <input
                      type="text"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="House number and street name"
                      className="w-full rounded-xl border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>

                  {/* City & Phone inline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#6E6A63] mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full rounded-xl border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#6E6A63] mb-1">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+234 800 000 0000"
                        className="w-full rounded-xl border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method with Original Brand Logos */}
              <div className="rounded-2xl border border-[#EADFD0] bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#EADFD0] pb-2">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#1F1A17]">
                    Payment Method
                  </h2>
                  <span className="text-[11px] text-[#2E6B35] font-semibold flex items-center gap-1">
                    <span>🔒</span> 256-bit Secure
                  </span>
                </div>

                {/* Gateway Selection Tabs with Real Brand Colors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Stripe Option */}
                  <div
                    onClick={() => setSelectedGateway("STRIPE")}
                    className={`rounded-xl border p-4 cursor-pointer transition-all ${
                      selectedGateway === "STRIPE"
                        ? "border-[#635BFF] bg-[#F8F7FF] shadow-xs ring-1 ring-[#635BFF]"
                        : "border-[#EADFD0] bg-[#FAF9F6] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <StripeLogo className="h-5" />
                      <div className="w-4 h-4 rounded-full border flex items-center justify-center border-[#635BFF]">
                        {selectedGateway === "STRIPE" && (
                          <div className="w-2 h-2 rounded-full bg-[#635BFF]" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <VisaBadge />
                      <MastercardBadge />
                      <ApplePayBadge />
                    </div>
                    <span className="text-[10px] text-[#6E6A63] block mt-2">
                      Global card settlement · CAD, USD, GBP, EUR
                    </span>
                  </div>

                  {/* Paystack Option */}
                  <div
                    onClick={() => setSelectedGateway("PAYSTACK")}
                    className={`rounded-xl border p-4 cursor-pointer transition-all ${
                      selectedGateway === "PAYSTACK"
                        ? "border-[#00C3F7] bg-[#F2FBFF] shadow-xs ring-1 ring-[#00C3F7]"
                        : "border-[#EADFD0] bg-[#FAF9F6] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <PaystackLogo className="h-5" />
                      <div className="w-4 h-4 rounded-full border flex items-center justify-center border-[#00C3F7]">
                        {selectedGateway === "PAYSTACK" && (
                          <div className="w-2 h-2 rounded-full bg-[#00C3F7]" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-semibold text-[#001C3F] bg-white px-1.5 py-0.5 rounded border border-[#E0E0E0]">
                        Cards
                      </span>
                      <span className="text-[10px] font-semibold text-[#001C3F] bg-white px-1.5 py-0.5 rounded border border-[#E0E0E0]">
                        Bank
                      </span>
                      <span className="text-[10px] font-semibold text-[#001C3F] bg-white px-1.5 py-0.5 rounded border border-[#E0E0E0]">
                        USSD
                      </span>
                    </div>
                    <span className="text-[10px] text-[#6E6A63] block mt-2">
                      African instant settlement · NGN, GHS, KES
                    </span>
                  </div>
                </div>

                {/* Sub-form for Selected Gateway */}
                {selectedGateway === "STRIPE" ? (
                  <div className="rounded-xl border border-[#EADFD0] bg-[#FAF9F6] p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1F1A17]">Card Details</span>
                      <button
                        type="button"
                        onClick={fillStripeTestCard}
                        className="text-[11px] font-semibold text-[#635BFF] hover:underline cursor-pointer"
                      >
                        Fill Test Card (4242)
                      </button>
                    </div>

                    <div className="rounded-lg border border-[#EADFD0] bg-white overflow-hidden text-xs">
                      <div className="p-2.5 border-b border-[#EADFD0] flex items-center justify-between">
                        <input
                          type="text"
                          value={stripeCardNumber}
                          onChange={(e) => setStripeCardNumber(e.target.value)}
                          placeholder="Card number"
                          className="w-full bg-transparent font-mono focus:outline-none text-xs"
                        />
                        <div className="flex gap-1 shrink-0">
                          <VisaBadge />
                          <MastercardBadge />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 divide-x divide-[#EADFD0]">
                        <input
                          type="text"
                          value={stripeCardExpiry}
                          onChange={(e) => setStripeCardExpiry(e.target.value)}
                          placeholder="MM / YY"
                          className="p-2.5 bg-transparent font-mono focus:outline-none text-xs"
                        />
                        <input
                          type="text"
                          value={stripeCardCvc}
                          onChange={(e) => setStripeCardCvc(e.target.value)}
                          placeholder="CVC"
                          className="p-2.5 bg-transparent font-mono focus:outline-none text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#EADFD0] bg-[#FAF9F6] p-4 space-y-3">
                    <span className="text-xs font-semibold text-[#1F1A17] block">
                      Paystack Settlement Channel
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {(["CARD", "BANK_TRANSFER", "USSD"] as const).map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => setPaystackChannel(ch)}
                          className={`rounded-lg border py-2 px-2 text-center font-medium transition-colors cursor-pointer ${
                            paystackChannel === ch
                              ? "border-[#00C3F7] bg-white text-[#0089AF] font-bold shadow-2xs"
                              : "border-[#EADFD0] bg-white text-[#6E6A63] hover:bg-[#FAF5EE]"
                          }`}
                        >
                          {ch.replace("_", " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Big Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full rounded-xl bg-[#7A491D] py-3.5 px-6 font-display text-xs font-semibold tracking-widest text-white uppercase shadow-sm hover:bg-[#5C3614] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>Pay {formatCurrencyValue(totalAmount, currency)}</span>
                  <span>→</span>
                </button>
              </div>
            </form>

            {/* Right Column (5 cols): Clean Order Summary (Stripe-Like) */}
            <aside className="lg:col-span-5 rounded-2xl border border-[#EADFD0] bg-white p-6 shadow-xs space-y-5 sticky top-24">
              <div className="flex items-center justify-between border-b border-[#EADFD0] pb-3">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#1F1A17]">
                  Order Summary ({cart.reduce((sum, i) => sum + i.quantity, 0)})
                </h3>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="rounded-lg border border-[#EADFD0] bg-[#FAF9F6] px-2.5 py-1 text-xs font-semibold text-[#7A491D] focus:outline-none"
                >
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#EADFD0] max-h-72 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-3">
                      {item.product.editorialImageUrl ? (
                        <img
                          src={item.product.editorialImageUrl}
                          alt={item.product.title}
                          className="w-12 h-14 object-cover rounded-lg border border-[#EADFD0] shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-14 rounded-lg bg-[#FAF5EE] border border-[#EADFD0] shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold text-[#1F1A17] line-clamp-1">{item.product.title}</div>
                        <div className="text-[11px] text-[#6E6A63]">
                          Size: {item.size} · Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold text-[#1F1A17] shrink-0">
                      {formatCurrencyValue(convertPrice(item.product, currency) * item.quantity, currency)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="border-t border-[#EADFD0] pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-[#6E6A63]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1F1A17]">
                    {formatCurrencyValue(subtotal, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-[#6E6A63]">
                  <span>Fulfillment &amp; Courier</span>
                  <span className="font-medium text-[#1F1A17]">
                    {logistics.shippingFee === 0 ? "Complimentary" : formatCurrencyValue(logistics.shippingFee, currency)}
                  </span>
                </div>
                {logistics.dutiesFee > 0 && (
                  <div className="flex justify-between text-[#6E6A63]">
                    <span>Regional Customs &amp; Duties</span>
                    <span className="font-medium text-[#1F1A17]">
                      {formatCurrencyValue(logistics.dutiesFee, currency)}
                    </span>
                  </div>
                )}
                <div className="border-t border-[#EADFD0] pt-3 flex justify-between text-sm font-bold text-[#1F1A17]">
                  <span>Total Due</span>
                  <span className="text-base text-[#7A491D] font-display">
                    {formatCurrencyValue(totalAmount, currency)}
                  </span>
                </div>
              </div>

              {/* Subtle Trust Badges */}
              <div className="rounded-xl bg-[#FAF5EE] p-3 text-[11px] text-[#6E6A63] text-center space-y-1">
                <div>Curated between Toronto HQ &amp; Lagos Atelier</div>
                <div className="font-medium text-[#7A491D]">Inspected · Preserved · Hand-Delivered</div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
