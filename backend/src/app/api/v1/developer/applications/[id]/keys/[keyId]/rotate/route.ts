import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/lib/models/Application";
import ApiKey from "@/lib/models/ApiKey";
import { writeAuditLog } from "@/lib/models/AuditLog";
import { requireDeveloper } from "@/lib/requireDeveloper";
import { generateKeyPair, hashSecret } from "@/lib/keys";

/**
 * POST /v1/developer/applications/:id/keys/:keyId/rotate — issues a new
 * secret for the existing client_id, invalidates the old secret, and
 * returns the new plaintext exactly once. Section 10/12.
 */
export async function POST(req: Request, { params }: { params: { id: string; keyId: string } }) {
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
  if (apiKey.revoked) {
    return NextResponse.json({ error: "key_revoked", detail: "Cannot rotate a revoked key" }, { status: 409 });
  }

  const { secretKey } = generateKeyPair(apiKey.client_id); // keep the same client_id, rotate only the secret
  apiKey.secret_hash = await hashSecret(secretKey);
  await apiKey.save();

  await writeAuditLog({
    actor: auth.subject.sub,
    action: "key.rotate",
    detail: { application_id: app._id.toString(), key_id: apiKey._id.toString() },
    req,
  });

  return NextResponse.json({
    key_id: apiKey._id,
    client_id: apiKey.client_id,
    secret_key: secretKey,
    warning: "This secret key is shown only once and cannot be retrieved again. Store it securely now.",
  });
}
