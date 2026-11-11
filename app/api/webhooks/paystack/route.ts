import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email-service";

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

      try {
        const order = await prisma.order.findUnique({
          where: { paymentReference: reference },
          include: { items: true },
        });

        if (order && order.customerEmail && order.items.length > 0) {
          void sendOrderConfirmationEmail({
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            shippingAddress:
              order.shippingAddress ||
              `${order.destinationCity}, ${order.destinationCountry}`,
            destinationCity: order.destinationCity,
            destinationCountry: order.destinationCountry,
            currency: order.currency,
            subtotalAmount: order.subtotalAmount,
            shippingAmount: order.shippingAmount,
            dutiesAmount: order.dutiesAmount,
            totalAmount: order.totalAmount,
            assignedHub: order.assignedHub,
            courierPartner: order.courierPartner,
            waybillNumber: order.waybillNumber || "MKM-WAYBILL",
            paymentProvider: order.paymentProvider,
            paymentReference: order.paymentReference,
            items: order.items.map((i) => ({
              productId: i.productId,
              productTitle: i.productTitle,
              brandName: i.brandName,
              size: i.size,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
            })),
          });
        }
      } catch (emailErr) {
        console.warn("[Paystack Webhook] Receipt email dispatch warning:", emailErr);
      }
    }

    return NextResponse.json({ received: true, event, reference });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}

