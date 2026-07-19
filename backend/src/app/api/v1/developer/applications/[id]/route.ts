import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/lib/models/Application";
import { writeAuditLog } from "@/lib/models/AuditLog";
import { requireDeveloper } from "@/lib/requireDeveloper";
import { updateApplicationSchema, parseJsonBody } from "@/lib/validation";

/**
 * PATCH /v1/developer/applications/:id — update name/plan/allowed_apis.
 * Section 10. Requires a developer-role JWT and ownership of the application.
 */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = requireDeveloper(req);
  if (!auth.ok) return auth.response;

  const parsed = await parseJsonBody(req, updateApplicationSchema);
  if (!parsed.ok) return parsed.response;

  await connectDB();
  const app = await Application.findById(params.id);
  if (!app) {
    return NextResponse.json({ error: "not_found", detail: "Application does not exist" }, { status: 404 });
  }
  if (app.owner.toString() !== auth.subject.sub) {
    return NextResponse.json({ error: "forbidden", detail: "You do not own this application" }, { status: 403 });
  }

  if (parsed.data.name !== undefined) app.name = parsed.data.name;
  if (parsed.data.plan !== undefined) app.plan = parsed.data.plan;
  if (parsed.data.allowed_apis !== undefined) app.allowed_apis = parsed.data.allowed_apis;
  await app.save();

  await writeAuditLog({
    actor: auth.subject.sub,
    action: "application.update",
    detail: { application_id: app._id.toString(), changes: parsed.data },
    req,
  });

  return NextResponse.json({ application: app });
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = requireDeveloper(req);
  if (!auth.ok) return auth.response;

  await connectDB();
  const app = await Application.findById(params.id);
  if (!app) {
    return NextResponse.json({ error: "not_found", detail: "Application does not exist" }, { status: 404 });
  }
  if (app.owner.toString() !== auth.subject.sub) {
    return NextResponse.json({ error: "forbidden", detail: "You do not own this application" }, { status: 403 });
  }
  return NextResponse.json({ application: app });
}
