import { NextRequest, NextResponse } from "next/server";
import { INITIAL_B2B_INQUIRIES } from "@/lib/store-data";

export async function GET() {
  return NextResponse.json({
    ok: true,
    count: INITIAL_B2B_INQUIRIES.length,
    inquiries: INITIAL_B2B_INQUIRIES,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const referenceCode = `B2B-MKM-0${Math.floor(400 + Math.random() * 599)}`;

    return NextResponse.json({
      ok: true,
      referenceCode,
      status: "NEW",
      assignedExecutive: "Chidi Okonkwo (Lagos B2B Desk)",
      receivedAt: new Date().toISOString(),
      payload: body,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid B2B inquiry payload" },
      { status: 400 }
    );
  }
}

