import { z, ZodSchema } from "zod";
import { NextResponse } from "next/server";

/**
 * Shared request-body validation schemas.
 */

// ── Auth ──────────────────────────────────────────────────────────────

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "password must be at least 8 characters"),
  full_name: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refresh_token: z.string().min(1),
});

// ── Developer Profile ─────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  full_name: z.string().min(1).optional(),
  company: z.string().optional(),
});

// ── Projects ──────────────────────────────────────────────────────────

export const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  environment: z.enum(["production", "development", "staging"]).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  environment: z.enum(["production", "development", "staging"]).optional(),
  status: z.enum(["active", "inactive", "archived"]).optional(),
});

// ── API Keys ──────────────────────────────────────────────────────────

export const createApiKeySchema = z.object({
  name: z.string().min(1).optional(),
  environment: z.enum(["production", "development"]).optional(),
});

export const renameApiKeySchema = z.object({
  name: z.string().min(1),
});

// ── Webhooks ──────────────────────────────────────────────────────────

export const createWebhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).optional(),
  enabled: z.boolean().optional(),
  retry_policy: z.object({
    max_retries: z.number().min(0).max(10).optional(),
    retry_interval_seconds: z.number().min(10).max(3600).optional(),
  }).optional(),
});

export const updateWebhookSchema = z.object({
  url: z.string().url().optional(),
  events: z.array(z.string()).optional(),
  enabled: z.boolean().optional(),
  retry_policy: z.object({
    max_retries: z.number().min(0).max(10).optional(),
    retry_interval_seconds: z.number().min(10).max(3600).optional(),
  }).optional(),
});

// ── Product APIs ──────────────────────────────────────────────────────

// Accepts either image (base64 data URL) or image_url (remote URL); normalises to `image`.
const imageField = z
  .object({
    image: z.string().min(1).optional(),
    image_url: z.string().url().optional(),
  })
  .refine((d) => d.image || d.image_url, { message: "Provide either image (base64) or image_url" })
  .transform((d) => ({ image: (d.image || d.image_url) as string }));

export const ocrRequestSchema = imageField;

export const visionRequestSchema = z
  .object({
    image: z.string().min(1).optional(),
    image_url: z.string().url().optional(),
    simplified: z.boolean().optional(),
  })
  .refine((d) => d.image || d.image_url, { message: "Provide either image (base64) or image_url" })
  .transform((d) => ({ image: (d.image || d.image_url) as string, simplified: d.simplified }));

export const simplifyRequestSchema = z.object({
  text: z.string().min(1, "text is required"),
});

export const accessibilityRequestSchema = z.object({
  image: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  text: z.string().nullable().optional(),
  reading_level: z.enum(["standard", "simplified"]).optional(),
  output_modalities: z.array(z.enum(["audio", "text", "haptic"])).optional(),
}).transform((d) => ({
  ...d,
  image: d.image || d.image_url || null,
}));

export const signLanguageRequestSchema = z.object({
  text: z.string().min(1, "text is required"),
});

// ── Settings ──────────────────────────────────────────────────────────

export const changePasswordSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8, "password must be at least 8 characters"),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1),
});

// ── Shared parser ─────────────────────────────────────────────────────

/** Parses+validates a JSON body against a schema; returns a 400 response on failure. */
export async function parseJsonBody<T>(
  req: Request,
  schema: ZodSchema<T>
): Promise<{ ok: true; data: T; raw: string } | { ok: false; response: NextResponse }> {
  let raw = "";
  try {
    raw = await req.text();
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "invalid_request", detail: "Body must be valid JSON" }, { status: 400 }),
    };
  }
  let json: unknown;
  try {
    json = raw ? JSON.parse(raw) : {};
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "invalid_request", detail: "Body must be valid JSON" }, { status: 400 }),
    };
  }
  const result = schema.safeParse(json);
  if (!result.success) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "invalid_request", detail: result.error.flatten().fieldErrors },
        { status: 400 }
      ),
    };
  }
  return { ok: true, data: result.data, raw };
}
