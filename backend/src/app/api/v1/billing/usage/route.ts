import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/lib/models/Application";
import UsageLog from "@/lib/models/UsageLog";
import { requireDeveloper } from "@/lib/requireDeveloper";
import { estimateCharge, VENDOR_PRICING } from "@/lib/vendorPricing";

/**
 * GET /v1/billing/usage — sums usage per API for the current billing period
 * (calendar month) across the caller's Applications and computes an
 * *estimated* charge from lib/vendorPricing.ts. Section 10/12.
 *
 * These figures are illustrative, not a real invoice — see the "note" field
 * per line item and the top-level disclaimer, matching the Pricing page's
 * own "what actually drives your real cost" caveat.
 */
export async function GET(req: Request) {
  const auth = requireDeveloper(req);
  if (!auth.ok) return auth.response;

  await connectDB();
  const apps = await Application.find({ owner: auth.subject.sub }).select("_id");
  const appIds = apps.map((a) => a._id);

  const periodStart = new Date();
  periodStart.setUTCDate(1);
  periodStart.setUTCHours(0, 0, 0, 0);

  const rows =
    appIds.length === 0
      ? []
      : await UsageLog.aggregate([
          { $match: { application: { $in: appIds }, createdAt: { $gte: periodStart } } },
          { $group: { _id: "$api", calls: { $sum: 1 } } },
        ]);

  const line_items = rows.map((r) => ({
    api: r._id,
    calls: r.calls,
    unit: (VENDOR_PRICING as any)[r._id]?.unit || "call",
    estimated_charge_usd: estimateCharge(r._id, r.calls),
    note: (VENDOR_PRICING as any)[r._id]?.note || "No pricing configured for this API.",
  }));

  const estimated_total_usd = Number(line_items.reduce((sum, r) => sum + r.estimated_charge_usd, 0).toFixed(4));

  return NextResponse.json({
    billing_period_start: periodStart.toISOString(),
    line_items,
    estimated_total_usd,
    disclaimer:
      "These figures are illustrative estimates based on placeholder per-call rates, not a real invoice. " +
      "Actual cost depends on which vision/text/audio vendor is configured, image sizes, and audio duration.",
  });
}
