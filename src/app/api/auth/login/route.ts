import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DEMO_USERS } from "@/types";
import { createSessionToken, SESSION_COOKIE_OPTIONS } from "@/lib/auth-session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email } = body;

    let targetUser = null;

    if (userId) {
      targetUser = DEMO_USERS.find((u) => u.id === userId);
    } else if (email) {
      targetUser = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === String(email).toLowerCase()
      );
    }

    if (!targetUser) {
      // Fallback to first demo user if login is generic
      targetUser = DEMO_USERS[0];
    }

    // Generate tamper-proof session token
    const token = createSessionToken(targetUser);

    // Set secure cookie on server response
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_OPTIONS.name, token, {
      httpOnly: SESSION_COOKIE_OPTIONS.httpOnly,
      secure: SESSION_COOKIE_OPTIONS.secure,
      sameSite: SESSION_COOKIE_OPTIONS.sameSite,
      path: SESSION_COOKIE_OPTIONS.path,
      maxAge: SESSION_COOKIE_OPTIONS.maxAge,
    });

    return NextResponse.json({
      success: true,
      user: targetUser,
      security: {
        httpOnly: true,
        sameSite: "lax",
        tokenIssued: true,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
