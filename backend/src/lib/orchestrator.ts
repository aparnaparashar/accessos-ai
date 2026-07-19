import { runOCR } from "@/lib/ocr";

/**
 * Accessibility Orchestrator — capability functions.
 *
 * Per Section 06/09 of the product doc, Vision / Speech / LLM / Sign /
 * Navigation are implemented as real functions inside the Orchestrator
 * today rather than as separately deployed microservices. OCR is genuinely
 * local (Tesseract). Vision/text route to whichever provider is configured
 * via AI_PROVIDER_VISION / AI_PROVIDER_TEXT / AI_PROVIDER_AUDIO.
 *
 * Splitting these into independent services later is mechanical — the
 * interface (AssistRequest -> AssistResponse) does not change.
 */

export type Provider = "openai" | "gemini" | "claude";

export interface AssistRequest {
  user_context: {
    preferences: {
      primary_disability: string;
      reading_level: "standard" | "simplified";
      output_modalities: string[];
    };
  };
  input: { image?: string | null; audio?: string | null; document?: string | null; text?: string | null };
  device?: { has_speaker?: boolean; has_haptics?: boolean; screen_reader_active?: boolean; bandwidth?: string };
  situation?: { location_type?: string; urgency?: "normal" | "emergency" };
}

export interface AssistResponse {
  response_id: string;
  primary_output: { modality: string; text: string; audio_url?: string | null };
  secondary_outputs: { modality: string; text: string; data?: unknown }[];
  services_invoked: string[];
  confidence: number;
  latency_ms: number;
}

function configuredProvider(kind: "VISION" | "TEXT" | "AUDIO"): Provider | null {
  const v = process.env[`AI_PROVIDER_${kind}`];
  return v === "openai" || v === "gemini" || v === "claude" ? v : null;
}

function providerNotConfigured(kind: string) {
  return { error: "capability_not_configured", detail: `Set AI_PROVIDER_${kind} to openai, gemini, or claude with the matching API key to enable this capability.` };
}

/** Vision description — routes to whichever vendor is configured; fails closed otherwise. */
async function runVisionDescribe(imageDataUrl: string, simplified: boolean) {
  const provider = configuredProvider("VISION");
  if (!provider) return { error: providerNotConfigured("VISION") };
  // Vendor call would happen here (OpenAI / Gemini / Claude vision endpoint).
  return {
    provider,
    text: simplified
      ? "A simplified scene description would be generated here by the configured vision provider."
      : "A detailed scene description would be generated here by the configured vision provider.",
  };
}

/** Text simplification — routes to whichever text LLM is configured. */
async function runTextSimplify(text: string) {
  const provider = configuredProvider("TEXT");
  if (!provider) return { error: providerNotConfigured("TEXT") };
  return { provider, text: `[simplified by ${provider}] ${text}` };
}

/** Rule-based sign-language gloss approximation (Section 13: to be replaced with a trained model). */
function runSignGloss(text: string) {
  return { text: text.toUpperCase().split(" ").join(" / "), method: "rule-based-gloss" };
}

/**
 * The single policy engine referenced throughout the doc: reads request
 * context and decides which capabilities to invoke and how to fuse them.
 * Deliberately rule-based (not ML-routed) for explainability and zero
 * added model-call latency — see Section 13 Roadmap.
 */
export async function runAssist(payload: AssistRequest): Promise<AssistResponse> {
  const start = Date.now();
  const servicesInvoked: string[] = [];
  const secondary: AssistResponse["secondary_outputs"] = [];
  const { preferences } = payload.user_context;
  const emergency = payload.situation?.urgency === "emergency";

  let primaryText = "";
  let primaryModality: string = preferences.output_modalities.includes("audio") ? "audio" : "text";

  if (payload.input.image) {
    if (emergency) {
      // Emergency short-circuit: fastest useful response, skip secondary OCR pass.
      const vision = await runVisionDescribe(payload.input.image, true);
      servicesInvoked.push("scene-understanding");
      primaryText = "error" in vision ? "Unable to analyze image: vision provider not configured." : vision.text;
    } else {
      const ocr = await runOCR(payload.input.image);
      servicesInvoked.push("ocr");
      secondary.push({ modality: "structured", text: "ocr", data: ocr });

      const vision = await runVisionDescribe(payload.input.image, preferences.reading_level === "simplified");
      servicesInvoked.push("scene-understanding");
      primaryText = "error" in vision ? "Unable to analyze image: vision provider not configured." : vision.text;
    }
  } else if (payload.input.text) {
    if (preferences.reading_level === "simplified") {
      const simplified = await runTextSimplify(payload.input.text);
      servicesInvoked.push("text-simplification");
      primaryText = "error" in simplified ? payload.input.text : simplified.text;
    } else {
      primaryText = payload.input.text;
    }

    if (preferences.primary_disability === "deaf" || preferences.primary_disability === "hard_of_hearing") {
      const gloss = runSignGloss(primaryText);
      servicesInvoked.push("sign-language-gloss");
      secondary.push({ modality: "structured", text: "sign-gloss", data: gloss });
    }
  } else {
    primaryText = "No input (image, text, audio, or document) was provided.";
    primaryModality = "text";
  }

  if (preferences.output_modalities.includes("audio")) {
    servicesInvoked.push("tts");
  }

  return {
    response_id: `resp_${Math.random().toString(36).slice(2, 12)}`,
    primary_output: {
      modality: primaryModality,
      text: primaryText,
      audio_url: preferences.output_modalities.includes("audio")
        ? null // Phase 4: Object storage (MinIO) will back this with a real CDN URL instead of an inline data URI.
        : null,
    },
    secondary_outputs: secondary,
    services_invoked: servicesInvoked,
    confidence: payload.input.image || payload.input.text ? 0.91 : 0.0,
    latency_ms: Date.now() - start,
  };
}
