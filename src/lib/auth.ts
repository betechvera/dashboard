import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import nookies from "nookies";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { env } from "@/lib/env";
import { refreshAuth } from "@/services/auth";

interface AuthenticatedProps {
  user: {
    id: number;
    email: string;
    username: string;
  };
}

export function withAuth<P extends AuthenticatedProps>(
  getServerSidePropsFunc?: (
    context: GetServerSidePropsContext
  ) => Promise<GetServerSidePropsResult<P>>
) {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = nookies.get(context);
    const token = cookies.token;

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      } as GetServerSidePropsResult<P>;
    }

    try {
      // Verifica se o token é válido
      const decoded = jwt.verify(
        token,
        env.JWT_SECRET
      ) as AuthenticatedProps["user"];

      // Se `getServerSidePropsFunc` existir, chama a função e mescla os resultados
      if (getServerSidePropsFunc) {
        const result = await getServerSidePropsFunc(context);

        // Garante que `props` existe antes de adicionar `user`
        if ("props" in result) {
          return {
            ...result,
            props: {
              ...(result.props as P),
              user: decoded,
            },
          };
        }

        return result;
      }

      return { props: { user: decoded } as P };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        try {
          const data = await refreshAuth(context);

          const user = jwt.decode(data.token) as AuthenticatedProps["user"];

          nookies.set(context, "token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60, // 15 minutos
            path: "/",
          });

          console.log("newToken", data.token);
          return { props: { user } as P };
        } catch (refreshError: any) {
          return {
            redirect: {
              destination: "/login",
              permanent: false,
            },
          } as GetServerSidePropsResult<P>;
        }
      }

      console.log("[AUTH] INSTA REJECT", context.req.headers);

      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      } as GetServerSidePropsResult<P>;
    }
    // return { props: {} as P };
  };
}
