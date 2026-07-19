import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AuditLog from "@/lib/models/AuditLog";
import { requireDeveloper } from "@/lib/requireDeveloper";

/**
 * GET /v1/audit?page=1&page_size=20 — paginated list of the caller's own
 * AuditLog rows (application/key create/update/rotate/revoke). Section 10.
 */
export async function GET(req: Request) {
  const auth = requireDeveloper(req);
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get("page_size") || 20)));

  await connectDB();
  const filter = { actor: auth.subject.sub };
  const [total, entries] = await Promise.all([
    AuditLog.countDocuments(filter),
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize),
  ]);

  return NextResponse.json({
    entries,
    page,
    page_size: pageSize,
    total,
    total_pages: Math.max(1, Math.ceil(total / pageSize)),
  });
}
