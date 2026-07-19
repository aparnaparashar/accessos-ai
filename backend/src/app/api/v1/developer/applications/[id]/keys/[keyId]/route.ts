import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/lib/models/Application";
import ApiKey from "@/lib/models/ApiKey";
import { writeAuditLog } from "@/lib/models/AuditLog";
import { requireDeveloper } from "@/lib/requireDeveloper";

/**
 * DELETE /v1/developer/applications/:id/keys/:keyId — revokes a key
 * (sets revoked: true; keys are never hard-deleted so audit history and
 * usage logs referencing them stay intact). Section 10/12.
 */
export async function DELETE(req: Request, { params }: { params: { id: string; keyId: string } }) {
  const auth = requireDeveloper(req);
  if (!auth.ok) return auth.response;

  await connectDB();
  const app = await Application.findById(params.id);
  if (!app) return NextResponse.json({ error: "not_found", detail: "Application does not exist" }, { status: 404 });
  if (app.owner.toString() !== auth.subject.sub) {
    return NextResponse.json({ error: "forbidden", detail: "You do not own this application" }, { status: 403 });
  }

  const apiKey = await ApiKey.findOne({ _id: params.keyId, application: app._id });
  if (!apiKey) return NextResponse.json({ error: "not_found", detail: "Key does not exist" }, { status: 404 });

  apiKey.revoked = true;
  await apiKey.save();

  await writeAuditLog({
    actor: auth.subject.sub,
    action: "key.revoke",
    detail: { application_id: app._id.toString(), key_id: apiKey._id.toString() },
    req,
  });

  return NextResponse.json({ key_id: apiKey._id, revoked: true });
}
