import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-response";
import {
  CURRENCIES,
  CurrencyCode,
  INITIAL_ORDERS,
  OrderRecord,
  OrderStatus,
  PaymentProvider,
  PaymentStatus,
} from "@/lib/store-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const gateway = searchParams.get("gateway");
    const hub = searchParams.get("hub");
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));

    try {
      const where: Record<string, unknown> = {};
      if (status) where.status = status;
      if (gateway) where.paymentProvider = gateway;
      if (hub) where.assignedHub = hub;

      const [dbOrders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: { items: true },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: offset,
        }),
        prisma.order.count({ where }),
      ]);

      if (dbOrders.length > 0 || total > 0) {
        const formatted: OrderRecord[] = dbOrders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          customerName: o.customerName,
          customerEmail: o.customerEmail,
          customerPhone: o.customerPhone,
          destinationCountry: o.destinationCountry,
          destinationCity: o.destinationCity,
          currency: o.currency as CurrencyCode,
          subtotalAmount: o.subtotalAmount,
          shippingAmount: o.shippingAmount,
          dutiesAmount: o.dutiesAmount,
          totalAmount: o.totalAmount,
          assignedHub: o.assignedHub as OrderRecord["assignedHub"],
          courierPartner: o.courierPartner,
          waybillNumber: o.waybillNumber || undefined,
          status: o.status as OrderStatus,
          paymentProvider: o.paymentProvider as PaymentProvider,
          paymentReference: o.paymentReference,
          paymentStatus: o.paymentStatus as PaymentStatus,
          createdAt: o.createdAt.toISOString(),
          items: o.items.map((i) => ({
            productId: i.productId,
            productTitle: i.productTitle,
            brandName: i.brandName,
            size: i.size,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        }));

        return apiSuccess(formatted, { total, count: formatted.length, limit });
      }
    } catch {
      // Fallback
    }

    let filtered = [...INITIAL_ORDERS];
    if (status) filtered = filtered.filter((o) => o.status === status);
    if (gateway) filtered = filtered.filter((o) => o.paymentProvider === gateway);
    if (hub) filtered = filtered.filter((o) => o.assignedHub === hub);
    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return apiSuccess(paginated, { total, count: paginated.length, limit });
  } catch (err) {
    return apiError((err as Error).message || "Failed to fetch orders", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      destinationCountry,
      destinationCity,
      currency = "CAD",
      subtotalAmount,
      shippingAmount = 0,
      dutiesAmount = 0,
      totalAmount,
      assignedHub = "HUB_B_TORONTO",
      courierPartner = "DHL Express International",
      waybillNumber,
      paymentProvider = "STRIPE",
      paymentReference,
      items = [],
    } = body;

    if (!customerName || !customerEmail || typeof totalAmount !== "number") {
      return apiError("Missing required order fields: customerName, customerEmail, totalAmount", 400);
    }

    const rate = CURRENCIES[currency as CurrencyCode]?.rateFromCad || 1;
    const totalAmountCad = Math.round(totalAmount / rate);
    const orderId = body.id || `ord-${Date.now()}`;
    const pref = assignedHub === "HUB_A_LAGOS" ? "GIG-NG" : "DHL-YYZ";
    const computedWaybill =
      waybillNumber || `${pref}-${Math.floor(100000 + Math.random() * 899999)}`;
    const computedRef =
      paymentReference ||
      (paymentProvider === "PAYSTACK"
        ? `PSK_${Date.now()}`
        : `pi_3Q8Mkm_${Date.now()}`);

    let createdOrder: OrderRecord;

    try {
      const count = await prisma.order.count();
      const orderNumber = `MKM-2026-${9045 + count}`;

      const dbOrder = await prisma.order.create({
        data: {
          id: orderId,
          orderNumber,
          customerName,
          customerEmail,
          customerPhone: customerPhone || "+1 416 000 0000",
          destinationCountry: destinationCountry || "Canada",
          destinationCity: destinationCity || "Toronto, Canada",
          currency,
          subtotalAmount: Number(subtotalAmount) || totalAmount,
          shippingAmount: Number(shippingAmount) || 0,
          dutiesAmount: Number(dutiesAmount) || 0,
          totalAmount: Number(totalAmount),
          totalAmountCad,
          assignedHub,
          courierPartner,
          waybillNumber: computedWaybill,
          status: "ALLOCATED_TO_HUB",
          paymentProvider,
          paymentReference: computedRef,
          paymentStatus: "SUCCEEDED",
          items: {
            create: items.map(
              (i: {
                productId: string;
                productTitle: string;
                brandName: string;
                size: string;
                quantity: number;
                unitPrice: number;
              }) => ({
                productId: i.productId,
                productTitle: i.productTitle,
                brandName: i.brandName,
                size: i.size,
                quantity: Number(i.quantity) || 1,
                unitPrice: Number(i.unitPrice) || 0,
              })
            ),
          },
        },
        include: { items: true },
      });

      createdOrder = {
        id: dbOrder.id,
        orderNumber: dbOrder.orderNumber,
        customerName: dbOrder.customerName,
        customerEmail: dbOrder.customerEmail,
        customerPhone: dbOrder.customerPhone,
        destinationCountry: dbOrder.destinationCountry,
        destinationCity: dbOrder.destinationCity,
        currency: dbOrder.currency as CurrencyCode,
        subtotalAmount: dbOrder.subtotalAmount,
        shippingAmount: dbOrder.shippingAmount,
        dutiesAmount: dbOrder.dutiesAmount,
        totalAmount: dbOrder.totalAmount,
        assignedHub: dbOrder.assignedHub as OrderRecord["assignedHub"],
        courierPartner: dbOrder.courierPartner,
        waybillNumber: dbOrder.waybillNumber || undefined,
        status: dbOrder.status as OrderStatus,
        paymentProvider: dbOrder.paymentProvider as PaymentProvider,
        paymentReference: dbOrder.paymentReference,
        paymentStatus: dbOrder.paymentStatus as PaymentStatus,
        createdAt: dbOrder.createdAt.toISOString(),
        items: dbOrder.items.map((i) => ({
          productId: i.productId,
          productTitle: i.productTitle,
          brandName: i.brandName,
          size: i.size,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      };
    } catch {
      createdOrder = {
        id: orderId,
        orderNumber: `MKM-2026-${Date.now().toString().slice(-4)}`,
        customerName,
        customerEmail,
        customerPhone: customerPhone || "+1 416 000 0000",
        destinationCountry: destinationCountry || "Canada",
        destinationCity: destinationCity || "Toronto, Canada",
        currency: currency as CurrencyCode,
        subtotalAmount: Number(subtotalAmount) || totalAmount,
        shippingAmount: Number(shippingAmount) || 0,
        dutiesAmount: Number(dutiesAmount) || 0,
        totalAmount: Number(totalAmount),
        assignedHub: assignedHub as OrderRecord["assignedHub"],
        courierPartner,
        waybillNumber: computedWaybill,
        status: "ALLOCATED_TO_HUB",
        paymentProvider: paymentProvider as PaymentProvider,
        paymentReference: computedRef,
        paymentStatus: "SUCCEEDED",
        createdAt: new Date().toISOString(),
        items,
      };
    }

    return apiSuccess(createdOrder, undefined, 201);
  } catch (err) {
    return apiError((err as Error).message || "Failed to create order", 500);
  }
}

