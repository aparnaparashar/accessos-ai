import { NextResponse } from "next/server";
import { runSignGloss } from "@/lib/orchestrator";
import { requireAuth } from "@/lib/requireAuth";
import { signLanguageRequestSchema, parseJsonBody } from "@/lib/validation";

/**
 * POST /v1/demo/sign-language — Authenticated sign gloss demo. Requires developer JWT Bearer token.
 * Uses AI to produce proper ASL gloss notation ordering.
 */
export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  try {
    const parsed = await parseJsonBody(req, signLanguageRequestSchema);
    if (!parsed.ok) return parsed.response;

    const result = await runSignGloss(parsed.data.text);
    return NextResponse.json({ ...result, demo: true });
  } catch (err) {
    return NextResponse.json(
      { error: "server_error", detail: (err as Error).message },
      { status: 500 }
    );
  }
}
