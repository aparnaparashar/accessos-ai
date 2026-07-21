import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/models/Project";
import ApiKey from "@/lib/models/ApiKey";
import { requireAuth } from "@/lib/requireAuth";
import { generateKeyPair, hashSecret } from "@/lib/keys";

/**
 * POST /projects/:id/api-keys/:keyId/rotate — Rotate an API key secret (keeps same client_id).
 */
export async function POST(req: Request, { params }: { params: { id: string; keyId: string } }) {
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
  if (apiKey.revoked) {
    return NextResponse.json({ error: "key_revoked", detail: "Cannot rotate a revoked key" }, { status: 409 });
  }

  const { secretKey } = generateKeyPair(apiKey.client_id);
  apiKey.secret_hash = await hashSecret(secretKey);
  await apiKey.save();

  return NextResponse.json({
    key_id: apiKey._id,
    client_id: apiKey.client_id,
    secret_key: secretKey,
    warning: "This secret key is shown only once and cannot be retrieved again. Store it securely now.",
  });
}
