import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/models/Project";
import ApiKey from "@/lib/models/ApiKey";
import { requireAuth } from "@/lib/requireAuth";
import { updateProjectSchema, parseJsonBody } from "@/lib/validation";

/**
 * GET    /projects/:id — Get details for a specific project.
 * PUT    /projects/:id — Update a project's name, description, environment, or status.
 * DELETE /projects/:id — Delete (archive) a project and revoke all associated API keys.
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  await connectDB();
  const project = await Project.findOne({ _id: params.id, owner: auth.subject.sub });
  if (!project) {
    return NextResponse.json({ error: "not_found", detail: "Project does not exist" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  const parsed = await parseJsonBody(req, updateProjectSchema);
  if (!parsed.ok) return parsed.response;

  await connectDB();
  const project = await Project.findOne({ _id: params.id, owner: auth.subject.sub });
  if (!project) {
    return NextResponse.json({ error: "not_found", detail: "Project does not exist" }, { status: 404 });
  }

  if (parsed.data.name !== undefined) project.name = parsed.data.name;
  if (parsed.data.description !== undefined) project.description = parsed.data.description;
  if (parsed.data.environment !== undefined) project.environment = parsed.data.environment;
  if (parsed.data.status !== undefined) project.status = parsed.data.status;

  await project.save();

  return NextResponse.json({ project });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  await connectDB();
  const project = await Project.findOne({ _id: params.id, owner: auth.subject.sub });
  if (!project) {
    return NextResponse.json({ error: "not_found", detail: "Project does not exist" }, { status: 404 });
  }

  project.status = "archived";
  await project.save();

  // Revoke all API keys belonging to this project
  await ApiKey.updateMany({ project: project._id }, { revoked: true });

  return NextResponse.json({ message: "Project deleted successfully", id: project._id });
}
