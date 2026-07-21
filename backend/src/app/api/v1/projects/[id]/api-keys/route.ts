import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/models/Project";
import ApiKey from "@/lib/models/ApiKey";
import { requireAuth } from "@/lib/requireAuth";
import { generateKeyPair, hashSecret } from "@/lib/keys";
import { createApiKeySchema, parseJsonBody } from "@/lib/validation";

/**
 * GET  /projects/:id/api-keys — List all API keys for a project (without plaintext secrets).
 * POST /projects/:id/api-keys — Create a new API key pair for a project. Returns secret ONCE.
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  await connectDB();
  const project = await Project.findOne({ _id: params.id, owner: auth.subject.sub });
  if (!project) {
    return NextResponse.json({ error: "not_found", detail: "Project does not exist" }, { status: 404 });
  }

  const keys = await ApiKey.find({ project: project._id }).select("-secret_hash").sort({ createdAt: -1 });
  return NextResponse.json({ keys });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  const parsed = await parseJsonBody(req, createApiKeySchema);
  if (!parsed.ok) return parsed.response;

  await connectDB();
  const project = await Project.findOne({ _id: params.id, owner: auth.subject.sub });
  if (!project) {
    return NextResponse.json({ error: "not_found", detail: "Project does not exist" }, { status: 404 });
  }

  const { clientId, secretKey } = generateKeyPair();
  const secret_hash = await hashSecret(secretKey);

  const apiKey = await ApiKey.create({
    project: project._id,
    name: parsed.data.name || "Default Key",
    client_id: clientId,
    secret_hash,
    environment: parsed.data.environment || "development",
  });

  return NextResponse.json(
    {
      key_id: apiKey._id,
      name: apiKey.name,
      client_id: clientId,
      secret_key: secretKey,
      environment: apiKey.environment,
      warning: "This secret key is shown only once and cannot be retrieved again. Store it securely now.",
    },
    { status: 201 }
  );
}
