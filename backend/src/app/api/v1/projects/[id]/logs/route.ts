import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/models/Project";
import RequestLog from "@/lib/models/RequestLog";
import { requireAuth } from "@/lib/requireAuth";

/**
 * GET /projects/:id/logs — List request logs for a project with optional filters and pagination.
 * Filters supported via query params:
 *   - endpoint: filter by endpoint name (e.g. /v1/ocr)
 *   - status: filter by status code (e.g. 200, 400, 429, 500)
 *   - date_from, date_to: ISO date strings
 *   - page, page_size: pagination
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  await connectDB();
  const project = await Project.findOne({ _id: params.id, owner: auth.subject.sub });
  if (!project) {
    return NextResponse.json({ error: "not_found", detail: "Project does not exist" }, { status: 404 });
  }

  const url = new URL(req.url);
  const endpoint = url.searchParams.get("endpoint");
  const status = url.searchParams.get("status");
  const dateFrom = url.searchParams.get("date_from");
  const dateTo = url.searchParams.get("date_to");
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get("page_size") || 20)));

  const filter: Record<string, unknown> = { project: project._id };

  if (endpoint) filter.endpoint = endpoint;
  if (status) filter.status_code = Number(status);

  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) (filter.createdAt as Record<string, unknown>).$gte = new Date(dateFrom);
    if (dateTo) (filter.createdAt as Record<string, unknown>).$lte = new Date(dateTo);
  }

  const [total, logs] = await Promise.all([
    RequestLog.countDocuments(filter),
    RequestLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate("api_key", "name client_id environment"),
  ]);

  return NextResponse.json({
    logs,
    page,
    page_size: pageSize,
    total,
    total_pages: Math.max(1, Math.ceil(total / pageSize)),
  });
}
