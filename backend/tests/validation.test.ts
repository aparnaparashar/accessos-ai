import { describe, it, expect } from "vitest";
import {
  signupSchema,
  loginSchema,
  createProjectSchema,
  createWebhookSchema,
  ocrRequestSchema,
  parseJsonBody,
} from "../src/lib/validation";

describe("Validation Schemas & Body Parser", () => {
  it("should validate signup requests", () => {
    const valid = signupSchema.safeParse({
      email: "user@example.com",
      password: "securepassword123",
      full_name: "Jane Doe",
    });
    expect(valid.success).toBe(true);

    const invalid = signupSchema.safeParse({
      email: "not-an-email",
      password: "short",
      full_name: "",
    });
    expect(invalid.success).toBe(false);
  });

  it("should validate login requests", () => {
    const valid = loginSchema.safeParse({
      email: "user@example.com",
      password: "password",
    });
    expect(valid.success).toBe(true);
  });

  it("should validate create project requests", () => {
    const valid = createProjectSchema.safeParse({
      name: "My AccessOS App",
      environment: "production",
    });
    expect(valid.success).toBe(true);
  });

  it("should validate webhook requests", () => {
    const valid = createWebhookSchema.safeParse({
      url: "https://example.com/webhook",
      events: ["ocr.completed"],
    });
    expect(valid.success).toBe(true);
  });

  it("should validate OCR request payload", () => {
    const valid = ocrRequestSchema.safeParse({
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    });
    expect(valid.success).toBe(true);
  });

  it("should parse valid JSON body with parseJsonBody", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com", password: "password123" }),
    });

    const res = await parseJsonBody(req, loginSchema);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.data.email).toBe("test@example.com");
    }
  });

  it("should return ok: false for invalid JSON body with parseJsonBody", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: "{ bad json",
    });

    const res = await parseJsonBody(req, loginSchema);
    expect(res.ok).toBe(false);
  });
});
