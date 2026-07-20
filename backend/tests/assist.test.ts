import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { setupTestDB, cleanTestDB, teardownTestDB, makeRequest, authHeader, createTestUser } from './helpers';

// Mock Redis so rate-limit checks pass without a real Redis server
vi.mock('@/lib/redis', () => ({
  checkDailyRateLimit: vi.fn().mockResolvedValue({ allowed: true, count: 1, limit: 100 }),
  consumeNonce: vi.fn().mockResolvedValue(true),
  pingRedis: vi.fn().mockResolvedValue(true),
}));

describe('POST /v1/accessibility/assist', () => {
  beforeAll(async () => { await setupTestDB(); });
  afterEach(async () => { await cleanTestDB(); });
  afterAll(async () => { await teardownTestDB(); });

  async function assist() { return (await import('@/app/api/v1/accessibility/assist/route')).POST; }

  const validBody = {
    user_context: {
      preferences: { primary_disability: 'none', reading_level: 'standard', output_modalities: ['text'] },
    },
    input: { text: 'What does this sign say?', image: null, audio: null, document: null },
    device: { has_speaker: false, has_haptics: false },
    situation: { urgency: 'normal' },
  };

  it('returns 401 without an auth token', async () => {
    const handler = await assist();
    const req = makeRequest('/v1/accessibility/assist', { method: 'POST', body: validBody });
    const res = await handler(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('unauthorized');
  });

  it('returns a response structure with valid auth + text input', async () => {
    const user = await createTestUser();
    const handler = await assist();
    const req = makeRequest('/v1/accessibility/assist', {
      method: 'POST',
      body: validBody,
      headers: authHeader({ sub: user.user.id, email: user.user.email, role: user.user.role }),
    });

    const res = await handler(req);
    // When no AI provider is configured, orchestrator returns capability_not_configured
    // or the rule-based fallback. Either is a valid 200-level or 501-level response
    // depending on the orchestrator implementation.
    const data = await res.json();

    if (res.status === 200) {
      // Rule-based fallback response
      expect(data.primary_output).toBeDefined();
      expect(data.primary_output.text).toBeTruthy();
      expect(data.services_invoked).toBeDefined();
      expect(typeof data.latency_ms).toBe('number');
    } else {
      // capability_not_configured
      expect(data.error).toBe('capability_not_configured');
    }
  });

  it('includes X-RateLimit headers', async () => {
    const user = await createTestUser();
    const handler = await assist();
    const req = makeRequest('/v1/accessibility/assist', {
      method: 'POST',
      body: validBody,
      headers: authHeader({ sub: user.user.id, email: user.user.email, role: user.user.role }),
    });
    const res = await handler(req);
    expect(res.headers.get('X-RateLimit-Limit')).toBeTruthy();
    expect(res.headers.get('X-RateLimit-Remaining')).toBeTruthy();
  });

  it('returns 400 for malformed body', async () => {
    const user = await createTestUser();
    const handler = await assist();
    const req = makeRequest('/v1/accessibility/assist', {
      method: 'POST',
      body: { invalid: true } as any,
      headers: authHeader({ sub: user.user.id, email: user.user.email, role: user.user.role }),
    });
    const res = await handler(req);
    expect(res.status).toBe(400);
  });

  it('returns 429 when rate-limited', async () => {
    // Override the mock for this test
    const { checkDailyRateLimit } = await import('@/lib/redis');
    (checkDailyRateLimit as any).mockResolvedValueOnce({ allowed: false, count: 101, limit: 100 });

    const user = await createTestUser();
    const handler = await assist();
    const req = makeRequest('/v1/accessibility/assist', {
      method: 'POST',
      body: validBody,
      headers: authHeader({ sub: user.user.id, email: user.user.email, role: user.user.role }),
    });
    const res = await handler(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toBe('rate_limit_exceeded');
  });
});
