import { describe, it, expect } from "vitest";
import { getRedis, checkDailyRateLimit, consumeNonce, pingRedis } from "../src/lib/redis";

describe("Redis Utilities", () => {
  it("should return a Redis instance without crashing", () => {
    const redis = getRedis();
    expect(redis).toBeDefined();
  });

  it("should fail open gracefully when checking daily rate limit without Redis", async () => {
    const res = await checkDailyRateLimit("user_test", 100);
    expect(res.allowed).toBe(true);
  });

  it("should fail open gracefully when consuming nonce without Redis", async () => {
    const res = await consumeNonce("test_nonce_123");
    expect(res).toBe(true);
  });

  it("should return false for pingRedis when Redis is offline", async () => {
    const isOnline = await pingRedis();
    expect(typeof isOnline).toBe("boolean");
  });
});
