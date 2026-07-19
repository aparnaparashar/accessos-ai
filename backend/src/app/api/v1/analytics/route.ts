import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/lib/models/Application";
import UsageLog from "@/lib/models/UsageLog";
import { requireDeveloper } from "@/lib/requireDeveloper";

/**
 * GET /v1/analytics — aggregates the caller's own UsageLog rows across all
 * of their Applications: total calls, calls by API, average latency,
 * success rate, and calls-per-day for the last 30 days. Section 10.
 * Uses Mongo aggregation pipelines rather than application-level loops.
 */
export async function GET(req: Request) {
  const auth = requireDeveloper(req);
  if (!auth.ok) return auth.response;

  await connectDB();
  const apps = await Application.find({ owner: auth.subject.sub }).select("_id");
  const appIds = apps.map((a) => a._id);

  if (appIds.length === 0) {
    return NextResponse.json({
      total_calls: 0,
      calls_by_api: [],
      average_latency_ms: 0,
      success_rate: null,
      calls_per_day: [],
    });
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totals] = await UsageLog.aggregate([
    { $match: { application: { $in: appIds } } },
    {
      $group: {
        _id: null,
        total_calls: { $sum: 1 },
        average_latency_ms: { $avg: "$latency_ms" },
        success_count: { $sum: { $cond: [{ $lt: ["$status_code", 400] }, 1, 0] } },
      },
    },
  ]);

  const callsByApi = await UsageLog.aggregate([
    { $match: { application: { $in: appIds } } },
    { $group: { _id: "$api", calls: { $sum: 1 }, average_latency_ms: { $avg: "$latency_ms" } } },
    { $sort: { calls: -1 } },
  ]);

  const callsPerDay = await UsageLog.aggregate([
    { $match: { application: { $in: appIds }, createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        calls: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return NextResponse.json({
    total_calls: totals?.total_calls || 0,
    calls_by_api: callsByApi.map((r) => ({ api: r._id, calls: r.calls, average_latency_ms: Math.round(r.average_latency_ms) })),
    average_latency_ms: totals ? Math.round(totals.average_latency_ms) : 0,
    success_rate: totals ? Number((totals.success_count / totals.total_calls).toFixed(4)) : null,
    calls_per_day: callsPerDay.map((r) => ({ date: r._id, calls: r.calls })),
  });
}
