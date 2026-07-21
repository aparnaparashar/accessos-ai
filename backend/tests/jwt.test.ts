import { describe, it, expect } from "vitest";
import {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  getAuthSubject,
} from "../src/lib/jwt";

describe("JWT Helper Utilities", () => {
  const payload = { sub: "user_12345", email: "developer@example.com" };

  it("should sign and verify access tokens", () => {
    const token = signAccessToken(payload);
    expect(typeof token).toBe("string");

    const decoded = verifyAccessToken(token);
    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.email).toBe(payload.email);
  });

  it("should sign and verify refresh tokens", () => {
    const token = signRefreshToken(payload);
    expect(typeof token).toBe("string");

    const decoded = verifyRefreshToken(token);
    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.email).toBe(payload.email);
  });

  it("should parse bearer token from Request headers in getAuthSubject", () => {
    const token = signAccessToken(payload);

    const validReq = new Request("http://localhost/api/test", {
      headers: { authorization: `Bearer ${token}` },
    });
    const sub = getAuthSubject(validReq);
    expect(sub).not.toBeNull();
    expect(sub?.sub).toBe(payload.sub);

    const invalidReq = new Request("http://localhost/api/test", {
      headers: { authorization: "Bearer invalid_token" },
    });
    expect(getAuthSubject(invalidReq)).toBeNull();

    const noAuthReq = new Request("http://localhost/api/test");
    expect(getAuthSubject(noAuthReq)).toBeNull();
  });
});
