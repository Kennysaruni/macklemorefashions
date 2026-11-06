import { NextRequest, NextResponse } from "next/server";
import {
  calculateLogisticsForDestination,
  CurrencyCode,
  PaymentProvider,
} from "@/lib/store-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      destinationCountryIso = "NG",
      currency = "NGN",
      subtotalAmount = 0,
      paymentProvider,
      mpesaPhoneNumber,
      customerEmail,
    }: {
      destinationCountryIso?: string;
      currency?: CurrencyCode;
      subtotalAmount?: number;
      paymentProvider?: PaymentProvider;
      mpesaPhoneNumber?: string;
      customerEmail?: string;
    } = body;

    const logistics = calculateLogisticsForDestination(
      destinationCountryIso,
      currency,
      subtotalAmount
    );

    const activeGateway: PaymentProvider =
      paymentProvider || logistics.recommendedGateway;
    const totalAmount =
      subtotalAmount + logistics.shippingFee + logistics.dutiesFee;

    if (activeGateway === "MPESA_DARAJA") {
      return NextResponse.json({
        ok: true,
        provider: "MPESA_DARAJA",
        environment: "DARAJA_2.0_STK_PUSH",
        assignedHub: logistics.assignedHub,
        courierPartner: logistics.courierPartner,
        checkoutRequestID: `ws_CO_${Date.now()}`,
        merchantRequestID: `MR_${Date.now()}`,
        customerMessage: `Success. Request accepted for processing on handset ${
          mpesaPhoneNumber || "2547XXXXXXXX"
        }`,
        amount: totalAmount,
        currency,
      });
    }

    if (activeGateway === "PAYSTACK") {
      return NextResponse.json({
        ok: true,
        provider: "PAYSTACK",
        assignedHub: logistics.assignedHub,
        courierPartner: logistics.courierPartner,
        accessCode: `psk_live_${Date.now()}`,
        reference: `PSK_MKM_${Date.now()}`,
        authorizationUrl: `https://checkout.paystack.com/mkm-${Date.now()}`,
        channels: ["card", "bank_transfer", "ussd", "apple_pay"],
        customerEmail,
        amount: totalAmount,
        currency,
      });
    }

    // Default: STRIPE (Global / North America / Europe)
    return NextResponse.json({
      ok: true,
      provider: "STRIPE",
      assignedHub: logistics.assignedHub,
      courierPartner: logistics.courierPartner,
      paymentIntentId: `pi_3Q8Mkm_${Date.now()}`,
      clientSecret: `pi_3Q8Mkm_${Date.now()}_secret_macklemore`,
      supportedMethods: ["card", "apple_pay", "google_pay"],
      amount: totalAmount,
      currency,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Payment orchestration failed" },
      { status: 400 }
    );
  }
}

