import { NextResponse } from "next/server";
import { runTextSimplify } from "@/lib/orchestrator";
import { simplifyRequestSchema, parseJsonBody } from "@/lib/validation";

/**
 * POST /demo/simplify — Public Text Simplification demo endpoint. No API key required.
 */
export async function POST(req: Request) {
  try {
    const parsed = await parseJsonBody(req, simplifyRequestSchema);
    if (!parsed.ok) return parsed.response;

    const result = await runTextSimplify(parsed.data.text);
    if ("error" in result) {
      return NextResponse.json(result, { status: 503 });
    }
    return NextResponse.json({ ...result, demo: true });
  } catch (err) {
    return NextResponse.json({ error: "server_error", detail: (err as Error).message }, { status: 500 });
  }
}
