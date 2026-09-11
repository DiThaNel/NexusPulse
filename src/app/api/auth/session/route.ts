import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DEMO_USERS } from "@/types";
import {
  NEXUS_SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/auth-session";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(NEXUS_SESSION_COOKIE);

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        security: {
          edgeMiddleware: true,
          httpOnlyCookies: true,
          headersConfigured: true,
          zodValidation: true,
        },
      });
    }

    const payload = verifySessionToken(sessionCookie.value);
    if (!payload) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        error: "Session token invalid or expired",
      });
    }

    const user = DEMO_USERS.find((u) => u.id === payload.userId) || null;

    return NextResponse.json({
      authenticated: true,
      user,
      session: {
        role: payload.role,
        expiresAt: new Date(payload.exp * 1000).toISOString(),
      },
      security: {
        edgeMiddleware: true,
        httpOnlyCookies: true,
        headersConfigured: true,
        zodValidation: true,
      },
    });
  } catch {
    return NextResponse.json(
      { authenticated: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
