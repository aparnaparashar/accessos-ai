import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/models/Project";
import ApiKey from "@/lib/models/ApiKey";
import { requireAuth } from "@/lib/requireAuth";

/**
 * DELETE /projects/:id/api-keys/:keyId — Revoke an API key.
 */
export async function DELETE(req: Request, { params }: { params: { id: string; keyId: string } }) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  await connectDB();
  const project = await Project.findOne({ _id: params.id, owner: auth.subject.sub });
  if (!project) {
    return NextResponse.json({ error: "not_found", detail: "Project does not exist" }, { status: 404 });
  }

  const apiKey = await ApiKey.findOne({ _id: params.keyId, project: project._id });
  if (!apiKey) {
    return NextResponse.json({ error: "not_found", detail: "API key does not exist" }, { status: 404 });
  }

  apiKey.revoked = true;
  await apiKey.save();

  return NextResponse.json({ key_id: apiKey._id, revoked: true });
}
