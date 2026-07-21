import { NextResponse } from "next/server";
import { getAuthSubject, AuthTokenPayload } from "@/lib/jwt";

/**
 * Shared guard for protected routes: requires a valid access token.
 * No role check — all authenticated users are developers.
 */
export function requireAuth(
  req: Request
): { ok: true; subject: AuthTokenPayload } | { ok: false; response: NextResponse } {
  const subject = getAuthSubject(req);
  if (!subject) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "unauthorized", detail: "A valid Bearer token is required" },
        { status: 401 }
      ),
    };
  }
  return { ok: true, subject };
}
