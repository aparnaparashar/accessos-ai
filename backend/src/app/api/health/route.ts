import { NextResponse } from "next/server";

/**
 * GET /health — kept for backward compatibility; prefer /health/live and
 * /health/ready (Section 14). Mirrors /health/live.
 */
export async function GET() {
  return NextResponse.json({ status: "ok", service: "accessos-gateway", time: new Date().toISOString() });
}
