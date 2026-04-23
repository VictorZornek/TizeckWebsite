import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "secret"
);

// Rotas públicas que não precisam de autenticação
const PUBLIC_ROUTES = [
  "/admin/login",
  "/api/products",
  "/api/categories",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/verify",
  "/api/user/theme",
  "/_next",
  "/favicon.ico",
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}

async function verifyAuthToken(token: string | undefined): Promise<boolean> {
  if (!token) {
    console.log('[MIDDLEWARE] Nenhum token fornecido');
    return false;
  }
  
  try {
    await jwtVerify(token, JWT_SECRET);
    console.log('[MIDDLEWARE] Token válido');
    return true;
  } catch (error) {
    console.log('[MIDDLEWARE] Erro ao verificar token:', error instanceof Error ? error.message : error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`[MIDDLEWARE] Verificando rota: ${pathname}`);
  
  // Permitir rotas públicas
  if (isPublicRoute(pathname)) {
    console.log(`[MIDDLEWARE] Rota pública permitida: ${pathname}`);
    return NextResponse.next();
  }

  const token = request.cookies.get("admin-token")?.value;
  const isAuthenticated = await verifyAuthToken(token);
  
  console.log(`[MIDDLEWARE] Token presente: ${!!token}, Autenticado: ${isAuthenticated}`);

  // Proteger rotas /admin/*
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      console.log(`[MIDDLEWARE] Bloqueando acesso a ${pathname} - redirecionando para login`);
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    console.log(`[MIDDLEWARE] Acesso permitido a ${pathname}`);
    return NextResponse.next();
  }

  // Proteger APIs /api/*
  if (pathname.startsWith("/api/")) {
    if (!isAuthenticated) {
      console.log(`[MIDDLEWARE] Bloqueando API ${pathname} - 401`);
      return NextResponse.json(
        { error: "Não autorizado", message: "Token de autenticação inválido ou ausente" },
        { status: 401 }
      );
    }
    console.log(`[MIDDLEWARE] API permitida: ${pathname}`);
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