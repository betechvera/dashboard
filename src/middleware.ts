import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/lib/env";
import { jwtVerify } from "jose";
import { JWTExpired } from "jose/errors";

const unprotectedRoutes = ["/login", "/api/register", "/api/refresh-token"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (unprotectedRoutes.includes(pathname)) return NextResponse.next();

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
      return NextResponse.json(
        {
          error: "Não autorizado.",
          stringCode: "jwt_expired",
        },
        { status: 401 }
      );
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path"],
  // matcher: ["/api/"],
};
