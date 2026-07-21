import { NextResponse } from "next/server";
import { runSignGloss } from "@/lib/orchestrator";
import { signLanguageRequestSchema, parseJsonBody } from "@/lib/validation";

/**
 * POST /demo/sign-language — Public Sign Language demo endpoint. No API key required.
 */
export async function POST(req: Request) {
  try {
    const parsed = await parseJsonBody(req, signLanguageRequestSchema);
    if (!parsed.ok) return parsed.response;

    const result = runSignGloss(parsed.data.text);
    return NextResponse.json({ ...result, demo: true });
  } catch (err) {
    return NextResponse.json({ error: "server_error", detail: (err as Error).message }, { status: 500 });
  }
}
