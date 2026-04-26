import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { connectMongo } from "@/database/db";
import User from "@/database/models/User";
import { getJwtSecretEncoded } from "@/lib/jwt";
import { loginRateLimiter, getClientIp } from "@/lib/rateLimit";
import { logError } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    // Extrair IP do cliente
    const clientIp = getClientIp(request);

    // Verificar rate limit
    const { allowed, retryAfter } = loginRateLimiter.check(clientIp);
    if (!allowed) {
      return NextResponse.json(
        { error: "Muitas tentativas de login. Tente novamente mais tarde." },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter?.toString() || '900',
          },
        }
      );
    }

    const { username, password } = await request.json();

    await connectMongo();
    
    const user = await User.findOne({ username });
    if (!user) {
      loginRateLimiter.increment(clientIp);
      return NextResponse.json({ error: "Usuário e/ou senha incorretos" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      loginRateLimiter.increment(clientIp);
      return NextResponse.json({ error: "Usuário e/ou senha incorretos" }, { status: 401 });
    }

    // Login bem-sucedido - resetar contador
    loginRateLimiter.reset(clientIp);

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
    logError('LOGIN', error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}