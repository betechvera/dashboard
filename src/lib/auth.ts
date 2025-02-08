import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { env } from "@/lib/env";
import { refreshAuth } from "@/services/auth";
import { User } from "@/models/user";
import { GetUserById } from "@/services/api/user/get-user-by-id";
import Cookies from "cookies";

interface AuthenticatedProps {
  user: User;
}

// Função para tratar a lógica do first-login
async function handleFirstLoginRedirect(
  reqUrl: string | undefined,
  user: User
) {
  if (!reqUrl?.includes("first-login")) {
    if (user.first_login) {
      return {
        redirect: {
          destination: "/first-login",
          permanent: false,
        },
      };
    }
  } else {
    if (!user.first_login) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  }
  return null;
}

export function withAuth<P extends AuthenticatedProps>(
  getServerSidePropsFunc?: (
    context: GetServerSidePropsContext
  ) => Promise<GetServerSidePropsResult<P>>
) {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const { req, res } = context;
    const cookies = new Cookies(req, res);
    const token = cookies.get("token");

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      } as GetServerSidePropsResult<P>;
    }

    try {
      // Verifica e decodifica o token
      const decoded = jwt.verify(
        token,
        env.JWT_SECRET
      ) as AuthenticatedProps["user"];

      const thisUser = await new GetUserById().execute({ id: decoded.id });

      // 🛑 Se precisar redirecionar por first-login, retorna já aqui
      const firstLoginRedirect = await handleFirstLoginRedirect(
        req.url,
        thisUser
      );
      if (firstLoginRedirect) return firstLoginRedirect;

      // Se tiver uma função adicional, executa e adiciona `user`
      if (getServerSidePropsFunc) {
        const result = await getServerSidePropsFunc(context);
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
      if (
        error instanceof TokenExpiredError ||
        (error as JsonWebTokenError).message === "jwt must be provided"
      ) {
        try {
          // Token expirado, tenta renovar
          const data = await refreshAuth(context);
          const newUser = jwt.decode(data.token) as AuthenticatedProps["user"];

          // Atualiza o token no cookie
          cookies.set("token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 20 * 60 * 1000, // 20 minutos
            path: "/",
          });

          const thisUser = await new GetUserById().execute({ id: newUser.id });

          // Se precisar redirecionar por first-login, retorna já aqui
          const firstLoginRedirect = await handleFirstLoginRedirect(
            req.url,
            thisUser
          );
          if (firstLoginRedirect) return firstLoginRedirect;

          return { props: { user: newUser } as P };
        } catch (refreshError: any) {
          return {
            redirect: {
              destination: "/login",
              permanent: false,
            },
          } as GetServerSidePropsResult<P>;
        }
      }

      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      } as GetServerSidePropsResult<P>;
    }
  };
}
