import { z, ZodSchema } from "zod";
import { NextResponse } from "next/server";

/**
 * Shared request-body validation (Section 14 hardening). Every route parses
 * its body through one of these schemas instead of trusting `await
 * req.json()` shape directly.
 */

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "password must be at least 8 characters"),
  full_name: z.string().min(1),
  role: z.enum(["end_user", "developer"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refresh_token: z.string().min(1),
});

export const preferencesSchema = z.object({
  primary_disability: z.enum([
    "low_vision",
    "blind",
    "deaf",
    "hard_of_hearing",
    "motor",
    "cognitive",
    "none",
  ]),
  reading_level: z.enum(["standard", "simplified"]),
  output_modalities: z.array(z.enum(["audio", "text", "haptic"])),
});

export const assistSchema = z.object({
  user_context: z.object({ preferences: preferencesSchema }),
  input: z.object({
    image: z.string().nullable().optional(),
    audio: z.string().nullable().optional(),
    document: z.string().nullable().optional(),
    text: z.string().nullable().optional(),
  }),
  device: z
    .object({
      has_speaker: z.boolean().optional(),
      has_haptics: z.boolean().optional(),
      screen_reader_active: z.boolean().optional(),
      bandwidth: z.string().optional(),
    })
    .optional(),
  situation: z
    .object({
      location_type: z.string().optional(),
      urgency: z.enum(["normal", "emergency"]).optional(),
    })
    .optional(),
});

export const createApplicationSchema = z.object({
  name: z.string().min(1),
  plan: z.enum(["free", "starter", "pro"]).optional(),
  allowed_apis: z.array(z.string()).optional(),
});

export const updateApplicationSchema = z.object({
  name: z.string().min(1).optional(),
  plan: z.enum(["free", "starter", "pro"]).optional(),
  allowed_apis: z.array(z.string()).optional(),
});

export const ocrRequestSchema = z.object({
  image: z.string().min(1, "image (base64/data URL) is required"),
});

export const checkoutSchema = z.object({
  plan: z.enum(["starter", "pro"]),
});

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
