import { NextResponse } from "next/server";

/** GET /v1/accessibility/health — liveness check for the Orchestrator. Section 09. */
export async function GET() {
  return NextResponse.json({ status: "ok", service: "accessibility-orchestrator", time: new Date().toISOString() });
}
