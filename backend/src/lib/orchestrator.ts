/**
 * AI Orchestrator — routes each capability to the configured provider.
 * Provider priority: env-configured → next available with a key → error.
 *
 * Supported providers: openai, gemini
 * Env vars: AI_PROVIDER_VISION, AI_PROVIDER_TEXT, OPENAI_API_KEY, GEMINI_API_KEY
 */

export { runOCR } from "@/lib/ocr";

export type Provider = "openai" | "gemini";

// ── Provider resolution ───────────────────────────────────────────────────

function preferredProvider(kind: "VISION" | "TEXT" | "AUDIO"): Provider | null {
  const v = process.env[`AI_PROVIDER_${kind}`]?.toLowerCase();
  if (v === "openai" && process.env.OPENAI_API_KEY) return "openai";
  if (v === "gemini" && process.env.GEMINI_API_KEY) return "gemini";
  return null;
}

function fallbackProvider(preferred: Provider | null): Provider | null {
  if (preferred === "openai" && process.env.GEMINI_API_KEY) return "gemini";
  if (preferred === "gemini" && process.env.OPENAI_API_KEY) return "openai";
  if (!preferred) {
    if (process.env.OPENAI_API_KEY) return "openai";
    if (process.env.GEMINI_API_KEY) return "gemini";
  }
  return null;
}

function resolveProvider(kind: "VISION" | "TEXT" | "AUDIO"): Provider {
  const pref = preferredProvider(kind);
  if (pref) return pref;
  const fallback = fallbackProvider(pref);
  if (fallback) return fallback;
  throw new Error(
    `No AI provider configured for ${kind}. Set OPENAI_API_KEY or GEMINI_API_KEY.`
  );
}

// ── OpenAI helpers ────────────────────────────────────────────────────────

async function openaiChat(
  messages: Array<{ role: string; content: string | Array<{type: string; [key: string]: unknown}> }>,
  model = "gpt-4o-mini"
): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model, messages, max_tokens: 1024 }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.choices[0].message.content as string;
}

// ── Gemini helpers ────────────────────────────────────────────────────────

async function geminiGenerate(
  prompt: string,
  imagePart?: { inlineData?: { mimeType: string; data: string }; fileUri?: string }
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const parts: Array<{text?: string; inlineData?: {mimeType: string; data: string}}> = [];
  if (imagePart?.inlineData) parts.push({ inlineData: imagePart.inlineData });
  parts.push({ text: prompt });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts }] }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

// ── Image normalisation ───────────────────────────────────────────────────

/** Returns { base64, mimeType } from a data URL or fetches a remote URL. */
async function fetchImageAsBase64(imageInput: string): Promise<{ base64: string; mimeType: string }> {
  if (imageInput.startsWith("data:")) {
    const [header, base64] = imageInput.split(",");
    const mimeType = header.replace("data:", "").replace(";base64", "");
    return { base64, mimeType };
  }
  // Remote URL — fetch and convert
  let targetUrl = imageInput;
  let res = await fetch(targetUrl);
  if (!res.ok) throw new Error(`Could not fetch image: ${res.status}`);
  let contentType = res.headers.get("content-type") ?? "image/jpeg";

  // If user passed an HTML page URL (e.g. Alamy web page), extract the direct og:image meta link
  if (contentType.includes("text/html")) {
    const htmlText = await res.text();
    const ogMatch = htmlText.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                    htmlText.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (ogMatch && ogMatch[1]) {
      targetUrl = ogMatch[1];
      res = await fetch(targetUrl);
      if (!res.ok) throw new Error(`Could not fetch resolved image from HTML: ${res.status}`);
      contentType = res.headers.get("content-type") ?? "image/jpeg";
    }
  }

  const mimeType = contentType.split(";")[0].trim();
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  return { base64, mimeType };
}

// ── Vision Description ────────────────────────────────────────────────────

export async function runVisionDescribe(
  imageInput: string,
  simplified = false
): Promise<{
  provider: Provider;
  description: string;
  alt_text: string;
  tags: string[];
  simplified: boolean;
} | { error: { detail: string; code: string } }> {
  try {
    const provider = resolveProvider("VISION");
    const prompt = simplified
      ? "Describe this image in simple, clear language a child could understand. Then provide a short alt text (1 sentence). Finally list 5 relevant tags as comma-separated words."
      : "Provide a detailed scene description of this image suitable for a blind user. Then provide concise alt text (1 sentence). Finally list 5 relevant tags as comma-separated words. Format: DESCRIPTION: ... ALT: ... TAGS: ...";

    let raw: string;

    if (provider === "openai") {
      const { base64, mimeType } = await fetchImageAsBase64(imageInput);
      raw = await openaiChat([
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}`, detail: "auto" } },
            { type: "text", text: prompt },
          ],
        },
      ]);
    } else {
      const { base64, mimeType } = await fetchImageAsBase64(imageInput);
      raw = await geminiGenerate(prompt, { inlineData: { mimeType, data: base64 } });
    }

    // Parse structured sections
    const descMatch = raw.match(/DESCRIPTION:\s*([\s\S]*?)(?=ALT:|TAGS:|$)/i);
    const altMatch = raw.match(/ALT:\s*([\s\S]*?)(?=TAGS:|$)/i);
    const tagsMatch = raw.match(/TAGS:\s*([\s\S]*?)$/i);

    const description = (descMatch?.[1] ?? raw).trim();
    const alt_text = (altMatch?.[1] ?? description.split(".")[0]).trim();
    const tags = tagsMatch?.[1]
      ? tagsMatch[1].split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5)
      : [];

    return { provider, description, alt_text, tags, simplified };
  } catch (err) {
    return { error: { code: "provider_error", detail: (err as Error).message } };
  }
}

// ── Text Simplification ───────────────────────────────────────────────────

export async function runTextSimplify(text: string): Promise<
  { provider: Provider; original: string; simplified: string; grade_level: string } |
  { error: { detail: string; code: string } }
> {
  try {
    const provider = resolveProvider("TEXT");
    const prompt = `Simplify the following text for a reading level of Grade 5. Return ONLY a JSON object with keys: "simplified" (the simplified text) and "grade_level" (e.g. "Grade 5").\n\nText: ${text}`;

    let raw: string;
    if (provider === "openai") {
      raw = await openaiChat([
        { role: "system", content: "You are an expert at making complex text accessible. Always return valid JSON." },
        { role: "user", content: prompt },
      ]);
    } else {
      raw = await geminiGenerate(`${prompt}\n\nReturn ONLY valid JSON, no markdown.`);
    }

    // Strip possible markdown fences
    const cleaned = raw.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();
    let parsed: { simplified: string; grade_level: string };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // If parsing fails, treat the whole response as the simplified text
      parsed = { simplified: cleaned, grade_level: "Grade 5" };
    }

    return { provider, original: text, simplified: parsed.simplified, grade_level: parsed.grade_level ?? "Grade 5" };
  } catch (err) {
    return { error: { code: "provider_error", detail: (err as Error).message } };
  }
}

// ── Sign Language Gloss ───────────────────────────────────────────────────

export async function runSignGloss(text: string): Promise<{
  gloss: string[];
  grammar_structure: string;
  method: string;
}> {
  try {
    const provider = resolveProvider("TEXT");
    const prompt = `Convert this sentence to American Sign Language (ASL) gloss notation. Return ONLY a JSON object with keys:
- "gloss": array of uppercase gloss tokens in correct ASL order (topic-comment, no articles/copulas)
- "grammar_structure": brief label (e.g. "Topic-Comment", "Question", "Subject-Verb-Object")

Sentence: "${text}"`;

    let raw: string;
    if (provider === "openai") {
      raw = await openaiChat([
        { role: "system", content: "You are an ASL linguist. Return only valid JSON." },
        { role: "user", content: prompt },
      ]);
    } else {
      raw = await geminiGenerate(`${prompt}\n\nReturn ONLY valid JSON, no markdown.`);
    }

    const cleaned = raw.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();
    let parsed: { gloss: string[]; grammar_structure: string };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback to rule-based
      return {
        gloss: text.toUpperCase().replace(/[^A-Z0-9 ]/g, "").split(" ").filter(Boolean),
        grammar_structure: "Rule-Based",
        method: "rule-based-gloss",
      };
    }

    return {
      gloss: parsed.gloss ?? [],
      grammar_structure: parsed.grammar_structure ?? "Unknown",
      method: `ai-gloss-${provider}`,
    };
  } catch {
    // Pure rule-based fallback
    return {
      gloss: text.toUpperCase().replace(/[^A-Z0-9 ]/g, "").split(" ").filter(Boolean),
      grammar_structure: "Rule-Based",
      method: "rule-based-gloss",
    };
  }
}

// ── Accessibility Orchestrator ────────────────────────────────────────────

export async function runAccessibilityAnalyze(input: {
  image?: string | null;
  text?: string | null;
  reading_level?: "standard" | "simplified";
  output_modalities?: string[];
}): Promise<{
  response_id: string;
  results: Record<string, unknown>;
  services_invoked: string[];
  latency_ms: number;
}> {
  const start = Date.now();
  const servicesInvoked: string[] = [];
  const results: Record<string, unknown> = {};

  if (input.image) {
    // Run OCR + Vision in parallel
    const { runOCR } = await import("@/lib/ocr");
    const [ocr, vision] = await Promise.all([
      runOCR(input.image),
      runVisionDescribe(input.image, input.reading_level === "simplified"),
    ]);
    servicesInvoked.push("ocr", "scene-understanding");
    results.ocr = ocr;
    results.vision = "error" in vision ? { error: vision.error } : vision;
  }

  if (input.text) {
    if (input.reading_level === "simplified") {
      const simplified = await runTextSimplify(input.text);
      servicesInvoked.push("text-simplification");
      results.simplified_text = "error" in simplified ? { error: simplified.error, original: input.text } : simplified;
    } else {
      results.text = input.text;
    }

    const gloss = await runSignGloss(input.text);
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
