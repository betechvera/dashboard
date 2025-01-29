import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/lib/env";
import { jwtVerify } from "jose";
import { JWTExpired } from "jose/errors";

const unprotectedRoutes = ["/login", "/api/refresh-token"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (unprotectedRoutes.includes(pathname)) return NextResponse.next();

  console.log("[MIDDLEWARE] passing by middleware");

  const token = req.cookies.get("token")?.value;

  if (!token)
    return NextResponse.json(
      {
        error: "Não autorizado.",
        stringCode: "no_token",
      },
      { status: 401 }
    );

  try {
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    await jwtVerify(token, secret);
  } catch (error) {
    if (error instanceof JWTExpired) {
      console.error(`[PRINCIPAL MIDDLEWARE] JWP EXPIRED`);
      return NextResponse.json(
        {
          error: "Não autorizado.",
          stringCode: "jwt_expired",
        },
        { status: 401 }
      );
    } else {
      return NextResponse.redirect(new URL("/login", req.url)); // Redireciona se o token for inválido
    }
  }

  return NextResponse.next(); // Continua para a página solicitada
}

export const config = {
  matcher: ["/api/:path"],
};
