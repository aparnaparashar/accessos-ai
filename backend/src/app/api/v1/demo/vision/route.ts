import { NextResponse } from "next/server";
import { runVisionDescribe } from "@/lib/orchestrator";
import { requireAuth } from "@/lib/requireAuth";
import { visionRequestSchema, parseJsonBody } from "@/lib/validation";

/**
 * POST /v1/demo/vision — Authenticated vision demo. Requires developer JWT Bearer token.
 * Calls the real AI provider (OpenAI/Gemini) to describe images.
 */
export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  try {
    const parsed = await parseJsonBody(req, visionRequestSchema);
    if (!parsed.ok) return parsed.response;

    const result = await runVisionDescribe(parsed.data.image, parsed.data.simplified);
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
