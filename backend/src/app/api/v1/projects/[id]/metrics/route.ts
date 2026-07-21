import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/models/Project";
import RequestLog from "@/lib/models/RequestLog";
import ApiKey from "@/lib/models/ApiKey";
import { requireAuth } from "@/lib/requireAuth";

/**
 * GET /projects/:id/metrics — Aggregate metrics for a project:
 *   - requests_today
 *   - weekly_requests
 *   - monthly_requests
 *   - success_rate
 *   - error_rate
 *   - average_latency_ms
 *   - top_endpoints
 *   - rate_limit_usage
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.response;

  await connectDB();
  const project = await Project.findOne({ _id: params.id, owner: auth.subject.sub });
  if (!project) {
    return NextResponse.json({ error: "not_found", detail: "Project does not exist" }, { status: 404 });
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [requestsToday, requestsWeekly, requestsMonthly, totals, topEndpoints, activeKeys] = await Promise.all([
    RequestLog.countDocuments({ project: project._id, createdAt: { $gte: startOfDay } }),
    RequestLog.countDocuments({ project: project._id, createdAt: { $gte: startOfWeek } }),
    RequestLog.countDocuments({ project: project._id, createdAt: { $gte: startOfMonth } }),
    RequestLog.aggregate([
      { $match: { project: project._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgLatency: { $avg: "$latency_ms" },
          successes: { $sum: { $cond: [{ $lt: ["$status_code", 400] }, 1, 0] } },
          errors: { $sum: { $cond: [{ $gte: ["$status_code", 400] }, 1, 0] } },
        },
      },
    ]),
    RequestLog.aggregate([
      { $match: { project: project._id } },
      { $group: { _id: "$endpoint", count: { $sum: 1 }, avgLatency: { $avg: "$latency_ms" } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    ApiKey.countDocuments({ project: project._id, revoked: false }),
  ]);

  const summary = totals[0] || { total: 0, avgLatency: 0, successes: 0, errors: 0 };
  const dailyLimit = Number(process.env.DAILY_RATE_LIMIT || 1000);

  return NextResponse.json({
    metrics: {
      requests_today: requestsToday,
      weekly_requests: requestsWeekly,
      monthly_requests: requestsMonthly,
      total_requests: summary.total,
      success_rate: summary.total > 0 ? Number((summary.successes / summary.total).toFixed(4)) : 1.0,
      error_rate: summary.total > 0 ? Number((summary.errors / summary.total).toFixed(4)) : 0.0,
      average_latency_ms: Math.round(summary.avgLatency || 0),
      top_endpoints: topEndpoints.map((e) => ({
        endpoint: e._id,
        requests: e.count,
        avg_latency_ms: Math.round(e.avgLatency),
      })),
      rate_limit_usage: {
        daily_limit: dailyLimit,
        used_today: requestsToday,
        remaining_today: Math.max(0, dailyLimit - requestsToday),
      },
      api_key_count: activeKeys,
    },
  });
}
