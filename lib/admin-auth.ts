import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "mkm_admin_session";

function getSecretKey(): Uint8Array {
  const secret =
    process.env.ADMIN_AUTH_SECRET ||
    "macklemore-fashions-default-secret-key-2026-toronto-nigeria";
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function signAdminToken(
  payload: AdminSessionPayload
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyAdminToken(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return {
      id: String(payload.id || ""),
      email: String(payload.email || ""),
      name: String(payload.name || "Macklemore Admin"),
      role: String(payload.role || "SUPER_ADMIN"),
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyAdminToken(token);
  } catch {
    return null;
  }
}

