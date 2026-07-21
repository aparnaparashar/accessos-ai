import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/models/Project";
import { requireAuth } from "@/lib/requireAuth";
import { createProjectSchema, parseJsonBody } from "@/lib/validation";

/**
 * GET  /projects — List all projects owned by the authenticated developer.
 * POST /projects — Create a new project.
 */
export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  await connectDB();
  const projects = await Project.find({ owner: auth.subject.sub, status: { $ne: "archived" } }).sort({ createdAt: -1 });
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  const parsed = await parseJsonBody(req, createProjectSchema);
  if (!parsed.ok) return parsed.response;

  await connectDB();
  const project = await Project.create({
    owner: auth.subject.sub,
    name: parsed.data.name,
    description: parsed.data.description || "",
    environment: parsed.data.environment || "development",
  });

  return NextResponse.json({ project }, { status: 201 });
}
