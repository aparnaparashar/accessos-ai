import crypto from "crypto";
import bcrypt from "bcryptjs";

/**
 * Developer Platform key helpers (Section 10/12).
 *
 * Every Application gets a stable, non-secret `client_id` plus one or more
 * rotatable secret keys. Only the bcrypt hash of a secret is ever persisted —
 * the plaintext is returned to the developer exactly once, at creation or
 * rotation time, and is never logged.
 */

const CLIENT_ID_PREFIX = "aos_client_";
const SECRET_KEY_PREFIX = "aos_sk_";

export function generateClientId(): string {
  return `${CLIENT_ID_PREFIX}${crypto.randomBytes(12).toString("hex")}`;
}

export interface GeneratedKeyPair {
  clientId: string;
  secretKey: string; // plaintext — caller must hand this back once and never persist it raw
}

export function generateKeyPair(existingClientId?: string): GeneratedKeyPair {
  return {
    clientId: existingClientId || generateClientId(),
    secretKey: `${SECRET_KEY_PREFIX}${crypto.randomBytes(32).toString("base64url")}`,
  };
}

export async function hashSecret(secret: string): Promise<string> {
  return bcrypt.hash(secret, 10);
}

export async function verifySecret(secret: string, hash: string): Promise<boolean> {
  return bcrypt.compare(secret, hash);
}

/**
 * HMAC-SHA256 request signature used for the optional replay-protected
 * signing path (X-Timestamp / X-Nonce / X-Signature). The signed string is
 * `${method}\n${path}\n${timestamp}\n${nonce}\n${rawBody}` so the signature
 * binds the request method, path, freshness window, and body together.
 */
export function computeSignature(
  secretKey: string,
  method: string,
  path: string,
  timestamp: string,
  nonce: string,
  rawBody: string
): string {
  const payload = `${method}\n${path}\n${timestamp}\n${nonce}\n${rawBody}`;
  return crypto.createHmac("sha256", secretKey).update(payload).digest("hex");
}

export function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
