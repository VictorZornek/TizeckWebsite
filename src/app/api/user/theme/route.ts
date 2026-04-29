import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { connectMongo } from "@/database/db";
import User from "@/database/models/User";
import { getJwtSecretEncoded } from "@/lib/jwt";

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecretEncoded());
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await connectMongo();
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ theme: user.theme || "light" });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { theme } = await request.json();
    if (!["light", "dark"].includes(theme)) {
      return NextResponse.json({ error: "Tema inválido" }, { status: 400 });
    }

    await connectMongo();
    await User.findByIdAndUpdate(userId, { theme });

    return NextResponse.json({ success: true, theme });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
