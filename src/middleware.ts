import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/lib/env";
import { setAuthToken } from "./lib/api";
import { jwtVerify } from "jose";

const unprotectedRoutes = ["/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (unprotectedRoutes.includes(pathname)) return NextResponse.next();

  console.log(
    "[MIDDLEWARE] passing by middleware"
    // "pathname =>",
    // pathname,
    // "\nunprotectedRoutes =>",
    // unprotectedRoutes
  );

  const token = req.cookies.get("token")?.value; // Obtém o token do cookie
  // const { pathname } = req.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redireciona se não houver token
  }

  try {
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    await jwtVerify(token, secret);
    setAuthToken();
  } catch (error) {
    console.error("[PRINCIPAL MIDDLEWARE]", error);
    return NextResponse.redirect(new URL("/login", req.url)); // Redireciona se o token for inválido
  }

  return NextResponse.next(); // Continua para a página solicitada
}

export const config = {
  matcher: ["/", "/:path", "/api/:path"],
};
