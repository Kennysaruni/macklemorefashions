import { NextRequest, NextResponse } from "next/server";
import { CURRENCIES, CurrencyCode } from "@/lib/store-data";

export async function GET(request: NextRequest) {
  const countryHeader =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.nextUrl.searchParams.get("country") ||
    "CA";

  let detectedCurrency: CurrencyCode = "CAD";
  switch (countryHeader.toUpperCase()) {
    case "NG":
      detectedCurrency = "NGN";
      break;
    case "GH":
      detectedCurrency = "GHS";
      break;
    case "KE":
      detectedCurrency = "KES";
      break;
    case "US":
      detectedCurrency = "USD";
      break;
    case "GB":
    case "UK":
      detectedCurrency = "GBP";
      break;
    case "FR":
    case "IT":
    case "DE":
    case "NL":
      detectedCurrency = "EUR";
      break;
    default:
      detectedCurrency = "CAD";
      break;
  }

  return NextResponse.json({
    detectedCountryIso: countryHeader.toUpperCase(),
    detectedCurrency,
    baseCurrency: "CAD",
    cacheStrategy: "UPSTASH_REDIS_TTL_3600S",
    currencies: CURRENCIES,
    timestamp: new Date().toISOString(),
  });
}

