import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_COOKIE_NAME,
  getAdminSession,
  signAdminToken,
} from "@/lib/admin-auth";

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json({
    ok: true,
    authenticated: Boolean(session),
    user: session,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email = "", password = "" } = await request.json();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return NextResponse.json(
        { ok: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    let adminUser = await prisma.adminUser
      .findUnique({
        where: { email: cleanEmail },
      })
      .catch(() => null);

    const envEmail = (
      process.env.ADMIN_INITIAL_EMAIL || "admin@macklemorefashions.com"
    )
      .trim()
      .toLowerCase();
    const envPassword = process.env.ADMIN_INITIAL_PASSWORD || "ChangeMe2026!";

    // Auto-provision initial admin in Neon DB if matching .env credentials
    if (!adminUser && cleanEmail === envEmail && password === envPassword) {
      const passwordHash = await bcrypt.hash(envPassword, 10);
      adminUser = await prisma.adminUser
        .upsert({
          where: { email: envEmail },
          update: { lastLoginAt: new Date() },
          create: {
            email: envEmail,
            name: "Micah Elechi (Executive Admin)",
            passwordHash,
            role: "SUPER_ADMIN",
            lastLoginAt: new Date(),
          },
        })
        .catch(() => null);
    }

    let isValid = false;
    let payload = {
      id: "admin-root",
      email: envEmail,
      name: "Micah Elechi (Executive Admin)",
      role: "SUPER_ADMIN",
    };

    if (adminUser) {
      isValid = await bcrypt.compare(password, adminUser.passwordHash);
      if (!isValid && cleanEmail === envEmail && password === envPassword) {
        isValid = true;
      }
      if (isValid) {
        await prisma.adminUser
          .update({
            where: { id: adminUser.id },
            data: { lastLoginAt: new Date() },
          })
          .catch(() => {});
        payload = {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
        };
      }
    } else if (cleanEmail === envEmail && password === envPassword) {
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json(
        { ok: false, error: "Invalid administrator email or password" },
        { status: 401 }
      );
    }

    const token = await signAdminToken(payload);
    const response = NextResponse.json({
      ok: true,
      user: payload,
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Authentication failed",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}

