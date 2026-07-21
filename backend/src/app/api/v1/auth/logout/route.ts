import { NextResponse } from "next/server";
import { getAuthSubject } from "@/lib/jwt";
import { getRedis } from "@/lib/redis";

/**
 * POST /auth/logout
 * Blacklists the caller's current access token in Redis so it cannot be
 * reused for the remainder of its natural TTL. The frontend should also
 * discard its stored tokens.
 */
export async function POST(req: Request) {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "unauthorized", detail: "No token provided" }, { status: 401 });
  }

  const subject = getAuthSubject(req);
  if (!subject) {
    return NextResponse.json({ error: "invalid_token", detail: "Token is invalid or expired" }, { status: 401 });
  }

  // Blacklist the token in Redis for the remaining TTL (max 15 min for access tokens).
  try {
    const redis = getRedis();
    const ttl = Number(process.env.JWT_ACCESS_TTL_SECONDS || 900); // 15m default
    await redis.set(`blacklist:${token}`, "1", "EX", ttl);
  } catch {
    // Fail open if Redis is down — token will expire naturally.
  }

  return NextResponse.json({ message: "Logged out successfully" });
}
