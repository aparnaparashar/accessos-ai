import { NextResponse, NextRequest } from "next/server";

/**
 * Production hardening (Section 14): security response headers applied to
 * every response from this service. CSP is deliberately conservative since
 * this backend serves a JSON API, not markup.
 *
 * CORS (bug fix): this backend (localhost:8000) and the Angular frontend
 * (localhost:4200) are different origins, so the browser needs an explicit
 * Access-Control-Allow-* response on every /api/* call, plus a successful
 * answer to its OPTIONS preflight before it will send the real request
 * (this matters for anything with a JSON body or an Authorization header,
 * which is almost every route here). Previously this file only set security
 * headers and never touched CORS or OPTIONS at all, so the browser blocked
 * every direct call from the dev server before it ever reached a route
 * handler — the actual error in the browser console was of the form
 * "No 'Access-Control-Allow-Origin' header is present on the requested
 * resource" for every /v1/* request.
 *
 * ALLOWED_ORIGINS (comma-separated) controls which origins are echoed back
 * in Access-Control-Allow-Origin; defaults to the Angular dev server so
 * local dev works out of the box even without a .env file.
 */
const DEFAULT_ALLOWED_ORIGINS = ["http://localhost:4200", "http://127.0.0.1:4200"];

function allowedOrigins(): string[] {
  const configured = process.env.ALLOWED_ORIGINS;
  if (!configured) return DEFAULT_ALLOWED_ORIGINS;
  return configured
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  const allowed = allowedOrigins();
  if (allowed.includes("*") || allowed.includes(origin)) return true;
  // Allow any localhost / 127.0.0.1 origin during local development
  if (process.env.NODE_ENV !== "production" && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return true;
  }
  return false;
}

function applyCors(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get("origin");

  if (origin && isOriginAllowed(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Vary", "Origin");
  } else if (!origin) {
    res.headers.set("Access-Control-Allow-Origin", "*");
  }

  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Timestamp, X-Nonce, X-Signature, X-Client-Id"
  );
  res.headers.set("Access-Control-Max-Age", "86400");
  return res;
}

function applySecurityHeaders(res: NextResponse) {
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return res;
}

export function middleware(req: NextRequest) {
  // Preflight: the browser sends OPTIONS before any cross-origin request
  // that carries a JSON body or custom header (Authorization, etc).
  if (req.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    return applySecurityHeaders(applyCors(req, res));
  }

  const res = NextResponse.next();
  return applySecurityHeaders(applyCors(req, res));
}

export const config = {
  matcher: ["/v1/:path*", "/api/:path*", "/health/:path*"],
};
