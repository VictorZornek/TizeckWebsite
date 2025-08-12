import mongoose from "mongoose";

const MONGO_CONNECTION = process.env.MONGO_CONNECTION;
if (!MONGO_CONNECTION) {
  throw new Error("Env MONGO_CONNECTION não definida.");
}

// Cache global para evitar múltiplas conexoes em dev/hot-reload
type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: Cached | undefined;
}

if (!global._mongoose) {
  global._mongoose = { conn: null, promise: null };
}

export async function connectMongo() {
  if (global._mongoose!.conn) return global._mongoose!.conn;

  if (!global._mongoose!.promise) {
    global._mongoose!.promise = mongoose.connect(MONGO_CONNECTION!, {
      bufferCommands: false,
    });
  }

  global._mongoose!.conn = await global._mongoose!.promise;

  if (process.env.NODE_ENV !== "production") {
    console.log("✅ MongoDB conectado (singleton).");
  }

  return global._mongoose!.conn;
}
