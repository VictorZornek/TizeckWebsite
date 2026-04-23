import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function verifyToken(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    return decoded;
  } catch {
    return null;
  }
}

export function isAuthenticated(request: NextRequest): boolean {
  return verifyToken(request) !== null;
}
