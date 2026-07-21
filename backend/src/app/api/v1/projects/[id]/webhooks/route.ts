import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Project from "@/lib/models/Project";
import Webhook from "@/lib/models/Webhook";
import { requireAuth } from "@/lib/requireAuth";
import { createWebhookSchema, parseJsonBody } from "@/lib/validation";

/**
 * GET  /projects/:id/webhooks — List webhooks for a project.
 * POST /projects/:id/webhooks — Create a new webhook for a project.
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  await connectDB();
  const project = await Project.findOne({ _id: params.id, owner: auth.subject.sub });
  if (!project) {
    return NextResponse.json({ error: "not_found", detail: "Project does not exist" }, { status: 404 });
  }

  const webhooks = await Webhook.find({ project: project._id }).sort({ createdAt: -1 });
  return NextResponse.json({ webhooks });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  const parsed = await parseJsonBody(req, createWebhookSchema);
  if (!parsed.ok) return parsed.response;

  await connectDB();
  const project = await Project.findOne({ _id: params.id, owner: auth.subject.sub });
  if (!project) {
    return NextResponse.json({ error: "not_found", detail: "Project does not exist" }, { status: 404 });
  }

  const secret = `whsec_${crypto.randomBytes(24).toString("hex")}`;
  const webhook = await Webhook.create({
    project: project._id,
    url: parsed.data.url,
    secret,
    events: parsed.data.events || ["request.completed", "request.failed"],
    enabled: parsed.data.enabled ?? true,
    retry_policy: parsed.data.retry_policy || { max_retries: 3, retry_interval_seconds: 60 },
  });

  return NextResponse.json({ webhook }, { status: 201 });
}
