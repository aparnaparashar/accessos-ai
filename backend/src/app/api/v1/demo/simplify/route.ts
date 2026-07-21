import { NextResponse } from "next/server";
import { runTextSimplify } from "@/lib/orchestrator";
import { requireAuth } from "@/lib/requireAuth";
import { simplifyRequestSchema, parseJsonBody } from "@/lib/validation";

/**
 * POST /v1/demo/simplify — Authenticated text simplification demo. Requires developer JWT Bearer token.
 * Calls the real AI provider (OpenAI/Gemini) to simplify text.
 */
export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  try {
    const parsed = await parseJsonBody(req, simplifyRequestSchema);
    if (!parsed.ok) return parsed.response;

    const result = await runTextSimplify(parsed.data.text);
    if ("error" in result) {
      return NextResponse.json(result, { status: 503 });
    }
    return NextResponse.json({ ...result, demo: true });
  } catch (err) {
    return NextResponse.json(
      { error: "server_error", detail: (err as Error).message },
      { status: 500 }
    );
  }
}
