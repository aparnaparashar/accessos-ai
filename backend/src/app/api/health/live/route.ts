import { NextResponse } from "next/server";

/** GET /health/live — liveness: process is up and serving requests. Section 14. */
export async function GET() {
  return NextResponse.json({ status: "ok", service: "accessos-gateway", time: new Date().toISOString() });
}
