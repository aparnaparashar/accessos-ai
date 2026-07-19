/**
 * Shared plan → daily quota table (Section 11).
 * Used by both the JWT-authenticated /v1/accessibility/assist route and the
 * API-key-authenticated developer product routes so the two auth paths never
 * drift out of sync on limits.
 */
export type PlanName = "free" | "starter" | "pro";

export const PLAN_DAILY_LIMITS: Record<PlanName, number> = {
  free: Number(process.env.RATE_LIMIT_FREE_PER_DAY || 100),
  starter: Number(process.env.RATE_LIMIT_STARTER_PER_DAY || 10000),
  pro: Number(process.env.RATE_LIMIT_PRO_PER_DAY || 500000),
};

export function isPlanName(value: unknown): value is PlanName {
  return value === "free" || value === "starter" || value === "pro";
}

export function planDailyLimit(plan: string): number {
  return isPlanName(plan) ? PLAN_DAILY_LIMITS[plan] : PLAN_DAILY_LIMITS.free;
}
