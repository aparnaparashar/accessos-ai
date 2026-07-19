import { NextResponse } from "next/server";
import { getAuthSubject } from "@/lib/jwt";
import { checkDailyRateLimit } from "@/lib/redis";
import { connectDB } from "@/lib/db";
import { runAssist, AssistRequest } from "@/lib/orchestrator";
import UsageLog from "@/lib/models/UsageLog";
import { assistSchema } from "@/lib/validation";
import { PLAN_DAILY_LIMITS } from "@/lib/plans";

/**
 * POST /v1/accessibility/assist
 * The single call site for every accessibility capability (Section 09).
 * requires Authorization: Bearer <token> (end-user JWT).
 * Writes a UsageLog row for every call, success or failure (Section 10/11).
 */
export async function POST(req: Request) {
  const start = Date.now();
  const subject = getAuthSubject(req);
  if (!subject) {
    return NextResponse.json({ error: "unauthorized", detail: "A valid Bearer token is required" }, { status: 401 });
  }

  const { allowed, count, limit } = await checkDailyRateLimit(subject.sub, PLAN_DAILY_LIMITS.free);
  const rateHeaders = {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(Math.max(0, limit - count)),
  };

  await connectDB();

  if (!allowed) {
    await UsageLog.create({ user: subject.sub, api: "accessibility.assist", status_code: 429, latency_ms: Date.now() - start });
    return NextResponse.json(
      { error: "rate_limit_exceeded", detail: `Daily quota of ${limit} requests exceeded`, count, limit },
      { status: 429, headers: rateHeaders }
    );
  }

  let statusCode = 200;
  let body: unknown;
  try {
    const raw = await req.text();
    const json = raw ? JSON.parse(raw) : {};
    const parsed = assistSchema.safeParse(json);
    if (!parsed.success) {
      statusCode = 400;
      body = { error: "invalid_request", detail: parsed.error.flatten().fieldErrors };
    } else {
      const result = await runAssist(parsed.data as AssistRequest);
      body = result;
    }
  } catch (err) {
    statusCode = 500;
    body = { error: "server_error", detail: (err as Error).message };
  }

  await UsageLog.create({
    user: subject.sub,
    api: "accessibility.assist",
    status_code: statusCode,
    latency_ms: Date.now() - start,
  });

  return NextResponse.json(body, { status: statusCode, headers: rateHeaders });
}
