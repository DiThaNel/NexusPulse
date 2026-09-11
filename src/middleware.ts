import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected private routes that require authenticated session
const PROTECTED_ROUTES = [
  "/board",
  "/analytics",
  "/workflows",
  "/settings",
];

/**
 * Validates session token payload in Edge runtime using standard Web APIs.
 */
function isSessionValid(cookieValue: string | undefined): boolean {
  if (!cookieValue || !cookieValue.includes(".")) return false;
  try {
    const [encodedPayload] = cookieValue.split(".");
    // Convert base64url to base64
    let base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const jsonStr = atob(base64);
    const data = JSON.parse(jsonStr);
    const now = Math.floor(Date.now() / 1000);

    return Boolean(data.userId && data.exp && data.exp > now);
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Read the HttpOnly session cookie
  const sessionCookie = request.cookies.get("nexus_session");
  const hasValidSession = isSessionValid(sessionCookie?.value);

  // Check if current route is in protected routes list
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. If accessing a protected route without a valid session -> Redirect to /login
  if (isProtectedRoute && !hasValidSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If already authenticated and accessing /login -> Redirect to target or /board
  if (pathname === "/login" && hasValidSession) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    const target = redirectParam && redirectParam.startsWith("/") ? redirectParam : "/board";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 3. Defense-in-depth: inject security headers into outgoing response
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Security-Guard", "Edge-Middleware-Active");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public assets (.svg, .png, .jpg, .webp)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
