import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getJwtSecretEncoded } from "@/lib/jwt";

const JWT_SECRET = getJwtSecretEncoded();

// Rotas públicas que não precisam de autenticação
const PUBLIC_ROUTES = [
  "/admin/login",
  "/api/products",
  "/api/categories",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/verify",
  "/_next",
  "/favicon.ico",
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}

async function verifyAuthToken(token: string | undefined): Promise<boolean> {
  if (!token) {
    return false;
  }
  
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Permitir rotas públicas
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin-token")?.value;
  const isAuthenticated = await verifyAuthToken(token);

  // Proteger rotas /admin/*
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Proteger APIs /api/*
  if (pathname.startsWith("/api/")) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Não autorizado", message: "Token de autenticação inválido ou ausente" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
  ],
};