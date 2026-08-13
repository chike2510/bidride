import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, AUTH_CONSTANTS } from "@/lib/auth";

const PUBLIC_ROUTES = ["/landing", "/login", "/signup"];
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/request-ride",
  "/live-bidding",
  "/compare-drivers",
  "/ride-confirmed",
  "/live-tracking",
  "/ride-complete",
  "/ride-history",
  "/wallet",
  "/profile",
  "/saved-places",
  "/notifications",
  "/help-center",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_CONSTANTS.SESSION_COOKIE)?.value;
  const isAuthed = verifySessionToken(token) !== null;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isProtected && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/dashboard/:path*",
    "/request-ride/:path*",
    "/live-bidding/:path*",
    "/compare-drivers/:path*",
    "/ride-confirmed/:path*",
    "/live-tracking/:path*",
    "/ride-complete/:path*",
    "/ride-history/:path*",
    "/wallet/:path*",
    "/profile/:path*",
    "/saved-places/:path*",
    "/notifications/:path*",
    "/help-center/:path*",
    "/login",
    "/signup",
  ],
};
