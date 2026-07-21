import { NextResponse } from "next/server";
import { runVisionDescribe } from "@/lib/orchestrator";
import { visionRequestSchema, parseJsonBody } from "@/lib/validation";

/**
 * POST /demo/vision — Public Vision demo endpoint. No API key required.
 */
export async function POST(req: Request) {
  try {
    const parsed = await parseJsonBody(req, visionRequestSchema);
    if (!parsed.ok) return parsed.response;

    const result = await runVisionDescribe(parsed.data.image, parsed.data.simplified);
    if ("error" in result) {
      return NextResponse.json(result, { status: 503 });
    }
    return NextResponse.json({ ...result, demo: true });
  } catch (err) {
    return NextResponse.json({ error: "server_error", detail: (err as Error).message }, { status: 500 });
  }
}
