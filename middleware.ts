import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getJwtSecretEncoded } from "@/lib/jwt";

const JWT_SECRET = getJwtSecretEncoded();

// Rotas públicas que não precisam de autenticação
const PUBLIC_ROUTES = [
  "/admin/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/verify",
  "/_next",
  "/favicon.ico",
];

// Rotas que permitem GET público mas exigem autenticação para outros métodos
const PUBLIC_GET_ROUTES = [
  "/api/products",
  "/api/products/featured",
  "/api/categories",
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}

function isPublicGetRoute(pathname: string): boolean {
  // Verificar rotas exatas e rotas com [id]
  return PUBLIC_GET_ROUTES.some(route => {
    if (pathname === route) return true;
    // Permitir /api/products/[id] e /api/categories/[id] apenas para GET
    if (route === "/api/products" && pathname.match(/^\/api\/products\/[^/]+$/)) return true;
    if (route === "/api/categories" && pathname.match(/^\/api\/categories\/[^/]+$/)) return true;
    return false;
  });
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
  const method = request.method;
  
  // Permitir rotas públicas
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Permitir GET em rotas públicas específicas
  if (method === "GET" && isPublicGetRoute(pathname)) {
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
        { error: "Não autorizado" },
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