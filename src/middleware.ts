import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";
// import { env } from "@/lib/env";

// const protectedRoutes = ["/login"];

export function middleware() {
  //   const token = req.cookies.get("token")?.value; // Obtém o token do cookie

  //   if (!protectedRoutes.includes(req.nextUrl.pathname)) {
  //     if (!token) {
  //       return NextResponse.redirect(new URL("/login", req.url)); // Redireciona se não houver token
  //     }

  //     try {
  //       jwt.verify(token, env.JWT_SECRET);
  //     } catch (error) {
  //       return NextResponse.redirect(new URL("/login", req.url)); // Redireciona se o token for inválido
  //     }
  //   }

  //   return NextResponse.next(); // Continua para a página solicitada
  console.log("Passando pelo Middleware");
  return NextResponse.next();
}

// Define quais rotas o middleware será aplicado
export const config = {
  matcher: [
    "/api/:path",
    "/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
