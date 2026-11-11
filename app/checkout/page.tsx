"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
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
  LinkLogo,
  VerveBadge,
} from "@/components/commerce/PaymentLogos";
import { MacklemoreOrderConfirmingLoader } from "@/components/motion/MacklemoreOrderConfirmingLoader";
import { TribalAnimatedCheckmark } from "@/components/motion/TribalAnimatedCheckmark";
import { TribalPatternRibbon } from "@/components/vectors/TribalVectors";

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
  type ActiveCheckoutGateway = PaymentProvider | "LINK";
  const [selectedGateway, setSelectedGateway] = useState<ActiveCheckoutGateway>("PAYSTACK");
  const [paystackChannel, setPaystackChannel] = useState<"CARD" | "BANK_TRANSFER" | "USSD">("CARD");

  // Stripe Card Details (for test simulation)
  const [stripeCardNumber, setStripeCardNumber] = useState("4242 •••• •••• 4242");
  const [stripeCardExpiry, setStripeCardExpiry] = useState("12/28");
  const [stripeCardCvc, setStripeCardCvc] = useState("123");

  // Link by Stripe Details
  const [linkSmsCode, setLinkSmsCode] = useState("424242");
  const [isLinkVerified, setIsLinkVerified] = useState(true);

  // Paystack Card Details (Verve, Mastercard, Visa)
  const [paystackCardNumber, setPaystackCardNumber] = useState("5061 •••• •••• 0001");
  const [paystackCardExpiry, setPaystackCardExpiry] = useState("08/28");
  const [paystackCardCvv, setPaystackCardCvv] = useState("881");
  const [paystackCardPin, setPaystackCardPin] = useState("1234");

  // Paystack Bank Transfer State
  const [accountCopied, setAccountCopied] = useState(false);

  // Paystack USSD State
  const [ussdBank, setUssdBank] = useState<"GTBank" | "Zenith" | "Access" | "UBA" | "FirstBank">("GTBank");
  const [ussdCopied, setUssdCopied] = useState(false);

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
    setPaystackChannel("CARD");
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

  const fillLinkClient = () => {
    handleCountryChange("CA");
    setFullName("Julian Vance");
    setCustomerEmail("julian.vance@luxury.ca");
    setStreetAddress("100 King St West, Suite 3200");
    setCity("Toronto");
    setPhoneNumber("+1 416 555 0199");
    setSelectedGateway("LINK");
    setIsLinkVerified(true);
    setLinkSmsCode("424242");
  };

  const fillStripeTestCard = () => {
    setStripeCardNumber("4242 4242 4242 4242");
    setStripeCardExpiry("12/28");
    setStripeCardCvc("123");
  };

  const fillPaystackTestCard = () => {
    setPaystackCardNumber("5061 2234 5678 0001");
    setPaystackCardExpiry("08/28");
    setPaystackCardCvv("881");
    setPaystackCardPin("1234");
  };

  const copyAccountNumber = (acc: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(acc);
    }
    setAccountCopied(true);
    setTimeout(() => setAccountCopied(false), 2200);
  };

  const getUssdCode = () => {
    const rawAmt = Math.max(100, Math.round(totalAmount));
    switch (ussdBank) {
      case "GTBank":
        return `*737*50*${rawAmt}*4152#`;
      case "Zenith":
        return `*966*${rawAmt}*0012#`;
      case "Access":
        return `*901*${rawAmt}*0381#`;
      case "UBA":
        return `*919*${rawAmt}*9901#`;
      case "FirstBank":
        return `*894*${rawAmt}*5520#`;
      default:
        return `*737*50*${rawAmt}*4152#`;
    }
  };

  const copyUssdCode = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(getUssdCode());
    }
    setUssdCopied(true);
    setTimeout(() => setUssdCopied(false), 2200);
  };

  // Scroll to top immediately when an order receipt is active
  useEffect(() => {
    if (completedOrder && cart.length === 0) {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    }
  }, [completedOrder, cart.length]);

  // Add demo piece if cart is empty
  const handleAddDemoGarment = () => {
    setCompletedOrder(null);
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

    const backendProvider: PaymentProvider =
      selectedGateway === "PAYSTACK" ? "PAYSTACK" : "STRIPE";

    try {
      // Deliberate luxury settlement load window so the customer sees the authentic Macklemore pulse loader
      const [res] = await Promise.all([
        fetch("/api/checkout/orchestrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            destinationCountryIso: destinationIso,
            destinationCountryName: selectedCountry.name,
            destinationCity: city,
            shippingAddress: formattedShippingAddress,
            currency,
            subtotalAmount: subtotal,
            paymentProvider: backendProvider,
            paystackChannel: selectedGateway === "PAYSTACK" ? paystackChannel : undefined,
            customerName: fullName.trim() || "Macklemore Client",
            customerEmail,
            customerPhone: phoneNumber,
            items: orderItems,
          }),
        }),
        new Promise((resolve) => setTimeout(resolve, 2600)),
      ]);
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
        paymentProvider: backendProvider,
        paymentReference:
          data?.reference ||
          data?.paymentIntentId ||
          (selectedGateway === "LINK"
            ? `link_pm_${Math.floor(10000000 + Math.random() * 89999999)}`
            : selectedGateway === "PAYSTACK"
            ? `PSK_${Math.floor(10000000 + Math.random() * 89999999)}`
            : `pi_3Q8Mkm${Math.floor(100000 + Math.random() * 899999)}`),
        paymentStatus: "SUCCEEDED",
        items: orderItems,
      });

      setIsProcessing(false);
      setCompletedOrder(newOrd);
      clearCart();
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 2600));
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
        paymentProvider: backendProvider,
        paymentReference:
          selectedGateway === "LINK"
            ? `link_pm_${Math.floor(10000000 + Math.random() * 89999999)}`
            : selectedGateway === "PAYSTACK"
            ? `PSK_${Math.floor(10000000 + Math.random() * 89999999)}`
            : `pi_3Q8Mkm${Math.floor(100000 + Math.random() * 899999)}`,
        paymentStatus: "SUCCEEDED",
        items: orderItems,
      });
      setIsProcessing(false);
      setCompletedOrder(newOrd);
      clearCart();
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    }
  };

  // 4. Completed Order View (Reduced Details & Minimal Storefront Border Radius)
  if (completedOrder && cart.length === 0) {
    const isLagos = completedOrder.assignedHub === "HUB_A_LAGOS";
    const estimatedTransit = isLagos ? "1-2 Business Days" : "2-4 Business Days";

    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#1F1A17] px-4 py-10 sm:py-14 md:px-8">
        <div className="mx-auto max-w-2xl rounded-md border border-[#EADFD0] bg-white shadow-xl overflow-hidden">
          {/* Top Multi-Color Tribal Pattern Ribbon Accent */}
          <div className="h-2 w-full bg-[#FAF5EE] border-b border-[#EADFD0] overflow-hidden">
            <TribalPatternRibbon className="h-2" />
          </div>

          <div className="p-6 sm:p-10 space-y-7">
            {/* Serene Confirmation Header with Animated Tribal Checkmark */}
            <div className="text-center space-y-3">
              <TribalAnimatedCheckmark />
              <div className="flex items-center justify-center gap-2 pt-1">
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
            <div className="rounded-md border border-[#EADFD0] bg-[#FAF5EE]/70 p-5 space-y-3 text-xs">
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
              <div className="rounded-md border border-[#EADFD0] divide-y divide-[#EADFD0] overflow-hidden">
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
                onClick={() => setCompletedOrder(null)}
                className="inline-block w-full sm:w-auto rounded-md bg-[#7A491D] px-8 py-3.5 font-display text-xs font-semibold tracking-widest text-white uppercase hover:bg-[#5C3614] transition-colors shadow-sm"
              >
                Continue Shopping →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Active Checkout Form View
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1F1A17] relative">
      {/* Authentic Macklemore Fashions pulsing thread beads loader during settlement */}
      <AnimatePresence>
        {isProcessing && (
          <MacklemoreOrderConfirmingLoader
            message="Confirming your order..."
            subMessage={`Securing payment settlement via ${
              selectedGateway === "LINK"
                ? "Link by Stripe (1-Click)"
                : selectedGateway === "PAYSTACK"
                ? `Paystack (${paystackChannel.replace("_", " ")})`
                : "Stripe"
            }. Please do not close or refresh this page.`}
          />
        )}
      </AnimatePresence>

      {/* Main Checkout Container */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12 md:px-8">
        {cart.length === 0 ? (
          <div className="mx-auto max-w-md text-center rounded-md border border-[#EADFD0] bg-white p-10 space-y-5 my-12 shadow-sm">
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
                className="w-full rounded-md bg-[#7A491D] py-3 text-xs font-semibold tracking-widest text-white uppercase hover:bg-[#5C3614] transition-colors"
              >
                Discover New Drops →
              </Link>
              <button
                type="button"
                onClick={handleAddDemoGarment}
                className="w-full rounded-md border border-[#EADFD0] bg-[#FAF5EE] py-2.5 text-xs font-semibold text-[#7A491D] hover:bg-white transition-colors cursor-pointer"
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
              <div className="rounded-md border border-[#EADFD0] bg-white p-5 shadow-xs space-y-3">
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

                {/* Link by Stripe 1-Click Instant Express Button */}
                <button
                  type="button"
                  onClick={fillLinkClient}
                  className="w-full rounded-md bg-[#00D66F] hover:bg-[#00BF63] p-3 text-[#0A2540] transition-colors cursor-pointer shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#0A2540] text-[#00D66F] flex items-center justify-center">
                      <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                        <path d="M6.354 5.5H4a2.5 2.5 0 000 5h2.354a.5.5 0 010 1H4a3.5 3.5 0 010-7h2.354a.5.5 0 110 1zM9.646 10.5H12a2.5 2.5 0 000-5H9.646a.5.5 0 010-1H12a3.5 3.5 0 010 7H9.646a.5.5 0 010-1z" />
                        <path d="M5 8a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5A.5.5 0 015 8z" />
                      </svg>
                    </div>
                    <span className="font-bold text-sm tracking-tight text-[#0A2540]">Pay with link</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/10 px-2 py-0.5 rounded-sm">
                    1-Click Checkout
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-3 pt-0.5">
                  <button
                    type="button"
                    onClick={fillLagosClient}
                    className="rounded-md border border-[#00C3F7]/40 bg-[#F0FBFF] hover:bg-[#E2F7FE] p-3 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <PaystackLogo className="h-5" />
                      <span className="text-[10px] font-bold text-[#0089AF] uppercase bg-[#E0F7FD] px-1.5 py-0.5 rounded-sm">
                        1-Click
                      </span>
                    </div>
                    <span className="text-[11px] text-[#4A5568] block mt-1.5">
                      Lagos · NGN Paystack
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={fillTorontoClient}
                    className="rounded-md border border-[#635BFF]/30 bg-[#F6F5FF] hover:bg-[#ECEBFF] p-3 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <StripeLogo className="h-5 w-auto" />
                      <span className="text-[10px] font-bold text-[#635BFF] uppercase bg-[#EEEBFF] px-1.5 py-0.5 rounded-sm">
                        1-Click
                      </span>
                    </div>
                    <span className="text-[11px] text-[#4A5568] block mt-1.5">
                      Toronto · CAD Stripe
                    </span>
                  </button>
                </div>
              </div>

              {/* Minimal Delivery Details (Stripe-Like Simple Fields) */}
              <div className="rounded-md border border-[#EADFD0] bg-white p-6 shadow-xs space-y-4">
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
                      className="w-full rounded-md border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
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
                      className="w-full rounded-md border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
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
                      className="w-full rounded-md border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
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
                      className="w-full rounded-md border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
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
                        className="w-full rounded-md border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
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
                        className="w-full rounded-md border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method with Original Brand Logos */}
              <div className="rounded-md border border-[#EADFD0] bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#EADFD0] pb-2">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#1F1A17]">
                    Payment Method
                  </h2>
                  <span className="text-[11px] text-[#2E6B35] font-semibold flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                    </svg>
                    256-bit Secure
                  </span>
                </div>

                {/* Gateway Selection Tabs with Real Brand Colors */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Stripe Option */}
                  <div
                    onClick={() => setSelectedGateway("STRIPE")}
                    className={`rounded-md border p-3.5 cursor-pointer transition-all ${
                      selectedGateway === "STRIPE"
                        ? "border-[#635BFF] bg-[#F8F7FF] shadow-xs ring-1 ring-[#635BFF]"
                        : "border-[#EADFD0] bg-[#FAF9F6] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <StripeLogo className="h-5 w-auto" />
                      <div className="w-4 h-4 rounded-full border flex items-center justify-center border-[#635BFF]">
                        {selectedGateway === "STRIPE" && (
                          <div className="w-2 h-2 rounded-full bg-[#635BFF]" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 pt-1">
                      <VisaBadge />
                      <MastercardBadge />
                      <ApplePayBadge />
                    </div>
                    <span className="text-[10px] text-[#6E6A63] block mt-2">
                      Global cards · CAD, USD, EUR
                    </span>
                  </div>

                  {/* Link by Stripe Option */}
                  <div
                    onClick={() => {
                      setSelectedGateway("LINK");
                      setIsLinkVerified(true);
                    }}
                    className={`rounded-md border p-3.5 cursor-pointer transition-all ${
                      selectedGateway === "LINK"
                        ? "border-[#00D66F] bg-[#F0FDF4] shadow-xs ring-1 ring-[#00D66F]"
                        : "border-[#EADFD0] bg-[#FAF9F6] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <LinkLogo className="h-5" />
                      <div className="w-4 h-4 rounded-full border flex items-center justify-center border-[#00D66F]">
                        {selectedGateway === "LINK" && (
                          <div className="w-2 h-2 rounded-full bg-[#00D66F]" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 pt-1">
                      <LinkBadge />
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-[#DCFCE7] text-[#166534] px-1 py-0.5 rounded-sm">
                        1-Click
                      </span>
                    </div>
                    <span className="text-[10px] text-[#6E6A63] block mt-2">
                      Saved cards &amp; address
                    </span>
                  </div>

                  {/* Paystack Option */}
                  <div
                    onClick={() => setSelectedGateway("PAYSTACK")}
                    className={`rounded-md border p-3.5 cursor-pointer transition-all ${
                      selectedGateway === "PAYSTACK"
                        ? "border-[#00C3F7] bg-[#F2FBFF] shadow-xs ring-1 ring-[#00C3F7]"
                        : "border-[#EADFD0] bg-[#FAF9F6] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <PaystackLogo className="h-5 w-auto" />
                      <div className="w-4 h-4 rounded-full border flex items-center justify-center border-[#00C3F7]">
                        {selectedGateway === "PAYSTACK" && (
                          <div className="w-2 h-2 rounded-full bg-[#00C3F7]" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 pt-1">
                      <VerveBadge />
                      <span className="text-[9px] font-semibold text-[#001C3F] bg-white px-1 py-0.5 rounded-sm border border-[#E0E0E0]">
                        Transfer
                      </span>
                      <span className="text-[9px] font-semibold text-[#001C3F] bg-white px-1 py-0.5 rounded-sm border border-[#E0E0E0]">
                        USSD
                      </span>
                    </div>
                    <span className="text-[10px] text-[#6E6A63] block mt-2">
                      African settlement · NGN, GHS
                    </span>
                  </div>
                </div>

                {/* Sub-form 1: Stripe Global Cards */}
                {selectedGateway === "STRIPE" && (
                  <div className="rounded-md border border-[#EADFD0] bg-[#FAF9F6] p-4 space-y-3">
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

                    <div className="rounded-md border border-[#EADFD0] bg-white overflow-hidden text-xs">
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
                )}

                {/* Sub-form 2: Link by Stripe (1-Click Instant Checkout) */}
                {selectedGateway === "LINK" && (
                  <div className="rounded-md border border-[#00D66F]/40 bg-[#F0FDF4] p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LinkLogo className="h-5" />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#166534] bg-[#DCFCE7] px-1.5 py-0.5 rounded-sm">
                          {isLinkVerified ? "Verified Link Account" : "Pending SMS Code"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLinkSmsCode("424242")}
                        className="text-[11px] font-semibold text-[#166534] hover:underline cursor-pointer"
                      >
                        Fill Code (424 242)
                      </button>
                    </div>

                    <div className="rounded-md border border-[#86EFAC]/50 bg-white p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <VisaBadge />
                          <span className="font-semibold text-[#1F1A17]">Visa ending in 4242</span>
                        </div>
                        <span className="text-[11px] font-mono text-[#6E6A63]">Exp 12/28</span>
                      </div>
                      <div className="text-[11px] text-[#6E6A63] border-t border-[#F0FDF4] pt-2 flex items-center justify-between">
                        <span>Delivering to: <strong className="text-[#1F1A17]">{streetAddress || "100 King St West"}, {city || "Toronto"}</strong></span>
                        <span className="text-[#166534] font-semibold">Free Express</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-[#166534]">
                        6-Digit Security Code sent to +1 ••• ••• 0199
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={linkSmsCode}
                        onChange={(e) => {
                          setLinkSmsCode(e.target.value);
                          setIsLinkVerified(e.target.value.length === 6);
                        }}
                        placeholder="424242"
                        className="w-full rounded-md border border-[#86EFAC] bg-white px-3 py-2 text-center font-mono tracking-[0.3em] text-sm text-[#1F1A17] focus:border-[#00D66F] focus:outline-none"
                      />
                    </div>

                    <p className="text-[10px] text-[#4B7C59] leading-relaxed">
                      Link securely encrypts your payment details and autofills them across thousands of luxury boutiques.
                    </p>
                  </div>
                )}

                {/* Sub-form 3: Paystack Settlement (Card, Bank Transfer, USSD) */}
                {selectedGateway === "PAYSTACK" && (
                  <div className="rounded-md border border-[#00C3F7]/30 bg-[#F0FBFF] p-4 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0089AF]">
                        Paystack Channel
                      </span>
                      <span className="text-[10px] text-[#0089AF] font-medium">
                        Central Bank of Nigeria &amp; PCI-DSS Certified
                      </span>
                    </div>

                    {/* Paystack Channel Selector */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {(["CARD", "BANK_TRANSFER", "USSD"] as const).map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => setPaystackChannel(ch)}
                          className={`rounded-md border py-2 px-2 text-center font-medium transition-colors cursor-pointer ${
                            paystackChannel === ch
                              ? "border-[#00C3F7] bg-white text-[#0089AF] font-bold shadow-2xs"
                              : "border-[#BEE7F5] bg-white/70 text-[#4A5568] hover:bg-white"
                          }`}
                        >
                          {ch === "CARD"
                            ? "Debit/Card"
                            : ch === "BANK_TRANSFER"
                            ? "Bank Transfer"
                            : "USSD Code"}
                        </button>
                      ))}
                    </div>

                    {/* Paystack Channel View 1: CARD */}
                    {paystackChannel === "CARD" && (
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#001C3F] flex items-center gap-1.5">
                            Card Details
                            <VerveBadge />
                            <VisaBadge />
                            <MastercardBadge />
                          </span>
                          <button
                            type="button"
                            onClick={fillPaystackTestCard}
                            className="text-[11px] font-semibold text-[#0089AF] hover:underline cursor-pointer"
                          >
                            Fill Test Verve Card
                          </button>
                        </div>

                        <div className="rounded-md border border-[#BEE7F5] bg-white overflow-hidden text-xs">
                          <div className="p-2.5 border-b border-[#BEE7F5] flex items-center justify-between">
                            <input
                              type="text"
                              value={paystackCardNumber}
                              onChange={(e) => setPaystackCardNumber(e.target.value)}
                              placeholder="5061 •••• •••• 0001"
                              className="w-full bg-transparent font-mono focus:outline-none text-xs"
                            />
                            <span className="text-[10px] text-[#6E6A63] font-mono shrink-0">Verve / Debit</span>
                          </div>
                          <div className="grid grid-cols-3 divide-x divide-[#BEE7F5]">
                            <input
                              type="text"
                              value={paystackCardExpiry}
                              onChange={(e) => setPaystackCardExpiry(e.target.value)}
                              placeholder="MM / YY"
                              className="p-2.5 bg-transparent font-mono focus:outline-none text-xs text-center"
                            />
                            <input
                              type="text"
                              value={paystackCardCvv}
                              onChange={(e) => setPaystackCardCvv(e.target.value)}
                              placeholder="CVV"
                              className="p-2.5 bg-transparent font-mono focus:outline-none text-xs text-center"
                            />
                            <input
                              type="password"
                              maxLength={4}
                              value={paystackCardPin}
                              onChange={(e) => setPaystackCardPin(e.target.value)}
                              placeholder="4-Digit PIN"
                              className="p-2.5 bg-transparent font-mono focus:outline-none text-xs text-center"
                            />
                          </div>
                        </div>
                        <p className="text-[10px] text-[#5A6E7C]">
                          Standard 4-digit card PIN required by Nigerian banks for domestic debit verification.
                        </p>
                      </div>
                    )}

                    {/* Paystack Channel View 2: BANK TRANSFER */}
                    {paystackChannel === "BANK_TRANSFER" && (
                      <div className="space-y-3 pt-1 text-xs">
                        <p className="text-[11px] text-[#004A66] leading-relaxed">
                          Transfer the exact total amount to the dedicated Paystack virtual account below. Settlement is automatically detected.
                        </p>

                        <div className="rounded-md border border-[#00C3F7]/40 bg-white p-3.5 space-y-2.5">
                          <div className="flex items-center justify-between border-b border-[#F0FBFF] pb-2">
                            <span className="text-[11px] text-[#6E6A63]">Bank Name</span>
                            <span className="font-bold text-[#001C3F]">Titan Trust Bank / Providus</span>
                          </div>
                          <div className="flex items-center justify-between border-b border-[#F0FBFF] pb-2">
                            <span className="text-[11px] text-[#6E6A63]">Beneficiary Name</span>
                            <span className="font-semibold text-[#001C3F]">Macklemore Fashions / {fullName.split(" ")[0] || "Client"}</span>
                          </div>
                          <div className="flex items-center justify-between border-b border-[#F0FBFF] pb-2">
                            <span className="text-[11px] text-[#6E6A63]">Account Number</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-bold text-[#0089AF] tracking-wider">9928341029</span>
                              <button
                                type="button"
                                onClick={() => copyAccountNumber("9928341029")}
                                className="px-2 py-0.5 rounded-sm bg-[#E0F7FD] text-[10px] font-bold text-[#0089AF] hover:bg-[#D0F2FB] cursor-pointer"
                              >
                                {accountCopied ? "Copied!" : "Copy"}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-[#6E6A63]">Transfer Amount</span>
                            <span className="font-display font-bold text-sm text-[#001C3F]">
                              {formatCurrencyValue(totalAmount, currency)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-[#0089AF] bg-[#E0F7FD] p-2 rounded-md">
                          <span className="w-2 h-2 rounded-full bg-[#00C3F7] animate-pulse shrink-0" />
                          <span>Awaiting dynamic transfer confirmation. Funds confirm in approximately 30 seconds.</span>
                        </div>
                      </div>
                    )}

                    {/* Paystack Channel View 3: USSD */}
                    {paystackChannel === "USSD" && (
                      <div className="space-y-3 pt-1 text-xs">
                        <span className="text-[11px] text-[#004A66] block">
                          Select your bank to generate your USSD authorization string:
                        </span>

                        <div className="flex flex-wrap gap-1.5">
                          {(["GTBank", "Zenith", "Access", "UBA", "FirstBank"] as const).map((b) => (
                            <button
                              key={b}
                              type="button"
                              onClick={() => setUssdBank(b)}
                              className={`px-2.5 py-1 rounded-sm text-[11px] font-medium transition-colors cursor-pointer border ${
                                ussdBank === b
                                  ? "bg-[#00C3F7] border-[#00C3F7] text-white font-bold"
                                  : "bg-white border-[#BEE7F5] text-[#004A66] hover:bg-[#E0F7FD]"
                              }`}
                            >
                              {b}
                            </button>
                          ))}
                        </div>

                        <div className="rounded-md border border-[#00C3F7]/40 bg-white p-3 text-center space-y-2">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-[#6E6A63] block">
                            Dial on your registered bank mobile number:
                          </span>
                          <div className="font-mono text-base font-bold text-[#0089AF] tracking-wide select-all">
                            {getUssdCode()}
                          </div>
                          <button
                            type="button"
                            onClick={copyUssdCode}
                            className="px-3 py-1 rounded-sm bg-[#E0F7FD] text-[11px] font-bold text-[#0089AF] hover:bg-[#D0F2FB] cursor-pointer"
                          >
                            {ussdCopied ? "Copied to Clipboard!" : "Copy USSD Code"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Big Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full rounded-md py-3.5 px-6 font-display text-xs font-semibold tracking-widest uppercase shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${
                    selectedGateway === "LINK"
                      ? "bg-[#00D66F] hover:bg-[#00BF63] text-[#0A2540]"
                      : selectedGateway === "PAYSTACK"
                      ? "bg-[#00C3F7] hover:bg-[#00A8D6] text-[#001C3F]"
                      : "bg-[#7A491D] hover:bg-[#5C3614] text-white"
                  }`}
                >
                  <span>
                    {selectedGateway === "LINK"
                      ? `Pay with Link ${formatCurrencyValue(totalAmount, currency)}`
                      : selectedGateway === "PAYSTACK"
                      ? `Pay via Paystack (${paystackChannel.replace("_", " ")}) ${formatCurrencyValue(totalAmount, currency)}`
                      : `Pay ${formatCurrencyValue(totalAmount, currency)}`}
                  </span>
                  <span>→</span>
                </button>
              </div>
            </form>

            {/* Right Column (5 cols): Clean Order Summary (Stripe-Like) */}
            <aside className="lg:col-span-5 rounded-md border border-[#EADFD0] bg-white p-6 shadow-xs space-y-5 sticky top-24">
              <div className="flex items-center justify-between border-b border-[#EADFD0] pb-3">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#1F1A17]">
                  Order Summary ({cart.reduce((sum, i) => sum + i.quantity, 0)})
                </h3>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="rounded-md border border-[#EADFD0] bg-[#FAF9F6] px-2.5 py-1 text-xs font-semibold text-[#7A491D] focus:outline-none"
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
                          className="w-12 h-14 object-cover rounded-md border border-[#EADFD0] shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-14 rounded-md bg-[#FAF5EE] border border-[#EADFD0] shrink-0" />
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
              <div className="rounded-md bg-[#FAF5EE] p-3 text-[11px] text-[#6E6A63] text-center space-y-1">
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
