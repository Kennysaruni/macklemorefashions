import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-response";
import {
  B2BInquiryRecord,
  B2BLeadStatus,
  INITIAL_B2B_INQUIRIES,
  InquiryChannel,
} from "@/lib/store-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const channel = searchParams.get("channel");

    try {
      const where: Record<string, unknown> = {};
      if (status) where.status = status;
      if (channel) where.channel = channel;

      const dbInquiries = await prisma.b2BInquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      if (dbInquiries.length > 0) {
        const formatted: B2BInquiryRecord[] = dbInquiries.map((inq) => ({
          id: inq.id,
          referenceCode: inq.referenceCode,
          channel: inq.channel as InquiryChannel,
          brandOrCompanyName: inq.brandOrCompanyName,
          contactName: inq.contactName,
          contactRole: inq.contactRole,
          email: inq.email,
          phone: inq.phone,
          headquartersCountry: inq.headquartersCountry,
          websiteUrl: inq.websiteUrl,
          targetRegions: inq.targetRegions,
          annualVolumeTier: inq.annualVolumeTier,
          message: inq.message,
          status: inq.status as B2BLeadStatus,
          assignedExecutive: inq.assignedExecutive,
          createdAt: inq.createdAt.toISOString(),
        }));

        return apiSuccess(formatted, { total: formatted.length });
      }
    } catch {
      // Fallback
    }

    let filtered = [...INITIAL_B2B_INQUIRIES];
    if (status) filtered = filtered.filter((i) => i.status === status);
    if (channel) filtered = filtered.filter((i) => i.channel === channel);

    return apiSuccess(filtered, { total: filtered.length });
  } catch (err) {
    return apiError((err as Error).message || "Failed to fetch B2B inquiries", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      channel = "BRAND_REPRESENTATION",
      brandOrCompanyName,
      contactName,
      contactRole = "Creative Director / Founder",
      email,
      phone = "+1 000 000 0000",
      headquartersCountry = "Nigeria",
      websiteUrl = "https://instagram.com",
      targetRegions = ["WEST_AFRICA", "NORTH_AMERICA"],
      annualVolumeTier = "500 - 2,500 UNITS",
      message = "Partner representation inquiry.",
    } = body;

    if (!brandOrCompanyName || !contactName || !email) {
      return apiError("Missing required fields: brandOrCompanyName, contactName, email", 400);
    }

    const assignedExecutive =
      targetRegions.includes("WEST_AFRICA") || targetRegions.includes("EAST_AFRICA")
        ? "Chidi Okonkwo (Nigeria B2B Desk)"
        : "Elena Rostova (Toronto / Global Desk)";

    let created: B2BInquiryRecord;

    try {
      const count = await prisma.b2BInquiry.count();
      const refCode = `B2B-MKM-0${420 + count}`;
      const id = body.id || `b2b-${Date.now()}`;

      const dbInq = await prisma.b2BInquiry.create({
        data: {
          id,
          referenceCode: refCode,
          channel,
          brandOrCompanyName,
          contactName,
          contactRole,
          email,
          phone,
          headquartersCountry,
          websiteUrl,
          targetRegions,
          annualVolumeTier,
          message,
          status: "NEW",
          assignedExecutive,
        },
      });

      created = {
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
    } catch {
      created = {
        id: `b2b-${Date.now()}`,
        referenceCode: `B2B-MKM-0${Math.floor(400 + Math.random() * 599)}`,
        channel: channel as InquiryChannel,
        brandOrCompanyName,
        contactName,
        contactRole,
        email,
        phone,
        headquartersCountry,
        websiteUrl,
        targetRegions,
        annualVolumeTier,
        message,
        status: "NEW",
        assignedExecutive,
        createdAt: new Date().toISOString(),
      };
    }

    return apiSuccess(created, undefined, 201);
  } catch (err) {
    return apiError((err as Error).message || "Failed to submit B2B inquiry", 500);
  }
}
