import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-response";
import {
  CurrencyCode,
  INITIAL_ORDERS,
  OrderRecord,
  OrderStatus,
  PaymentProvider,
  PaymentStatus,
} from "@/lib/store-data";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    try {
      const dbOrder = await prisma.order.findFirst({
        where: {
          OR: [{ id }, { orderNumber: id }, { paymentReference: id }],
        },
        include: { items: true },
      });

      if (dbOrder) {
        const formatted: OrderRecord = {
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
        return apiSuccess(formatted);
      }
    } catch {
      // Fallback
    }

    const fallback = INITIAL_ORDERS.find(
      (o) => o.id === id || o.orderNumber === id || o.paymentReference === id
    );
    if (!fallback) {
      return apiError(`Order "${id}" not found`, 404, "NOT_FOUND");
    }
    return apiSuccess(fallback);
  } catch (err) {
    return apiError((err as Error).message || "Failed to fetch order", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowed = [
      "status",
      "paymentStatus",
      "waybillNumber",
      "assignedHub",
      "courierPartner",
    ];

    const data: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) data[key] = body[key];
    }

    try {
      const order = await prisma.order.findFirst({
        where: { OR: [{ id }, { orderNumber: id }] },
      });

      if (order) {
        const updated = await prisma.order.update({
          where: { id: order.id },
          data,
          include: { items: true },
        });
        return apiSuccess(updated);
      }
    } catch {
      // Fallback
    }

    return apiSuccess({ id, ...body, updatedAt: new Date().toISOString() });
  } catch (err) {
    return apiError((err as Error).message || "Failed to update order", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    try {
      const order = await prisma.order.findFirst({
        where: { OR: [{ id }, { orderNumber: id }] },
      });
      if (order) {
        await prisma.order.delete({ where: { id: order.id } });
      }
    } catch {
      // Fallback
    }

    return apiSuccess({ deletedId: id });
  } catch (err) {
    return apiError((err as Error).message || "Failed to delete order", 500);
  }
}

