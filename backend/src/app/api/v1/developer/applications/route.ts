import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/lib/models/Application";
import { writeAuditLog } from "@/lib/models/AuditLog";
import { requireDeveloper } from "@/lib/requireDeveloper";
import { createApplicationSchema, parseJsonBody } from "@/lib/validation";

/**
 * POST /v1/developer/applications — create an Application owned by the caller.
 * GET  /v1/developer/applications — list the caller's own applications.
 * Section 10 (Developer Platform). Requires a developer-role JWT.
 */
export async function POST(req: Request) {
  const auth = requireDeveloper(req);
  if (!auth.ok) return auth.response;

  const parsed = await parseJsonBody(req, createApplicationSchema);
  if (!parsed.ok) return parsed.response;

  await connectDB();
  const app = await Application.create({
    owner: auth.subject.sub,
    name: parsed.data.name,
    plan: parsed.data.plan || "free",
    allowed_apis: parsed.data.allowed_apis || ["ocr", "accessibility.assist"],
  });

  await writeAuditLog({
    actor: auth.subject.sub,
    action: "application.create",
    detail: { application_id: app._id.toString(), name: app.name, plan: app.plan },
    req,
  });

  return NextResponse.json({ application: app }, { status: 201 });
}

export async function GET(req: Request) {
  const auth = requireDeveloper(req);
  if (!auth.ok) return auth.response;

  await connectDB();
  const apps = await Application.find({ owner: auth.subject.sub }).sort({ createdAt: -1 });
  return NextResponse.json({ applications: apps });
}
