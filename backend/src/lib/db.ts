import mongoose from "mongoose";

/**
 * MongoDB connection helper (Section 06 — Primary database).
 * Reuses a cached connection across hot-reloads / serverless invocations.
 */
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/accessos";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache || { conn: null, promise: null };
global._mongooseCache = cache;

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, { dbName: "accessos", bufferCommands: false });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}

/** Reachability check for GET /health/ready. */
export async function pingDB(): Promise<boolean> {
  try {
    const conn = await connectDB();
    const ping = await conn.connection.db?.admin().ping();
    return Boolean(ping);
  } catch {
    return false;
  }
}
