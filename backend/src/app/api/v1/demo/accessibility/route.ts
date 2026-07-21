import { NextResponse } from "next/server";
import { runAccessibilityAnalyze } from "@/lib/orchestrator";
import { requireAuth } from "@/lib/requireAuth";
import { accessibilityRequestSchema, parseJsonBody } from "@/lib/validation";

/**
 * POST /v1/demo/accessibility — Authenticated accessibility orchestration demo.
 * Requires developer JWT Bearer token. No API key needed.
 */
export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  try {
    const parsed = await parseJsonBody(req, accessibilityRequestSchema);
    if (!parsed.ok) return parsed.response;

    const result = await runAccessibilityAnalyze(parsed.data);
    return NextResponse.json({ ...result, demo: true });
  } catch (err) {
    return NextResponse.json(
      { error: "server_error", detail: (err as Error).message },
      { status: 500 }
    );
  }
}
