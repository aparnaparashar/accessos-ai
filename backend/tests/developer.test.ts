import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupTestDB, cleanTestDB, teardownTestDB, makeRequest, authHeader, createTestUser } from './helpers';

describe('Developer Platform routes', () => {
  beforeAll(async () => { await setupTestDB(); });
  afterEach(async () => { await cleanTestDB(); });
  afterAll(async () => { await teardownTestDB(); });

  async function appsRoute() { return await import('@/app/api/v1/developer/applications/route'); }
  async function appDetailRoute() { return await import('@/app/api/v1/developer/applications/[id]/route'); }
  async function keysRoute() { return await import('@/app/api/v1/developer/applications/[id]/keys/route'); }

  async function devAuth() {
    const user = await createTestUser({ email: 'dev@test.com', role: 'developer' });
    return { user, headers: authHeader({ sub: user.user.id, email: user.user.email, role: 'developer' }) };
  }

  // ── Applications CRUD ──

  describe('POST /v1/developer/applications', () => {
    it('creates an application (happy path)', async () => {
      const { headers } = await devAuth();
      const { POST } = await appsRoute();
      const req = makeRequest('/v1/developer/applications', {
        method: 'POST',
        body: { name: 'TestApp', plan: 'starter', allowed_apis: ['ocr'] },
        headers,
      });

      const res = await POST(req);
      expect(res.status).toBe(201);

      const data = await res.json();
      expect(data.application.name).toBe('TestApp');
      expect(data.application.plan).toBe('starter');
      expect(data.application.allowed_apis).toEqual(['ocr']);
    });

    it('returns 401 without auth', async () => {
      const { POST } = await appsRoute();
      const req = makeRequest('/v1/developer/applications', {
        method: 'POST',
        body: { name: 'NoAuth' },
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it('returns 403 for non-developer role', async () => {
      const user = await createTestUser({ email: 'enduser@test.com', role: 'end_user' });
      const { POST } = await appsRoute();
      const req = makeRequest('/v1/developer/applications', {
        method: 'POST',
        body: { name: 'X' },
        headers: authHeader({ sub: user.user.id, email: user.user.email, role: 'end_user' }),
      });
      const res = await POST(req);
      expect(res.status).toBe(403);
    });
  });

  describe('GET /v1/developer/applications', () => {
    it('lists only the callers own applications', async () => {
      const { headers } = await devAuth();
      const { POST, GET } = await appsRoute();

      // Create two apps
      await POST(makeRequest('/v1/developer/applications', { method: 'POST', body: { name: 'A1' }, headers }));
      await POST(makeRequest('/v1/developer/applications', { method: 'POST', body: { name: 'A2' }, headers }));

      const res = await GET(makeRequest('/v1/developer/applications', { headers }));
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.applications.length).toBe(2);
    });
  });

  // ── Ownership enforcement ──

  describe('Ownership (403)', () => {
    it('user A cannot access user Bs app', async () => {
      const devA = await devAuth();
      const devB = await createTestUser({ email: 'devb@test.com', role: 'developer' });
      const devBHeaders = authHeader({ sub: devB.user.id, email: devB.user.email, role: 'developer' });

      // A creates an app
      const { POST } = await appsRoute();
      const createRes = await POST(makeRequest('/v1/developer/applications', {
        method: 'POST', body: { name: 'Private' }, headers: devA.headers,
      }));
      const appId = (await createRes.json()).application._id;

      // B tries to GET it
      const { GET } = await appDetailRoute();
      const res = await GET(
        makeRequest(`/v1/developer/applications/${appId}`, { headers: devBHeaders }),
        { params: { id: appId } }
      );
      expect(res.status).toBe(403);
    });
  });

  // ── PATCH ──

  describe('PATCH /v1/developer/applications/:id', () => {
    it('updates application name', async () => {
      const { headers } = await devAuth();
      const { POST } = await appsRoute();
      const createRes = await POST(makeRequest('/v1/developer/applications', {
        method: 'POST', body: { name: 'Original' }, headers,
      }));
      const appId = (await createRes.json()).application._id;

      const { PATCH } = await appDetailRoute();
      const res = await PATCH(
        makeRequest(`/v1/developer/applications/${appId}`, {
          method: 'PATCH', body: { name: 'Renamed' }, headers,
        }),
        { params: { id: appId } }
      );
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.application.name).toBe('Renamed');
    });
  });

  // ── Key lifecycle ──

  describe('Key lifecycle', () => {
    it('generate → list → key shows in list', async () => {
      const { headers } = await devAuth();
      const { POST: createApp } = await appsRoute();
      const appRes = await createApp(makeRequest('/v1/developer/applications', {
        method: 'POST', body: { name: 'KeyTest' }, headers,
      }));
      const appId = (await appRes.json()).application._id;

      const { POST: genKey, GET: listKeys } = await keysRoute();

      // Generate
      const genRes = await genKey(
        makeRequest(`/v1/developer/applications/${appId}/keys`, { method: 'POST', headers }),
        { params: { id: appId } }
      );
      expect(genRes.status).toBe(201);
      const keyData = await genRes.json();
      expect(keyData.secret_key).toBeTruthy();
      expect(keyData.client_id).toBeTruthy();
      expect(keyData.warning).toContain('only once');

      // List
      const listRes = await listKeys(
        makeRequest(`/v1/developer/applications/${appId}/keys`, { headers }),
        { params: { id: appId } }
      );
      expect(listRes.status).toBe(200);
      const listData = await listRes.json();
      expect(listData.keys.length).toBe(1);
      expect(listData.keys[0].client_id).toBe(keyData.client_id);
      // Secret hash must NOT be in the list response
      expect(listData.keys[0].secret_hash).toBeUndefined();
    });
  });
});
