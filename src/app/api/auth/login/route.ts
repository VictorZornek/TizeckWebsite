import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { connectMongo } from "@/database/db";
import User from "@/database/models/User";
import { getJwtSecretEncoded } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    await connectMongo();
    
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: "Usuário e/ou senha incorretos" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Usuário e/ou senha incorretos" }, { status: 401 });
    }

    const token = await new SignJWT({ 
      userId: user._id.toString(), 
      username: user.username 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("8h")
      .sign(getJwtSecretEncoded());

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 28800,
    });

    return response;
  } catch (error) {
    console.error('[LOGIN] Erro:', error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}