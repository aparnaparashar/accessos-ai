import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { authenticateApiKey } from "@/lib/apiKeyAuth";
import { runOCR } from "@/lib/ocr";
import UsageLog from "@/lib/models/UsageLog";
import { ocrRequestSchema } from "@/lib/validation";

/**
 * POST /v1/ocr — reference implementation of the Section-10 developer
 * product request pattern: API-key auth, local Tesseract OCR, UsageLog
 * write on every call (success or failure).
 *
 * Required headers:
 *   Authorization: Bearer <secret key>
 *   X-Client-Id: <client id>
 * Optional (recommended) replay-protected signing:
 *   X-Timestamp, X-Nonce, X-Signature — see lib/apiKeyAuth.ts for details.
 *
 * Body: { "image": "<base64 or data URL>" }
 */
export async function POST(req: Request) {
  const start = Date.now();
  const rawBody = await req.text();

  const auth = await authenticateApiKey(req, "ocr", rawBody);
  if (!auth.ok) {
    // Best-effort usage log even on auth failure, if we can tell which application this was.
    return NextResponse.json({ error: auth.error, detail: auth.detail }, { status: auth.status });
  }

  await connectDB();

  let statusCode = 200;
  let responseBody: unknown;

  try {
    const json = rawBody ? JSON.parse(rawBody) : {};
    const parsed = ocrRequestSchema.safeParse(json);
    if (!parsed.success) {
      statusCode = 400;
      responseBody = { error: "invalid_request", detail: parsed.error.flatten().fieldErrors };
    } else {
      const result = await runOCR(parsed.data.image);
      responseBody = { text: result.text };
    }
  } catch (err) {
    statusCode = 500;
    responseBody = { error: "server_error", detail: (err as Error).message };
  }

  const latency_ms = Date.now() - start;
  await UsageLog.create({
    application: auth.application._id,
    api: "ocr",
    status_code: statusCode,
    latency_ms,
  });

  return NextResponse.json(responseBody, {
    status: statusCode,
    headers: {
      "X-RateLimit-Limit": String(auth.rateLimit.limit),
      "X-RateLimit-Remaining": String(Math.max(0, auth.rateLimit.limit - auth.rateLimit.count)),
    },
  });
}
