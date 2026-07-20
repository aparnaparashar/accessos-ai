import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupTestDB, cleanTestDB, teardownTestDB, makeRequest } from './helpers';

describe('Auth routes', () => {
  beforeAll(async () => { await setupTestDB(); });
  afterEach(async () => { await cleanTestDB(); });
  afterAll(async () => { await teardownTestDB(); });

  // Dynamically import route handlers so they pick up the patched MONGODB_URI
  async function signup() { return (await import('@/app/api/v1/auth/signup/route')).POST; }
  async function login() { return (await import('@/app/api/v1/auth/login/route')).POST; }
  async function refresh() { return (await import('@/app/api/v1/auth/refresh/route')).POST; }

  // ── Signup ──

  describe('POST /v1/auth/signup', () => {
    it('creates a new user and returns tokens (happy path)', async () => {
      const handler = await signup();
      const req = makeRequest('/v1/auth/signup', {
        method: 'POST',
        body: { email: 'alice@example.com', password: 'secure1234', full_name: 'Alice', role: 'end_user' },
      });

      const res = await handler(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.access_token).toBeTruthy();
      expect(data.refresh_token).toBeTruthy();
      expect(data.token_type).toBe('bearer');
      expect(data.user.email).toBe('alice@example.com');
      expect(data.user.full_name).toBe('Alice');
      expect(data.user.role).toBe('end_user');
    });

    it('creates a developer-role user', async () => {
      const handler = await signup();
      const req = makeRequest('/v1/auth/signup', {
        method: 'POST',
        body: { email: 'dev@example.com', password: 'secure1234', full_name: 'Dev', role: 'developer' },
      });
      const data = await (await handler(req)).json();
      expect(data.user.role).toBe('developer');
    });

    it('returns 409 for duplicate email', async () => {
      const handler = await signup();
      // First signup
      await handler(makeRequest('/v1/auth/signup', {
        method: 'POST',
        body: { email: 'dupe@example.com', password: 'secure1234', full_name: 'First' },
      }));
      // Second signup with same email
      const res = await handler(makeRequest('/v1/auth/signup', {
        method: 'POST',
        body: { email: 'dupe@example.com', password: 'other12345', full_name: 'Second' },
      }));
      expect(res.status).toBe(409);
      const data = await res.json();
      expect(data.error).toBe('email_taken');
    });

    it('returns 400 for invalid email', async () => {
      const handler = await signup();
      const res = await handler(makeRequest('/v1/auth/signup', {
        method: 'POST',
        body: { email: 'not-email', password: 'secure1234', full_name: 'X' },
      }));
      expect(res.status).toBe(400);
    });

    it('returns 400 for short password', async () => {
      const handler = await signup();
      const res = await handler(makeRequest('/v1/auth/signup', {
        method: 'POST',
        body: { email: 'x@y.com', password: 'short', full_name: 'X' },
      }));
      expect(res.status).toBe(400);
    });
  });

  // ── Login ──

  describe('POST /v1/auth/login', () => {
    it('returns tokens for valid credentials (happy path)', async () => {
      const signupHandler = await signup();
      await signupHandler(makeRequest('/v1/auth/signup', {
        method: 'POST',
        body: { email: 'bob@example.com', password: 'password123', full_name: 'Bob' },
      }));

      const loginHandler = await login();
      const res = await loginHandler(makeRequest('/v1/auth/login', {
        method: 'POST',
        body: { email: 'bob@example.com', password: 'password123' },
      }));
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.access_token).toBeTruthy();
      expect(data.refresh_token).toBeTruthy();
      expect(data.user.email).toBe('bob@example.com');
    });

    it('returns 401 for wrong password', async () => {
      const signupHandler = await signup();
      await signupHandler(makeRequest('/v1/auth/signup', {
        method: 'POST',
        body: { email: 'carol@example.com', password: 'realpassword', full_name: 'Carol' },
      }));

      const loginHandler = await login();
      const res = await loginHandler(makeRequest('/v1/auth/login', {
        method: 'POST',
        body: { email: 'carol@example.com', password: 'wrongpassword' },
      }));
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe('invalid_credentials');
    });

    it('returns 401 for non-existent email', async () => {
      const loginHandler = await login();
      const res = await loginHandler(makeRequest('/v1/auth/login', {
        method: 'POST',
        body: { email: 'nobody@example.com', password: 'whatever1234' },
      }));
      expect(res.status).toBe(401);
    });
  });

  // ── Refresh ──

  describe('POST /v1/auth/refresh', () => {
    it('returns a new access token for a valid refresh token', async () => {
      const signupHandler = await signup();
      const signupRes = await signupHandler(makeRequest('/v1/auth/signup', {
        method: 'POST',
        body: { email: 'dan@example.com', password: 'password123', full_name: 'Dan' },
      }));
      const { refresh_token } = await signupRes.json();

      const refreshHandler = await refresh();
      const res = await refreshHandler(makeRequest('/v1/auth/refresh', {
        method: 'POST',
        body: { refresh_token },
      }));
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.access_token).toBeTruthy();
      expect(data.token_type).toBe('bearer');
    });

    it('returns 401 for an invalid refresh token', async () => {
      const refreshHandler = await refresh();
      const res = await refreshHandler(makeRequest('/v1/auth/refresh', {
        method: 'POST',
        body: { refresh_token: 'totally-invalid-jwt' },
      }));
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe('invalid_token');
    });
  });
});
