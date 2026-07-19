import { NextResponse, NextRequest } from "next/server";

/**
 * Production hardening (Section 14): security response headers applied to
 * every response from this service. CSP is deliberately conservative since
 * this backend serves a JSON API, not markup.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return res;
}

export const config = {
  matcher: "/api/:path*",
};
