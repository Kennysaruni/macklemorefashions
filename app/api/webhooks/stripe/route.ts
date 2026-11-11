import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
    const stripeKey = process.env.STRIPE_SECRET_KEY || "";

    let eventType = "";
    let paymentReference = "";

    if (
      signature &&
      webhookSecret.startsWith("whsec_") &&
      !webhookSecret.includes("replace_me") &&
      stripeKey
    ) {
      const stripe = new Stripe(stripeKey);
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
      eventType = event.type;
      const obj = event.data.object as unknown as Record<string, unknown>;
      paymentReference = String(obj.payment_intent || obj.id || "");
    } else {
      const payload = JSON.parse(rawBody);
      eventType = payload.type || "";
      paymentReference =
        payload.data?.object?.payment_intent || payload.data?.object?.id || "";
    }

    if (
      (eventType === "payment_intent.succeeded" ||
        eventType === "checkout.session.completed") &&
      paymentReference
    ) {
      await prisma.order.updateMany({
        where: { paymentReference },
        data: {
          paymentStatus: "SUCCEEDED",
          status: "ALLOCATED_TO_HUB",
        },
      });

      try {
        const order = await prisma.order.findUnique({
          where: { paymentReference },
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
        console.warn("[Stripe Webhook] Receipt email dispatch warning:", emailErr);
      }
    }

    return NextResponse.json({ received: true, eventType, paymentReference });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}

