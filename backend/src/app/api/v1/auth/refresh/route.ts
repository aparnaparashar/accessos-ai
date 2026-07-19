import { NextResponse } from "next/server";
import { verifyRefreshToken, signAccessToken } from "@/lib/jwt";
import { refreshSchema, parseJsonBody } from "@/lib/validation";

/**
 * POST /v1/auth/refresh
 * Exchanges a valid refresh token for a new access token. Section 08.
 */
export async function POST(req: Request) {
  try {
    const parsed = await parseJsonBody(req, refreshSchema);
    if (!parsed.ok) return parsed.response;

    const payload = verifyRefreshToken(parsed.data.refresh_token);
    return NextResponse.json({
      access_token: signAccessToken({ sub: payload.sub, email: payload.email, role: payload.role }),
      token_type: "bearer",
    });
  } catch {
    return NextResponse.json({ error: "invalid_token", detail: "Refresh token is invalid or expired" }, { status: 401 });
  }
}
