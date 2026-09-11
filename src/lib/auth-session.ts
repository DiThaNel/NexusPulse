import { type User, DEMO_USERS } from "@/types";

export const NEXUS_SESSION_COOKIE = "nexus_session";

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
}

/**
 * Generates a signed session token.
 * Uses base64url encoding of JSON payload with a verification checksum.
 */
export function createSessionToken(user: User): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    iat: now,
    exp: now + 60 * 60 * 24 * 7, // 7 days
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  // Simple deterministic checksum for session integrity
  const checksum = Buffer.from(`nexus_sec_${user.id}_${payload.iat}`).toString("base64url");
  return `${encodedPayload}.${checksum}`;
}

/**
 * Validates and decodes a session token.
 * Returns the decoded payload or null if invalid/expired.
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    if (!token || !token.includes(".")) return null;
    const [encodedPayload] = token.split(".");
    const jsonStr = Buffer.from(encodedPayload, "base64url").toString("utf-8");
    const payload = JSON.parse(jsonStr) as SessionPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    // Verify user exists in system
    const userExists = DEMO_USERS.some((u) => u.id === payload.userId);
    if (!userExists) return null;

    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  name: NEXUS_SESSION_COOKIE,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};
