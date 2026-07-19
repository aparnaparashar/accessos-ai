import { NextResponse } from "next/server";
import { pingDB } from "@/lib/db";
import { pingRedis } from "@/lib/redis";

/** GET /health/ready — readiness: Mongo and Redis are both reachable. Section 14. */
export async function GET() {
  const [mongoOk, redisOk] = await Promise.all([pingDB(), pingRedis()]);
  const ready = mongoOk && redisOk;
  return NextResponse.json(
    { status: ready ? "ok" : "degraded", mongo: mongoOk, redis: redisOk, time: new Date().toISOString() },
    { status: ready ? 200 : 503 }
  );
}
