/**
 * Illustrative vendor pricing table (Section 10/12 billing).
 *
 * These numbers are placeholders, not live vendor rates. They exist so
 * GET /v1/billing/usage can show a directionally useful "estimated charge"
 * rather than nothing — same caveat as the Pricing page's own "What
 * actually drives your real cost" note: real cost depends on which vision/
 * text/speech vendor is configured, image sizes, and audio duration, none
 * of which this table tracks precisely.
 */
export const VENDOR_PRICING = {
  // Illustrative — per API call, in USD, at "free/starter" volume tiers.
  ocr: { unit: "call", rate_usd: 0, note: "Local Tesseract OCR — no vendor cost." },
  "accessibility.assist": {
    unit: "call",
    rate_usd: 0.004,
    note: "Illustrative blended per-call estimate; real cost depends on configured vision/text/audio vendor.",
  },
} as const;

export type BillableApi = keyof typeof VENDOR_PRICING;

export function isBillableApi(api: string): api is BillableApi {
  return api in VENDOR_PRICING;
}

export function estimateCharge(api: string, calls: number): number {
  if (!isBillableApi(api)) return 0;
  return Number((VENDOR_PRICING[api].rate_usd * calls).toFixed(4));
}
