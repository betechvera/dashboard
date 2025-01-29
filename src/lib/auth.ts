import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import nookies from "nookies";
import jwt from "jsonwebtoken";
import { env } from "@/lib/env";
import { JWTExpired } from "jose/errors";
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
    console.log("JWT TESTING GSSP");
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
      if (error instanceof JWTExpired) {
        console.log("JWT EXPIRED GSSP");

        await refreshAuth()
          .then((data) => {
            const user = jwt.decode(data.token) as AuthenticatedProps["user"];
            return { props: { user } as P };
          })
          .catch(() => {
            return {
              redirect: {
                destination: "/login",
                permanent: false,
              },
            } as GetServerSidePropsResult<P>;
          });
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
