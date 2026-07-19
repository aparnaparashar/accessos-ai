import { NextResponse } from "next/server";
import { getAuthSubject, AuthTokenPayload } from "@/lib/jwt";

/**
 * Shared guard for the Developer Platform routes (Section 10): requires a
 * valid access token whose role is "developer". Returns either the verified
 * subject or a ready-to-return 401/403 NextResponse.
 */
export function requireDeveloper(
  req: Request
): { ok: true; subject: AuthTokenPayload } | { ok: false; response: NextResponse } {
  const subject = getAuthSubject(req);
  if (!subject) {
    return {
      ok: false,
      response: NextResponse.json({ error: "unauthorized", detail: "A valid Bearer token is required" }, { status: 401 }),
    };
  }
  if (subject.role !== "developer") {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "forbidden", detail: "This endpoint is only available to developer accounts" },
        { status: 403 }
      ),
    };
  }
  return { ok: true, subject };
}
