import { NextResponse } from "next/server";
import { runAccessibilityAnalyze } from "@/lib/orchestrator";
import { accessibilityRequestSchema, parseJsonBody } from "@/lib/validation";

/**
 * POST /demo/accessibility — Public Accessibility demo endpoint. No API key required.
 */
export async function POST(req: Request) {
  try {
    const parsed = await parseJsonBody(req, accessibilityRequestSchema);
    if (!parsed.ok) return parsed.response;

    const result = await runAccessibilityAnalyze(parsed.data);
    return NextResponse.json({ ...result, demo: true });
  } catch (err) {
    return NextResponse.json({ error: "server_error", detail: (err as Error).message }, { status: 500 });
  }
}
