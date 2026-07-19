import { connectDB } from "@/lib/db";
import ApiKey from "@/lib/models/ApiKey";
import Application, { IApplication } from "@/lib/models/Application";
import { verifySecret, computeSignature, timingSafeEqual } from "@/lib/keys";
import { checkDailyRateLimit } from "@/lib/redis";
import { planDailyLimit } from "@/lib/plans";
import { Types } from "mongoose";

/**
 * API-key request authenticator for the developer-product surface
 * (Section 10/12), e.g. POST /v1/ocr.
 *
 * Required headers:
 *   Authorization: Bearer <secret key>   (the plaintext returned once at key creation/rotation)
 *   X-Client-Id: <client id>             (stable, non-secret identifier for the Application/key pair)
 *
 * Optional replay-protected signing (recommended for production callers):
 *   X-Timestamp: <unix ms>                must be within 5 minutes of server time
 *   X-Nonce: <random string>              single-use, enforced via consumeNonce (Redis)
 *   X-Signature: <hex hmac>               = computeSignature(secretKey, method, path, timestamp, nonce, rawBody)
 * If X-Signature is present, all three of X-Timestamp/X-Nonce/X-Signature are required and verified.
 * If none are present, the request is authenticated by bearer secret + client id alone.
 */

export type ApiKeyAuthResult =
  | {
      ok: true;
      application: IApplication & { _id: Types.ObjectId };
      apiKeyId: Types.ObjectId;
      rateLimit: { allowed: true; count: number; limit: number };
    }
  | { ok: false; status: number; error: string; detail?: string };

const SIGNATURE_WINDOW_MS = 5 * 60 * 1000;

export async function authenticateApiKey(
  req: Request,
  apiName: string,
  rawBody: string
): Promise<ApiKeyAuthResult> {
  const authHeader = req.headers.get("authorization") || "";
  const secretKey = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const clientId = req.headers.get("x-client-id") || "";

  if (!secretKey || !clientId) {
    return {
      ok: false,
      status: 401,
      error: "unauthorized",
      detail: "Authorization: Bearer <secret key> and X-Client-Id headers are required",
    };
  }

  await connectDB();

  const apiKey = await ApiKey.findOne({ client_id: clientId });
  if (!apiKey || apiKey.revoked) {
    return { ok: false, status: 401, error: "invalid_key", detail: "Unknown or revoked API key" };
  }

  const secretValid = await verifySecret(secretKey, apiKey.secret_hash);
  if (!secretValid) {
    return { ok: false, status: 401, error: "invalid_key", detail: "Secret key does not match" };
  }

  // Optional replay-protected signing.
  const signature = req.headers.get("x-signature");
  if (signature) {
    const timestamp = req.headers.get("x-timestamp") || "";
    const nonce = req.headers.get("x-nonce") || "";
    if (!timestamp || !nonce) {
      return {
        ok: false,
        status: 401,
        error: "invalid_signature",
        detail: "X-Timestamp and X-Nonce are required when X-Signature is present",
      };
    }
    const age = Date.now() - Number(timestamp);
    if (!Number.isFinite(age) || Math.abs(age) > SIGNATURE_WINDOW_MS) {
      return { ok: false, status: 401, error: "invalid_signature", detail: "Timestamp outside allowed window" };
    }
    const { consumeNonce } = await import("@/lib/redis");
    const fresh = await consumeNonce(`${clientId}:${nonce}`);
    if (!fresh) {
      return { ok: false, status: 401, error: "replay_detected", detail: "Nonce already used or expired" };
    }
    const url = new URL(req.url);
    const expected = computeSignature(secretKey, req.method, url.pathname, timestamp, nonce, rawBody);
    if (!timingSafeEqual(expected, signature)) {
      return { ok: false, status: 401, error: "invalid_signature", detail: "Signature verification failed" };
    }
  }

  // IP allowlist enforcement.
  if (apiKey.ip_allowlist && apiKey.ip_allowlist.length > 0) {
    const callerIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "";
    if (!callerIp || !apiKey.ip_allowlist.includes(callerIp)) {
      return { ok: false, status: 403, error: "ip_not_allowed", detail: "Caller IP is not on this key's allowlist" };
    }
  }

  const application = await Application.findById(apiKey.application);
  if (!application) {
    return { ok: false, status: 401, error: "invalid_key", detail: "Application for this key no longer exists" };
  }

  if (!application.allowed_apis.includes(apiName)) {
    return {
      ok: false,
      status: 403,
      error: "api_not_allowed",
      detail: `This application's plan does not include the "${apiName}" API`,
    };
  }

  const limit = planDailyLimit(application.plan);
  const rate = await checkDailyRateLimit(`app:${application._id.toString()}`, limit);
  if (!rate.allowed) {
    return { ok: false, status: 429, error: "rate_limit_exceeded", detail: `Daily quota of ${limit} requests exceeded` };
  }

  apiKey.last_used_at = new Date();
  await apiKey.save();

  return {
    ok: true,
    application: application as IApplication & { _id: Types.ObjectId },
    apiKeyId: apiKey._id as Types.ObjectId,
    rateLimit: { allowed: true, count: rate.count, limit: rate.limit },
  };
}
