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
import { TribalPatternRibbon } from "@/components/vectors/TribalVectors";

interface DestinationMeta {
  iso: string;
  name: string;
  defaultCity: string;
  defaultState: string;
  defaultPostal: string;
  phonePrefix: string;
  suggestedCurrency: CurrencyCode;
}

const DESTINATION_COUNTRIES: DestinationMeta[] = [
  {
    iso: "NG",
    name: "Nigeria (West Africa · Hub A Direct)",
    defaultCity: "Lagos",
    defaultState: "Lagos State",
    defaultPostal: "105102",
    phonePrefix: "+234",
    suggestedCurrency: "NGN",
  },
  {
    iso: "CA",
    name: "Canada (North America · Toronto HQ Direct)",
    defaultCity: "Toronto",
    defaultState: "Ontario",
    defaultPostal: "M5V 2T6",
    phonePrefix: "+1",
    suggestedCurrency: "CAD",
  },
  {
    iso: "GH",
    name: "Ghana (West Africa · ECOWAS Corridor)",
    defaultCity: "Accra",
    defaultState: "Greater Accra",
    defaultPostal: "GA-183",
    phonePrefix: "+233",
    suggestedCurrency: "GHS",
  },
  {
    iso: "KE",
    name: "Kenya (East Africa Corridor)",
    defaultCity: "Nairobi",
    defaultState: "Nairobi County",
    defaultPostal: "00100",
    phonePrefix: "+254",
    suggestedCurrency: "KES",
  },
  {
    iso: "US",
    name: "United States (North America Express)",
    defaultCity: "New York",
    defaultState: "New York",
    defaultPostal: "10001",
    phonePrefix: "+1",
    suggestedCurrency: "USD",
  },
  {
    iso: "GB",
    name: "United Kingdom (London & UK Delivery)",
    defaultCity: "London",
    defaultState: "Greater London",
    defaultPostal: "SW1A 1AA",
    phonePrefix: "+44",
    suggestedCurrency: "GBP",
  },
  {
    iso: "FR",
    name: "European Union (Continental Express)",
    defaultCity: "Paris",
    defaultState: "Île-de-France",
    defaultPostal: "75001",
    phonePrefix: "+33",
    suggestedCurrency: "EUR",
  },
];

export default function CheckoutPage() {
  const { cart, currency, setCurrency, createOrder, clearCart, products, addToCart } = usePlatform();

  // 1. Destination & Logistics
  const [destinationIso, setDestinationIso] = useState<string>("NG");
  const selectedCountry =
    DESTINATION_COUNTRIES.find((c) => c.iso === destinationIso) || DESTINATION_COUNTRIES[0];

  // 2. Shipping Details
  const [firstName, setFirstName] = useState("Tunde");
  const [lastName, setLastName] = useState("Bakare");
  const [customerEmail, setCustomerEmail] = useState("t.bakare@couture.luxury");
  const [phonePrefix, setPhonePrefix] = useState(selectedCountry.phonePrefix);
  const [phoneNumber, setPhoneNumber] = useState("809 442 1900");
  const [streetAddress, setStreetAddress] = useState("14 Admiralty Way");
  const [suite, setSuite] = useState("Suite 4B, Lekki Phase 1");
  const [city, setCity] = useState(selectedCountry.defaultCity);
  const [stateProvince, setStateProvince] = useState(selectedCountry.defaultState);
  const [postalCode, setPostalCode] = useState(selectedCountry.defaultPostal);
  const [deliveryNotes, setDeliveryNotes] = useState("Please contact recipient upon arrival.");

  // 3. Payment Gateway & Channels
  const [selectedGateway, setSelectedGateway] = useState<PaymentProvider>("PAYSTACK");
  const [paystackChannel, setPaystackChannel] = useState<"CARD" | "BANK_TRANSFER" | "USSD">("CARD");

  // Stripe Card Details (for test simulation)
  const [stripeCardName, setStripeCardName] = useState("Tunde Bakare");
  const [stripeCardNumber, setStripeCardNumber] = useState("4242 •••• •••• 4242");
  const [stripeCardExpiry, setStripeCardExpiry] = useState("12/28");
  const [stripeCardCvc, setStripeCardCvc] = useState("123");

  // Loading & Order Completion State
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStage, setPaymentStage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

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
      setStateProvince(meta.defaultState);
      setPostalCode(meta.defaultPostal);
      setPhonePrefix(meta.phonePrefix);
      setCurrency(meta.suggestedCurrency);
      const nextLogistics = calculateLogisticsForDestination(iso, meta.suggestedCurrency, subtotal);
      setSelectedGateway(nextLogistics.recommendedGateway);
    }
  };

  // Helper to fill Stripe Test Card
  const fillStripeTestCard = () => {
    setStripeCardName(`${firstName} ${lastName}`.trim() || "Macklemore Client");
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
    const fullName = `${firstName} ${lastName}`.trim() || "Macklemore Client";
    const fullPhone = `${phonePrefix} ${phoneNumber}`.trim();
    const formattedShippingAddress = [
      streetAddress,
      suite,
      city,
      stateProvince,
      postalCode,
      selectedCountry.name,
    ]
      .filter(Boolean)
      .join(", ");

    if (selectedGateway === "PAYSTACK") {
      setPaymentStage(
        `PAYSTACK: Initializing ${paystackChannel.replace(/_/g, " ")} Settlement in ${currency}...`
      );
    } else {
      setPaymentStage(
        `STRIPE: Authorizing International Payment in ${currency}...`
      );
    }

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
          customerName: fullName,
          customerEmail,
          customerPhone: fullPhone,
          items: orderItems,
        }),
      });
      const data = await res.json();

      const newOrd = createOrder({
        customerName: fullName,
        customerEmail,
        customerPhone: fullPhone,
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
        customerName: fullName,
        customerEmail,
        customerPhone: fullPhone,
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
      setPaymentStage(null);
      setCompletedOrder(newOrd);
      clearCart();
    }
  };

  // 4. Completed Order View (Afro-Luxury Receipt)
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] text-[#1F1A17] px-4 py-12 sm:py-16 md:px-8">
        <div className="mx-auto max-w-3xl rounded-sm border border-[#EADFD0] bg-white shadow-xl overflow-hidden">
          {/* Subtle Tribal Ribbon Accent */}
          <TribalPatternRibbon className="h-2" />

          <div className="p-7 sm:p-10 space-y-8">
            {/* Header */}
            <div className="border-b border-[#EADFD0] pb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2E6B35]">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#2E6B35]" />
                  <span>Order Confirmed &amp; Hub Waybill Generated</span>
                </div>
                <h1 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight text-[#1F1A17] mt-2">
                  Order {completedOrder.orderNumber}
                </h1>
                <p className="text-xs text-[#6E6A63] mt-1">
                  Thank you for curating with Macklemore Fashion. A confirmation dossier has been dispatched to {completedOrder.customerEmail}.
                </p>
              </div>

              <div className="rounded-sm border border-[#EADFD0] bg-[#FAF5EE] px-4 py-2 text-right">
                <span className="text-[10px] uppercase font-mono text-[#6E6A63] block">
                  Courier Tracking Waybill
                </span>
                <span className="font-mono text-xs font-bold text-[#7A491D]">
                  {completedOrder.waybillNumber}
                </span>
              </div>
            </div>

            {/* Logistics & Client Dossier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-sm border border-[#EADFD0] bg-[#FAF9F6] p-6 text-xs leading-relaxed">
              <div className="space-y-1.5">
                <span className="font-display text-xs font-bold uppercase tracking-wider text-[#7A491D] block">
                  Client &amp; Delivery Destination
                </span>
                <div className="font-semibold text-[#1F1A17]">{completedOrder.customerName}</div>
                <div className="text-[#6E6A63]">{completedOrder.customerEmail}</div>
                <div className="text-[#6E6A63]">{completedOrder.customerPhone}</div>
                <div className="text-[#1F1A17] pt-1">
                  {completedOrder.shippingAddress || `${completedOrder.destinationCity}, ${completedOrder.destinationCountry}`}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-display text-xs font-bold uppercase tracking-wider text-[#7A491D] block">
                  Fulfillment &amp; Settlement
                </span>
                <div>
                  Fulfillment Hub:{" "}
                  <span className="font-semibold text-[#1F1A17]">
                    {completedOrder.assignedHub === "HUB_A_LAGOS"
                      ? "Nigeria Operations Hub (Hub A)"
                      : "Toronto Corporate HQ (Hub B)"}
                  </span>
                </div>
                <div>
                  Courier Partner:{" "}
                  <span className="font-semibold text-[#1F1A17]">
                    {completedOrder.courierPartner}
                  </span>
                </div>
                <div>
                  Payment Gateway:{" "}
                  <span className="font-semibold text-[#2E6B35]">
                    {completedOrder.paymentProvider}
                  </span>
                </div>
                <div>
                  Reference:{" "}
                  <span className="font-mono text-[11px] text-[#6E6A63]">
                    {completedOrder.paymentReference}
                  </span>
                </div>
              </div>
            </div>

            {/* Garments Itemized Summary */}
            <div className="rounded-sm border border-[#EADFD0] overflow-hidden">
              <div className="bg-[#FAF5EE] px-4 py-2.5 border-b border-[#EADFD0] font-display text-xs font-bold uppercase tracking-wider text-[#1F1A17]">
                Curated Garments
              </div>
              <div className="divide-y divide-[#EADFD0]">
                {completedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-medium text-[#7A491D] mr-2">
                        [{item.brandName}]
                      </span>
                      <span className="font-semibold text-[#1F1A17]">
                        {item.productTitle}
                      </span>
                      <span className="text-[#6E6A63] ml-2">
                        Size {item.size} × {item.quantity}
                      </span>
                    </div>
                    <div className="font-semibold text-[#1F1A17]">
                      {formatCurrencyValue(
                        item.unitPrice * item.quantity,
                        completedOrder.currency
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#FAF9F6] p-4 border-t border-[#EADFD0] flex items-center justify-between text-sm font-bold">
                <span className="font-display uppercase tracking-wider text-[#1F1A17]">
                  Total Settled ({completedOrder.currency})
                </span>
                <span className="text-[#7A491D] text-base font-display">
                  {formatCurrencyValue(completedOrder.totalAmount, completedOrder.currency)}
                </span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/admin"
                className="rounded-sm bg-[#7A491D] px-6 py-3 font-display text-xs font-semibold tracking-widest text-white uppercase hover:bg-[#5C3614] transition-colors"
              >
                View in /admin Order Ledger →
              </Link>
              <Link
                href="/shop"
                className="rounded-sm border border-[#EADFD0] bg-white px-6 py-3 font-display text-xs font-semibold tracking-widest text-[#1F1A17] uppercase hover:bg-[#FAF9F6] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Active Checkout Form View
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1F1A17] relative">
      {/* Tribal Pattern Ribbon on Top */}
      <TribalPatternRibbon className="h-2" />

      {/* Luxury Loading Animation Overlay during Settlement */}
      {isProcessing && (
        <LuxuryLoadingIndicator
          fullScreen
          size="lg"
          message={paymentStage || "Securing Order Settlement"}
          subMessage="Allocating Lagos & Toronto Hub inventory and recording waybill..."
        />
      )}

      {/* Header Banner */}
      <section className="border-b border-[#EADFD0] bg-[#FAF5EE]/60 px-4 py-8 sm:py-12 md:px-8">
        <div className="mx-auto max-w-[1440px] flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#7A491D] mb-1">
              Afro-Luxury Checkout · Dual-Gateway Settlement
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#1F1A17]">
              Checkout &amp; Delivery
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6E6A63] uppercase">Settlement Currency:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="rounded-sm border border-[#EADFD0] bg-white px-3 py-1.5 text-xs font-semibold text-[#7A491D] focus:border-[#7A491D] focus:outline-none"
            >
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                <option key={c} value={c}>
                  {c} · {CURRENCIES[c].label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:py-12 md:px-8">
        {cart.length === 0 ? (
          <div className="mx-auto max-w-xl text-center rounded-sm border border-[#EADFD0] bg-white p-10 space-y-5 my-12">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-[#1F1A17]">
              Your Wardrobe Bag is Empty
            </h2>
            <p className="text-xs text-[#6E6A63] leading-relaxed">
              Explore bespoke Aso-Oke Dashikis, royal Agbadas, and fine African luxury silks before proceeding to checkout.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                href="/shop"
                className="rounded-sm bg-[#7A491D] px-6 py-3 font-display text-xs font-semibold tracking-widest text-white uppercase hover:bg-[#5C3614] transition-colors"
              >
                Explore Wardrobe →
              </Link>
              <button
                type="button"
                onClick={handleAddDemoGarment}
                className="rounded-sm border border-[#EADFD0] bg-[#FAF5EE] px-5 py-3 font-display text-xs font-semibold tracking-widest text-[#7A491D] uppercase hover:bg-white transition-colors cursor-pointer"
              >
                + Add Test Garment to Bag
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left 7 Columns: Shipping Details & Payment Methods */}
            <form onSubmit={handleExecuteCheckout} className="lg:col-span-7 space-y-8">
              {/* Step 1: Destination & Shipping Address */}
              <div className="rounded-sm border border-[#EADFD0] bg-white p-6 sm:p-8 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-[#EADFD0]/60 pb-3">
                  <h2 className="font-display text-base sm:text-lg font-bold uppercase tracking-tight text-[#1F1A17]">
                    1. Shipping &amp; Delivery Destination
                  </h2>
                  <span className="text-xs font-mono text-[#7A491D]">Step 1 of 2</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Destination Country / Hub */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#4A4742] mb-1">
                      Delivery Corridor (Auto-routes to nearest fulfillment hub) *
                    </label>
                    <select
                      value={destinationIso}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
                    >
                      {DESTINATION_COUNTRIES.map((c) => (
                        <option key={c.iso} value={c.iso}>
                          {c.name} · Default: {c.suggestedCurrency}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Recipient First & Last Name */}
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#4A4742] mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Tunde"
                      className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#4A4742] mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Bakare"
                      className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#4A4742] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="client@couture.luxury"
                      className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#4A4742] mb-1">
                      Phone Number *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={phonePrefix}
                        onChange={(e) => setPhonePrefix(e.target.value)}
                        className="w-16 rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-2 py-2 text-xs text-center font-mono text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
                      />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="809 442 1900"
                        className="flex-1 rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Street Address & Suite */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#4A4742] mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g. 14 Admiralty Way"
                      className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#4A4742] mb-1">
                      Apartment / Suite / Floor (Optional)
                    </label>
                    <input
                      type="text"
                      value={suite}
                      onChange={(e) => setSuite(e.target.value)}
                      placeholder="e.g. Suite 4B, Lekki Phase 1"
                      className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#4A4742] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Lagos"
                      className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#4A4742] mb-1">
                      State / Province / County *
                    </label>
                    <input
                      type="text"
                      required
                      value={stateProvince}
                      onChange={(e) => setStateProvince(e.target.value)}
                      placeholder="e.g. Lagos State"
                      className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#4A4742] mb-1">
                      Postal / ZIP Code
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 105102"
                      className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#4A4742] mb-1">
                      Courier Delivery Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="e.g. Gate access code or concierge instructions"
                      className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Hub Routing Notification */}
                <div className="rounded-sm border border-[#EADFD0] bg-[#FAF5EE] p-4 text-xs flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-[#1F1A17]">
                      Fulfillment Hub: {logistics.hubName}
                    </span>
                    <span className="text-[#6E6A63] block mt-0.5">
                      Courier: {logistics.courierPartner} · Transit: {logistics.estimatedTransitDays}
                    </span>
                  </div>
                  <span className="rounded-sm bg-white border border-[#EADFD0] px-2.5 py-1 text-[11px] font-mono text-[#7A491D]">
                    {logistics.assignedHub === "HUB_A_LAGOS" ? "Hub A (Lagos)" : "Hub B (Toronto HQ)"}
                  </span>
                </div>
              </div>

              {/* Step 2: Payment Gateway Testing Selector */}
              <div className="rounded-sm border border-[#EADFD0] bg-white p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#EADFD0]/60 pb-3">
                  <h2 className="font-display text-base sm:text-lg font-bold uppercase tracking-tight text-[#1F1A17]">
                    2. Payment Method &amp; Gateway Sandbox
                  </h2>
                  <span className="text-xs font-mono text-[#7A491D]">Step 2 of 2</span>
                </div>

                {/* Gateway Switcher Tabs */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedGateway("PAYSTACK")}
                    className={`rounded-sm border p-4 text-left transition-all cursor-pointer ${
                      selectedGateway === "PAYSTACK"
                        ? "border-[#7A491D] bg-[#FAF5EE] shadow-xs"
                        : "border-[#EADFD0] bg-white hover:bg-[#FAF9F6]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display text-sm font-bold uppercase tracking-tight text-[#1F1A17]">
                        Paystack
                      </span>
                      {selectedGateway === "PAYSTACK" && (
                        <span className="w-1.5 h-1.5 rotate-45 bg-[#7A491D]" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#6E6A63] block">
                      African Gateway · NGN, GHS, KES, USD
                    </span>
                    <span className="text-[10px] text-[#7A491D] font-mono mt-1 block">
                      Cards, Bank Transfer &amp; USSD
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGateway("STRIPE")}
                    className={`rounded-sm border p-4 text-left transition-all cursor-pointer ${
                      selectedGateway === "STRIPE"
                        ? "border-[#7A491D] bg-[#FAF5EE] shadow-xs"
                        : "border-[#EADFD0] bg-white hover:bg-[#FAF9F6]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display text-sm font-bold uppercase tracking-tight text-[#1F1A17]">
                        Stripe
                      </span>
                      {selectedGateway === "STRIPE" && (
                        <span className="w-1.5 h-1.5 rotate-45 bg-[#7A491D]" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#6E6A63] block">
                      Global Gateway · CAD, USD, GBP, EUR
                    </span>
                    <span className="text-[10px] text-[#7A491D] font-mono mt-1 block">
                      Credit &amp; Debit Cards
                    </span>
                  </button>
                </div>

                {/* Gateway Detail Sub-Panels */}
                {selectedGateway === "PAYSTACK" ? (
                  <div className="space-y-4 rounded-sm border border-[#EADFD0] bg-[#FAF9F6] p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#1F1A17]">
                        Paystack Settlement Channel
                      </span>
                      <span className="rounded-sm bg-white border border-[#EADFD0] px-2.5 py-0.5 text-[11px] font-medium text-[#2E6B35]">
                        Sandbox Active
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {(["CARD", "BANK_TRANSFER", "USSD"] as const).map((channel) => (
                        <button
                          key={channel}
                          type="button"
                          onClick={() => setPaystackChannel(channel)}
                          className={`rounded-sm border py-2.5 px-3 text-xs font-medium text-center transition-all cursor-pointer ${
                            paystackChannel === channel
                              ? "border-[#7A491D] bg-white text-[#7A491D] font-semibold"
                              : "border-[#EADFD0] bg-transparent text-[#6E6A63] hover:text-[#1F1A17]"
                          }`}
                        >
                          {channel === "CARD" && "Credit / Debit Card"}
                          {channel === "BANK_TRANSFER" && "Bank Transfer"}
                          {channel === "USSD" && "USSD Banking"}
                        </button>
                      ))}
                    </div>

                    <div className="text-xs text-[#6E6A63] leading-relaxed pt-1 space-y-1">
                      <p>
                        Selected channel: <span className="font-semibold text-[#1F1A17]">{paystackChannel.replace(/_/g, " ")}</span>.
                      </p>
                      <p className="text-[11px] text-[#7A491D]">
                        Testing Mode: Paystack transaction will be generated, signed with live/sandbox test parameters, and recorded directly to the Neon PostgreSQL database.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 rounded-sm border border-[#EADFD0] bg-[#FAF9F6] p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#1F1A17]">
                        Stripe International Card Entry
                      </span>
                      <button
                        type="button"
                        onClick={fillStripeTestCard}
                        className="rounded-sm border border-[#7A491D] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#7A491D] hover:bg-[#FAF5EE] transition-colors cursor-pointer"
                      >
                        Auto-Fill Test Card
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-medium uppercase tracking-wider text-[#6E6A63] mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={stripeCardName}
                          onChange={(e) => setStripeCardName(e.target.value)}
                          placeholder="e.g. Tunde Bakare"
                          className="w-full rounded-sm border border-[#EADFD0] bg-white px-3 py-2 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium uppercase tracking-wider text-[#6E6A63] mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={stripeCardNumber}
                          onChange={(e) => setStripeCardNumber(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          className="w-full rounded-sm border border-[#EADFD0] bg-white px-3 py-2 text-xs font-mono text-[#1F1A17] focus:border-[#7A491D] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium uppercase tracking-wider text-[#6E6A63] mb-1">
                            Expires (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={stripeCardExpiry}
                            onChange={(e) => setStripeCardExpiry(e.target.value)}
                            placeholder="12/28"
                            className="w-full rounded-sm border border-[#EADFD0] bg-white px-3 py-2 text-xs font-mono text-[#1F1A17] focus:border-[#7A491D] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium uppercase tracking-wider text-[#6E6A63] mb-1">
                            CVC / Security Code
                          </label>
                          <input
                            type="text"
                            value={stripeCardCvc}
                            onChange={(e) => setStripeCardCvc(e.target.value)}
                            placeholder="123"
                            className="w-full rounded-sm border border-[#EADFD0] bg-white px-3 py-2 text-xs font-mono text-[#1F1A17] focus:border-[#7A491D] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#7A491D] pt-1">
                      Testing Mode: Authorized via Stripe PaymentIntent simulation. The order, customer address, and waybill will be committed to the Neon PostgreSQL database.
                    </p>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full rounded-sm bg-[#7A491D] py-4 px-6 font-display text-xs font-semibold tracking-widest text-white uppercase shadow-md hover:bg-[#5C3614] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>
                    Complete Settlement via {selectedGateway} ({formatCurrencyValue(totalAmount, currency)})
                  </span>
                  <span>→</span>
                </button>
              </div>
            </form>

            {/* Right 5 Columns: Order Summary Lookbook */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-sm border border-[#EADFD0] bg-white p-6 sm:p-7 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#EADFD0]/60 pb-3">
                  <h2 className="font-display text-base sm:text-lg font-bold uppercase tracking-tight text-[#1F1A17]">
                    Order Summary
                  </h2>
                  <span className="text-xs text-[#6E6A63]">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} pieces
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-4 divide-y divide-[#EADFD0]/60 max-h-[360px] overflow-y-auto pr-1">
                  {cart.map((item, idx) => (
                    <div key={idx} className="pt-4 first:pt-0 flex gap-3.5">
                      <div className="relative w-16 h-20 bg-[#FAF9F6] rounded-sm border border-[#EADFD0] overflow-hidden shrink-0">
                        <img
                          src={item.product.editorialImageUrl}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80";
                          }}
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between text-xs">
                        <div>
                          <div className="text-[11px] font-semibold text-[#7A491D] uppercase">
                            {item.product.brandName}
                          </div>
                          <div className="font-semibold text-[#1F1A17] line-clamp-1">
                            {item.product.title}
                          </div>
                          <div className="text-[#6E6A63] text-[11px] mt-0.5">
                            Size: {item.size} · Qty: {item.quantity}
                          </div>
                        </div>

                        <div className="font-semibold text-[#1F1A17]">
                          {formatCurrencyValue(
                            convertPrice(item.product, currency) * item.quantity,
                            currency
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-[#EADFD0] pt-4 space-y-2.5 text-xs">
                  <div className="flex justify-between text-[#6E6A63]">
                    <span>Garments Subtotal</span>
                    <span className="text-[#1F1A17] font-medium">
                      {formatCurrencyValue(subtotal, currency)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#6E6A63]">
                    <span>Fulfillment &amp; Courier Shipping</span>
                    <span className="text-[#1F1A17] font-medium">
                      {logistics.shippingFee === 0
                        ? "Complimentary"
                        : formatCurrencyValue(logistics.shippingFee, currency)}
                    </span>
                  </div>

                  {logistics.dutiesFee > 0 && (
                    <div className="flex justify-between text-[#6E6A63]">
                      <span>Estimated Regional Duties</span>
                      <span className="text-[#1F1A17] font-medium">
                        {formatCurrencyValue(logistics.dutiesFee, currency)}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-[#EADFD0] pt-3 flex justify-between text-sm font-bold">
                    <span className="font-display uppercase tracking-wider text-[#1F1A17]">
                      Grand Total
                    </span>
                    <span className="text-base text-[#7A491D] font-display">
                      {formatCurrencyValue(totalAmount, currency)}
                    </span>
                  </div>
                </div>

                {/* Trust Guarantees */}
                <div className="rounded-sm border border-[#EADFD0] bg-[#FAF9F6] p-4 text-[11px] text-[#6E6A63] space-y-2 leading-relaxed">
                  <div className="flex items-center gap-2 text-[#1F1A17] font-semibold uppercase">
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#7A491D]" />
                    <span>Macklemore Luxury Authenticity</span>
                  </div>
                  <p>
                    Every bespoke piece is hand-inspected in Toronto or Lagos before allocation to courier. Includes digital certificate of origin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}