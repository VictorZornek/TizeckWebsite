import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getJwtSecretEncoded } from "@/lib/jwt";

export async function verifyToken(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecretEncoded());
    return payload;
  } catch {
    return null;
  }
}

export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const result = await verifyToken(request);
  return result !== null;
}
