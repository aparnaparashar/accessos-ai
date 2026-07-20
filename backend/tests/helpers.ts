/**
 * Shared test utilities for backend integration tests.
 * Uses mongodb-memory-server so tests are self-contained — no external
 * MongoDB or Redis instance required.
 */
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { signAccessToken, signRefreshToken, type AuthTokenPayload } from '@/lib/jwt';

let mongod: MongoMemoryServer | null = null;

/**
 * Starts an in-memory MongoDB, connects mongoose to it, and patches
 * process.env.MONGODB_URI so that `connectDB()` re-uses it.
 * Call once in a beforeAll().
 */
export async function setupTestDB() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;

  // Clear the cached connection so connectDB() picks up the new URI
  if ((global as any)._mongooseCache) {
    (global as any)._mongooseCache = { conn: null, promise: null };
  }

  await mongoose.connect(uri, { bufferCommands: false });
}

/**
 * Drops all collections after each test to keep tests isolated.
 */
export async function cleanTestDB() {
  const collections = await mongoose.connection.db?.collections();
  if (collections) {
    for (const col of collections) {
      await col.deleteMany({});
    }
  }
}

/**
 * Disconnects mongoose and stops the in-memory server.
 * Call once in an afterAll().
 */
export async function teardownTestDB() {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
}

/**
 * Builds a standard Request object that can be passed to Next.js
 * route handlers.
 */
export function makeRequest(
  url: string,
  options: {
    method?: string;
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
  } = {}
): Request {
  const { method = 'GET', body, headers = {} } = options;
  const init: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  };
  if (body) init.body = JSON.stringify(body);
  return new Request(`http://localhost:8000${url}`, init);
}

/** Generates a Bearer Authorization header for a given payload. */
export function authHeader(payload: AuthTokenPayload): Record<string, string> {
  return { Authorization: `Bearer ${signAccessToken(payload)}` };
}

/** Creates a user by calling the signup route handler directly. Returns the parsed JSON response. */
export async function createTestUser(overrides: {
  email?: string;
  password?: string;
  full_name?: string;
  role?: 'end_user' | 'developer';
} = {}) {
  const { POST } = await import('@/app/api/v1/auth/signup/route');
  const req = makeRequest('/v1/auth/signup', {
    method: 'POST',
    body: {
      email: overrides.email ?? 'test@example.com',
      password: overrides.password ?? 'password123',
      full_name: overrides.full_name ?? 'Test User',
      role: overrides.role ?? 'end_user',
    },
  });
  const res = await POST(req);
  return res.json();
}
