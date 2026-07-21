import { describe, it, expect } from "vitest";
import {
  generateClientId,
  generateKeyPair,
  hashSecret,
  verifySecret,
  computeSignature,
  timingSafeEqual,
} from "../src/lib/keys";

describe("API Key Utilities", () => {
  it("should generate client_id with aos_client_ prefix", () => {
    const clientId = generateClientId();
    expect(clientId).toMatch(/^aos_client_[a-f0-9]{24}$/);
  });

  it("should generate key pair with client_id and secret_key", () => {
    const pair = generateKeyPair();
    expect(pair.clientId).toMatch(/^aos_client_/);
    expect(pair.secretKey).toMatch(/^aos_sk_/);

    const pairWithExisting = generateKeyPair("aos_client_custom123");
    expect(pairWithExisting.clientId).toBe("aos_client_custom123");
  });

  it("should hash and verify secrets using bcrypt", async () => {
    const secret = "aos_sk_testsecretkey123";
    const hash = await hashSecret(secret);
    expect(hash).not.toBe(secret);

    const isValid = await verifySecret(secret, hash);
    expect(isValid).toBe(true);

    const isInvalid = await verifySecret("wrong_secret", hash);
    expect(isInvalid).toBe(false);
  });

  it("should compute HMAC-SHA256 signatures", () => {
    const secret = "aos_sk_secret";
    const sig1 = computeSignature(secret, "POST", "/v1/ocr", "1700000000", "nonce123", '{"image":"abc"}');
    const sig2 = computeSignature(secret, "POST", "/v1/ocr", "1700000000", "nonce123", '{"image":"abc"}');
    expect(sig1).toBe(sig2);

    const sig3 = computeSignature(secret, "POST", "/v1/ocr", "1700000001", "nonce123", '{"image":"abc"}');
    expect(sig1).not.toBe(sig3);
  });

  it("should perform timing-safe string comparison", () => {
    expect(timingSafeEqual("abc", "abc")).toBe(true);
    expect(timingSafeEqual("abc", "xyz")).toBe(false);
    expect(timingSafeEqual("abc", "abcd")).toBe(false);
  });
});
