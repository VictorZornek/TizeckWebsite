import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getJwtSecretEncoded } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    await jwtVerify(token, getJwtSecretEncoded());
    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
