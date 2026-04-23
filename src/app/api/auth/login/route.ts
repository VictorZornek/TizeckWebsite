import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { connectMongo } from "@/database/db";
import User from "@/database/models/User";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('[LOGIN] Tentativa de login:', email);

    await connectMongo();
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('[LOGIN] Usuário não encontrado');
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('[LOGIN] Senha inválida');
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "secret"
    );

    const token = await new SignJWT({ 
      userId: user._id.toString(), 
      email: user.email 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("8h")
      .sign(secret);

    console.log('[LOGIN] Token gerado:', token.substring(0, 20) + '...');

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 28800, // 8 horas
    });

    console.log('[LOGIN] Cookie configurado com sucesso');

    return response;
  } catch (error) {
    console.error('[LOGIN] Erro:', error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}