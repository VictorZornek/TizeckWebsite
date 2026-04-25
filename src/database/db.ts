import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Env MONGODB_URI não definida.");
}

// Garantir que conecta ao banco "tizeck"
const TIZECK_URI = MONGODB_URI.replace(/\/([^\/]*)(\?|$)/, '/tizeck$2');

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var _mongoose: Cached | undefined;
}

if (!global._mongoose) {
  global._mongoose = { conn: null, promise: null };
}

export async function connectMongo() {
  if (global._mongoose!.conn) return global._mongoose!.conn;

  if (!global._mongoose!.promise) {
    global._mongoose!.promise = mongoose.connect(TIZECK_URI, {
      bufferCommands: false,
    }).then(conn => {
      if (process.env.NODE_ENV !== "production") {
        console.log("✅ MongoDB conectado (singleton).");
      }
      return conn;
    });
  }

  global._mongoose!.conn = await global._mongoose!.promise;
  return global._mongoose!.conn;
}
