import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import nookies from "nookies";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { env } from "@/lib/env";
import { refreshAuth } from "@/services/auth";
import { User } from "@/models/user";
import { GetUserById } from "@/services/api/user/get-user-by-id";

interface AuthenticatedProps {
  user: User;
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

      const thisUser = await new GetUserById().execute({ id: decoded.id });

      if (!context.req.url?.includes("first-login")) {
        if (thisUser.first_login) {
          return {
            redirect: {
              destination: "/first-login",
              permanent: false,
            },
          };
        }
      } else {
        // se eu estiver na first login
        if (!thisUser.first_login) {
          // porém, não for meu primeiro acesso
          return {
            props: { user: decoded } as P,
            redirect: {
              destination: "/",
              permanent: false,
            },
          };
        }
      }

      // Se getServerSidePropsFunc existir, chama a função e mescla os resultados
      if (getServerSidePropsFunc) {
        const result = await getServerSidePropsFunc(context);

        // Garante que props existe antes de adicionar user
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
          const data = await refreshAuth(context);

          const user = jwt.decode(data.token) as AuthenticatedProps["user"];

          nookies.set(context, "token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 20 * 60, // 15 minutos (definido em segundos)
            path: "/",
          });

          const thisUser = await new GetUserById().execute({ id: user.id });

          if (!context.req.url?.includes("first-login")) {
            if (thisUser.first_login) {
              return {
                redirect: {
                  destination: "/first-login",
                  permanent: false,
                },
              };
            }
          } else {
            // se eu estiver na first login
            if (!thisUser.first_login) {
              // porém, não for meu primeiro acesso
              return {
                props: { user } as P,
                redirect: {
                  destination: "/",
                  permanent: false,
                },
              };
            }
          }

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

      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      } as GetServerSidePropsResult<P>;
    }
  };
}
