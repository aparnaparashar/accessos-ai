import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/lib/models/Application";
import ApiKey from "@/lib/models/ApiKey";
import { writeAuditLog } from "@/lib/models/AuditLog";
import { requireDeveloper } from "@/lib/requireDeveloper";
import { generateKeyPair, hashSecret } from "@/lib/keys";

/**
 * POST /v1/developer/applications/:id/keys — generate a new key pair for
 * the application. The plaintext secret is returned exactly once in this
 * response body and is never stored or logged again. Section 10/12.
 *
 * GET /v1/developer/applications/:id/keys — list key metadata (no secrets)
 * for the developer portal's key-management UI.
 */
async function loadOwnedApplication(id: string, ownerId: string) {
  const app = await Application.findById(id);
  if (!app) return { error: NextResponse.json({ error: "not_found", detail: "Application does not exist" }, { status: 404 }) };
  if (app.owner.toString() !== ownerId) {
    return { error: NextResponse.json({ error: "forbidden", detail: "You do not own this application" }, { status: 403 }) };
  }
  return { app };
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = requireDeveloper(req);
  if (!auth.ok) return auth.response;

  await connectDB();
  const { app, error } = await loadOwnedApplication(params.id, auth.subject.sub);
  if (error) return error;

  const { clientId, secretKey } = generateKeyPair();
  const secret_hash = await hashSecret(secretKey);
  const apiKey = await ApiKey.create({ application: app!._id, client_id: clientId, secret_hash });

  await writeAuditLog({
    actor: auth.subject.sub,
    action: "key.generate",
    detail: { application_id: app!._id.toString(), key_id: apiKey._id.toString(), client_id: clientId },
    req,
  });

  return NextResponse.json(
    {
      key_id: apiKey._id,
      client_id: clientId,
      secret_key: secretKey, // shown once — caller must store this now
      warning: "This secret key is shown only once and cannot be retrieved again. Store it securely now.",
    },
    { status: 201 }
  );
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = requireDeveloper(req);
  if (!auth.ok) return auth.response;

  await connectDB();
  const { app, error } = await loadOwnedApplication(params.id, auth.subject.sub);
  if (error) return error;

  const keys = await ApiKey.find({ application: app!._id }).select("-secret_hash").sort({ createdAt: -1 });
  return NextResponse.json({ keys });
}
