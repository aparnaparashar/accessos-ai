import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { authenticateApiKey } from "@/lib/apiKeyAuth";
import { runTextSimplify } from "@/lib/orchestrator";
import RequestLog from "@/lib/models/RequestLog";
import { simplifyRequestSchema } from "@/lib/validation";

/**
 * POST /simplify — Simplify text for cognitive accessibility. Requires API Key.
 */
export async function POST(req: Request) {
  const start = Date.now();
  const rawBody = await req.text();

  const auth = await authenticateApiKey(req, rawBody);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error, detail: auth.detail }, { status: auth.status });
  }

  await connectDB();

  let statusCode = 200;
  let responseBody: unknown;
  let errorDetail: string | undefined;

  try {
    const json = rawBody ? JSON.parse(rawBody) : {};
    const parsed = simplifyRequestSchema.safeParse(json);
    if (!parsed.success) {
      statusCode = 400;
      errorDetail = "Invalid request format";
      responseBody = { error: "invalid_request", detail: parsed.error.flatten().fieldErrors };
    } else {
      const result = await runTextSimplify(parsed.data.text);
      if ("error" in result && result.error) {
        statusCode = 503;
        errorDetail = result.error.detail;
        responseBody = result;
      } else {
        responseBody = result;
      }
    }
  } catch (err) {
    statusCode = 500;
    errorDetail = (err as Error).message;
    responseBody = { error: "server_error", detail: (err as Error).message };
  }

  const latency_ms = Date.now() - start;
  await RequestLog.create({
    project: auth.project._id,
    api_key: auth.apiKeyId,
    endpoint: "/simplify",
    method: "POST",
    status_code: statusCode,
    latency_ms,
    error: errorDetail || null,
  });

  return NextResponse.json(responseBody, {
    status: statusCode,
    headers: {
      "X-RateLimit-Limit": String(auth.rateLimit.limit),
      "X-RateLimit-Remaining": String(Math.max(0, auth.rateLimit.limit - auth.rateLimit.count)),
    },
  });
}
