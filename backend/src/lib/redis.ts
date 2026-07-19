import Redis from "ioredis";

/**
 * Redis client — backs the Gateway's fixed-window-per-day rate limiter
 * (Section 11) and general response caching.
 */
let client: Redis | null = null;

export function getRedis(): Redis {
  if (!client) {
    client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      maxRetriesPerRequest: 2,
      lazyConnect: true,
    });
  }
  return client;
}

/** Fixed-window-per-day limiter keyed per authenticated subject. */
export async function checkDailyRateLimit(subjectId: string, dailyLimit: number) {
  const redis = getRedis();
  const dayKey = new Date().toISOString().slice(0, 10);
  const key = `ratelimit:${subjectId}:${dayKey}`;
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 60 * 60 * 24);
    return { allowed: count <= dailyLimit, count, limit: dailyLimit };
  } catch {
    // Fail open locally if Redis isn't running (dev convenience only).
    return { allowed: true, count: 0, limit: dailyLimit };
  }
}

/**
 * Single-use nonce check for the API-key HMAC signing path (Section 12).
 * Returns true the first time a given nonce is seen (and marks it used for
 * SIGNATURE_NONCE_TTL_SECONDS), false if it has already been consumed —
 * i.e. a replay.
 */
export async function consumeNonce(nonceKey: string): Promise<boolean> {
  const redis = getRedis();
  const ttl = Number(process.env.SIGNATURE_NONCE_TTL_SECONDS || 300);
  const key = `nonce:${nonceKey}`;
  try {
    const result = await redis.set(key, "1", "EX", ttl, "NX");
    return result === "OK";
  } catch {
    // Fail open locally if Redis isn't running (dev convenience only).
    return true;
  }
}

/** Reachability check for GET /health/ready. */
export async function pingRedis(): Promise<boolean> {
  try {
    const res = await getRedis().ping();
    return res === "PONG";
  } catch {
    return false;
  }
}
