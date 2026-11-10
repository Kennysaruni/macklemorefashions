import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");
    const secret =
      process.env.PAYSTACK_WEBHOOK_SECRET ||
      process.env.PAYSTACK_SECRET_KEY ||
      "";

    if (signature && secret && !secret.includes("replace_me")) {
      const expected = crypto
        .createHmac("sha512", secret)
        .update(rawBody)
        .digest("hex");
      if (expected !== signature) {
        return NextResponse.json(
          { ok: false, error: "Invalid Paystack signature" },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event || "";
    const reference = payload.data?.reference || "";

    if (event === "charge.success" && reference) {
      await prisma.order.updateMany({
        where: { paymentReference: reference },
        data: {
          paymentStatus: "SUCCEEDED",
          status: "ALLOCATED_TO_HUB",
        },
      });
    }

    return NextResponse.json({ received: true, event, reference });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}

