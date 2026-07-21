import { NextResponse } from "next/server";
import { runOCR } from "@/lib/ocr";
import { requireAuth } from "@/lib/requireAuth";
import { ocrRequestSchema, parseJsonBody } from "@/lib/validation";

/**
 * POST /v1/demo/ocr — Authenticated OCR demo. Requires developer JWT Bearer token.
 * No API key or project required — for playground/features page use.
 */
export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  try {
    const parsed = await parseJsonBody(req, ocrRequestSchema);
    if (!parsed.ok) return parsed.response;

    const result = await runOCR(parsed.data.image);
    return NextResponse.json({ ...result, demo: true });
  } catch (err) {
    return NextResponse.json(
      { error: "server_error", detail: (err as Error).message },
      { status: 500 }
    );
  }
}
