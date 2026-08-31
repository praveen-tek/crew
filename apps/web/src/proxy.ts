import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/sign-in",
  "/sign-up",
  "/api/auth",
  "/favicon.ico",
  "/logo.svg",
  "/logo.png",
  "/8417399.jpg",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static Next.js assets, public assets, and API auth routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
  ) {
    return NextResponse.next();
  }

  // Check Better Auth session token cookie
  const sessionCookie =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  // For root landing page: allow access, but client/server will adapt to session state
  if (pathname === "/") {
    return NextResponse.next();
  }

  // For protected routes (/match, /dashboard, /api/match, etc.), require valid session cookie
  if (!sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export default proxy;
