import mongoose, { Connection } from "mongoose";

const MONGODB_URI_LEGACY = process.env.MONGODB_URI_LEGACY || process.env.MONGODB_URI?.replace(/\/[^\/]*$/, '/tizeck-legacy');

if (!MONGODB_URI_LEGACY) {
  throw new Error("Env MONGODB_URI_LEGACY não definida.");
}

type Cached = {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

declare global {
  var _mongooseLegacy: Cached | undefined;
}

if (!global._mongooseLegacy) {
  global._mongooseLegacy = { conn: null, promise: null };
}

export async function connectMongoLegacy() {
  if (global._mongooseLegacy!.conn) return global._mongooseLegacy!.conn;

  if (!global._mongooseLegacy!.promise) {
    global._mongooseLegacy!.promise = mongoose.createConnection(MONGODB_URI_LEGACY!, {
      bufferCommands: false,
    }).asPromise();
  }

  global._mongooseLegacy!.conn = await global._mongooseLegacy!.promise;

  if (process.env.NODE_ENV !== "production") {
    console.log("✅ MongoDB Legacy conectado (singleton).");
  }

  return global._mongooseLegacy!.conn;
}
