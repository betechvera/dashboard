import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import { env } from "@/lib/env";
import { RefreshToken } from "@/services/api/auth/refresh-token";
import { UnauthorizedError } from "@/errors/UnauthorizedError";
import { thisDateHour } from "@/lib/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ token: string } | { error?: string }>
) {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const refresh_token = req.cookies?.refresh_token || "";

        const cookies = new Cookies(req, res);

        const { token } = await new RefreshToken().execute({ refresh_token });

        cookies.set("token", token, {
          httpOnly: true,
          secure: env.NODE_ENV === "production",
          maxAge: 20 * 60 * 1000, //definido em milisegundos
          sameSite: "strict",
        });

        return res.status(200).json({ token });
      } catch (error) {
        console.error(`[SERVER: Login]: ${thisDateHour()} \n${error}`);

        if (error instanceof UnauthorizedError)
          res.status(error.statusCode).json({ error: error.message });

        res.status(400).json({ error: "Erro ao realizar o login." });
      }
      break;

    default:
      res.status(405).json({ error: "Método não permitido." });
  }
}
