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

// Métodos que exigem validação de Origin
const MUTATING_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

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

function isValidOrigin(origin: string | null, host: string): boolean {
  // Se não há Origin, permitir (requisições same-origin, curl, etc)
  if (!origin) {
    return true;
  }

  try {
    const originUrl = new URL(origin);
    const originHost = originUrl.host;

    // Permitir se o host do Origin corresponde ao host atual
    if (originHost === host) {
      return true;
    }

    // Permitir localhost em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      const localhostPatterns = [
        'localhost',
        '127.0.0.1',
        '[::1]',
      ];
      
      const isOriginLocalhost = localhostPatterns.some(pattern => 
        originHost.includes(pattern)
      );
      const isHostLocalhost = localhostPatterns.some(pattern => 
        host.includes(pattern)
      );

      if (isOriginLocalhost && isHostLocalhost) {
        return true;
      }
    }

    return false;
  } catch (error) {
    // Se não conseguir parsear o Origin, bloquear
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  
  // Validação de Origin para métodos mutantes em rotas /api/*
  if (pathname.startsWith("/api/") && MUTATING_METHODS.includes(method)) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host") || "";

    if (!isValidOrigin(origin, host)) {
      return NextResponse.json(
        { error: "Origem não permitida" },
        { status: 403 }
      );
    }
  }
  
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