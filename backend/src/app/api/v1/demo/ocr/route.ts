import { NextResponse } from "next/server";
import { runOCR } from "@/lib/ocr";
import { ocrRequestSchema, parseJsonBody } from "@/lib/validation";

/**
 * POST /demo/ocr — Public OCR demo endpoint. No API key required.
 */
export async function POST(req: Request) {
  try {
    const parsed = await parseJsonBody(req, ocrRequestSchema);
    if (!parsed.ok) return parsed.response;

    const result = await runOCR(parsed.data.image);
    return NextResponse.json({ text: result.text, demo: true });
  } catch (err) {
    return NextResponse.json({ error: "server_error", detail: (err as Error).message }, { status: 500 });
  }
}
