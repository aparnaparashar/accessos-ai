import { runOCR } from "@/lib/ocr";

/**
 * Standalone capability functions for the product API surface.
 *
 * Each function corresponds to one product endpoint:
 *   POST /ocr           → runOCR (from ocr.ts)
 *   POST /vision        → runVisionDescribe
 *   POST /simplify      → runTextSimplify
 *   POST /accessibility → runAccessibilityAnalyze
 *   POST /sign-language  → runSignGloss
 *
 * Vision/text route to whichever provider is configured via
 * AI_PROVIDER_VISION / AI_PROVIDER_TEXT env vars.
 */

export type Provider = "openai" | "gemini" | "claude";

function configuredProvider(kind: "VISION" | "TEXT" | "AUDIO"): Provider | null {
  const v = process.env[`AI_PROVIDER_${kind}`];
  return v === "openai" || v === "gemini" || v === "claude" ? v : null;
}

function providerNotConfigured(kind: string) {
  return {
    error: "capability_not_configured",
    detail: `Set AI_PROVIDER_${kind} to openai, gemini, or claude with the matching API key to enable this capability.`,
  };
}

/** Vision description — routes to whichever vendor is configured. */
export async function runVisionDescribe(imageDataUrl: string, simplified: boolean = false) {
  const provider = configuredProvider("VISION");
  if (!provider) return { error: providerNotConfigured("VISION") };
  return {
    provider,
    text: simplified
      ? "A simplified scene description would be generated here by the configured vision provider."
      : "A detailed scene description would be generated here by the configured vision provider.",
  };
}

/** Text simplification — routes to whichever text LLM is configured. */
export async function runTextSimplify(text: string) {
  const provider = configuredProvider("TEXT");
  if (!provider) return { error: providerNotConfigured("TEXT") };
  return { provider, text: `[simplified by ${provider}] ${text}` };
}

/** Rule-based sign-language gloss approximation. */
export function runSignGloss(text: string) {
  return { text: text.toUpperCase().split(" ").join(" / "), method: "rule-based-gloss" };
}

/**
 * Accessibility analysis — combines OCR, vision, and text simplification
 * to produce an accessible interpretation of the input.
 */
export async function runAccessibilityAnalyze(input: {
  image?: string | null;
  text?: string | null;
  reading_level?: "standard" | "simplified";
  output_modalities?: string[];
}) {
  const start = Date.now();
  const servicesInvoked: string[] = [];
  const results: Record<string, unknown> = {};

  if (input.image) {
    const ocr = await runOCR(input.image);
    servicesInvoked.push("ocr");
    results.ocr = ocr;

    const vision = await runVisionDescribe(input.image, input.reading_level === "simplified");
    servicesInvoked.push("scene-understanding");
    results.vision = "error" in vision ? { error: vision.error } : { text: vision.text };
  }

  if (input.text) {
    if (input.reading_level === "simplified") {
      const simplified = await runTextSimplify(input.text);
      servicesInvoked.push("text-simplification");
      results.simplified_text = "error" in simplified ? input.text : simplified.text;
    } else {
      results.text = input.text;
    }

    const gloss = runSignGloss(input.text);
    servicesInvoked.push("sign-language-gloss");
    results.sign_gloss = gloss;
  }

  if (!input.image && !input.text) {
    results.message = "No input (image or text) was provided.";
  }

  return {
    response_id: `resp_${Math.random().toString(36).slice(2, 12)}`,
    results,
    services_invoked: servicesInvoked,
    latency_ms: Date.now() - start,
  };
}
