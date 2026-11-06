import { NextRequest, NextResponse } from "next/server";
import {
  calculateLogisticsForDestination,
  CurrencyCode,
} from "@/lib/store-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const destinationCountryIso: string = (
      body.destinationCountryIso || "NG"
    ).toUpperCase();
    const currency: CurrencyCode = body.currency || "NGN";
    const subtotalInCurrency: number = Number(body.subtotalInCurrency) || 0;

    const calculation = calculateLogisticsForDestination(
      destinationCountryIso,
      currency,
      subtotalInCurrency
    );

    return NextResponse.json({
      ok: true,
      destinationCountryIso,
      currency,
      subtotalInCurrency,
      ...calculation,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid shipping calculation payload" },
      { status: 400 }
    );
  }
}

