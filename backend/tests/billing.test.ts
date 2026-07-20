import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupTestDB, cleanTestDB, teardownTestDB, makeRequest, authHeader, createTestUser } from './helpers';

describe('Billing routes', () => {
  beforeAll(async () => { await setupTestDB(); });
  afterEach(async () => { await cleanTestDB(); });
  afterAll(async () => { await teardownTestDB(); });

  async function devAuth() {
    const user = await createTestUser({ email: 'billingdev@test.com', role: 'developer' });
    return { user, headers: authHeader({ sub: user.user.id, email: user.user.email, role: 'developer' }) };
  }

  // ── POST /v1/billing/checkout ──

  describe('POST /v1/billing/checkout', () => {
    it('returns 501 capability_not_configured when STRIPE_SECRET_KEY is unset', async () => {
      // Ensure Stripe env vars are cleared
      const originalStripe = process.env.STRIPE_SECRET_KEY;
      delete process.env.STRIPE_SECRET_KEY;

      try {
        const { headers } = await devAuth();
        const { POST } = await import('@/app/api/v1/billing/checkout/route');
        const req = makeRequest('/v1/billing/checkout', {
          method: 'POST',
          body: { plan: 'starter' },
          headers,
        });
        const res = await POST(req);
        expect(res.status).toBe(501);

        const data = await res.json();
        expect(data.error).toBe('capability_not_configured');
        expect(data.detail).toContain('STRIPE_SECRET_KEY');
      } finally {
        // Restore
        if (originalStripe) process.env.STRIPE_SECRET_KEY = originalStripe;
      }
    });

    it('returns 401 without auth', async () => {
      const { POST } = await import('@/app/api/v1/billing/checkout/route');
      const req = makeRequest('/v1/billing/checkout', {
        method: 'POST',
        body: { plan: 'starter' },
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it('returns 403 for non-developer role', async () => {
      const user = await createTestUser({ email: 'enduser2@test.com', role: 'end_user' });
      const { POST } = await import('@/app/api/v1/billing/checkout/route');
      const req = makeRequest('/v1/billing/checkout', {
        method: 'POST',
        body: { plan: 'pro' },
        headers: authHeader({ sub: user.user.id, email: user.user.email, role: 'end_user' }),
      });
      const res = await POST(req);
      expect(res.status).toBe(403);
    });

    it('returns 400 for invalid plan', async () => {
      const { headers } = await devAuth();
      const { POST } = await import('@/app/api/v1/billing/checkout/route');
      const req = makeRequest('/v1/billing/checkout', {
        method: 'POST',
        body: { plan: 'enterprise' },
        headers,
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });
  });

  // ── GET /v1/billing/usage ──

  describe('GET /v1/billing/usage', () => {
    it('returns usage structure with empty data', async () => {
      const { headers } = await devAuth();
      const { GET } = await import('@/app/api/v1/billing/usage/route');
      const req = makeRequest('/v1/billing/usage', { headers });
      const res = await GET(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.billing_period_start).toBeTruthy();
      expect(Array.isArray(data.line_items)).toBe(true);
      expect(typeof data.estimated_total_usd).toBe('number');
      expect(data.disclaimer).toBeTruthy();
    });

    it('returns 401 without auth', async () => {
      const { GET } = await import('@/app/api/v1/billing/usage/route');
      const req = makeRequest('/v1/billing/usage');
      const res = await GET(req);
      expect(res.status).toBe(401);
    });
  });
});
