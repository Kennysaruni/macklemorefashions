import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-response";
import {
  B2BInquiryRecord,
  B2BLeadStatus,
  INITIAL_B2B_INQUIRIES,
  InquiryChannel,
} from "@/lib/store-data";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    try {
      const dbInq = await prisma.b2BInquiry.findFirst({
        where: { OR: [{ id }, { referenceCode: id }] },
      });

      if (dbInq) {
        const formatted: B2BInquiryRecord = {
          id: dbInq.id,
          referenceCode: dbInq.referenceCode,
          channel: dbInq.channel as InquiryChannel,
          brandOrCompanyName: dbInq.brandOrCompanyName,
          contactName: dbInq.contactName,
          contactRole: dbInq.contactRole,
          email: dbInq.email,
          phone: dbInq.phone,
          headquartersCountry: dbInq.headquartersCountry,
          websiteUrl: dbInq.websiteUrl,
          targetRegions: dbInq.targetRegions,
          annualVolumeTier: dbInq.annualVolumeTier,
          message: dbInq.message,
          status: dbInq.status as B2BLeadStatus,
          assignedExecutive: dbInq.assignedExecutive,
          createdAt: dbInq.createdAt.toISOString(),
        };
        return apiSuccess(formatted);
      }
    } catch {
      // Fallback
    }

    const fallback = INITIAL_B2B_INQUIRIES.find(
      (i) => i.id === id || i.referenceCode === id
    );
    if (!fallback) {
      return apiError(`B2B inquiry "${id}" not found`, 404, "NOT_FOUND");
    }
    return apiSuccess(fallback);
  } catch (err) {
    return apiError((err as Error).message || "Failed to fetch B2B inquiry", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowed = ["status", "assignedExecutive", "message"];
    const data: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) data[key] = body[key];
    }

    try {
      const inq = await prisma.b2BInquiry.findFirst({
        where: { OR: [{ id }, { referenceCode: id }] },
      });

      if (inq) {
        const updated = await prisma.b2BInquiry.update({
          where: { id: inq.id },
          data,
        });
        return apiSuccess(updated);
      }
    } catch {
      // Fallback
    }

    return apiSuccess({ id, ...body, updatedAt: new Date().toISOString() });
  } catch (err) {
    return apiError((err as Error).message || "Failed to update B2B inquiry", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    try {
      const inq = await prisma.b2BInquiry.findFirst({
        where: { OR: [{ id }, { referenceCode: id }] },
      });
      if (inq) {
        await prisma.b2BInquiry.delete({ where: { id: inq.id } });
      }
    } catch {
      // Fallback
    }

    return apiSuccess({ deletedId: id });
  } catch (err) {
    return apiError((err as Error).message || "Failed to delete B2B inquiry", 500);
  }
}

