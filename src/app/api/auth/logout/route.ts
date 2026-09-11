import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_OPTIONS } from "@/lib/auth-session";

export async function POST() {
  try {
    const cookieStore = await cookies();
    // Delete session cookie by setting maxAge to 0
    cookieStore.set(SESSION_COOKIE_OPTIONS.name, "", {
      httpOnly: SESSION_COOKIE_OPTIONS.httpOnly,
      secure: SESSION_COOKIE_OPTIONS.secure,
      sameSite: SESSION_COOKIE_OPTIONS.sameSite,
      path: SESSION_COOKIE_OPTIONS.path,
      maxAge: 0,
    });

    return NextResponse.json({
      success: true,
      message: "Session terminated successfully",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
