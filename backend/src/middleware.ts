import { NextResponse, NextRequest } from "next/server";

/**
 * Production hardening: CORS & security response headers applied to every response.
 */
const DEFAULT_ALLOWED_ORIGINS = ["http://localhost:4200", "http://127.0.0.1:4200", "http://localhost:3000"];

function allowedOrigins(): string[] {
  const configured = process.env.ALLOWED_ORIGINS;
  if (!configured) return DEFAULT_ALLOWED_ORIGINS;
  return configured
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}

function applyCors(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get("origin");
  const allowed = allowedOrigins();

  if (origin && allowed.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Vary", "Origin");
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
  if (req.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    return applySecurityHeaders(applyCors(req, res));
  }

  const res = NextResponse.next();
  return applySecurityHeaders(applyCors(req, res));
}

export const config = {
  matcher: [
    "/api/:path*",
    "/v1/:path*",
    "/health/:path*",
    "/health",
    "/ocr",
    "/vision",
    "/simplify",
    "/accessibility",
    "/sign-language",
    "/demo/:path*",
    "/projects/:path*",
    "/projects",
    "/developer/:path*",
    "/auth/:path*",
  ],
};
