import type { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "@/errors/ValidationError";
import { NotFoundError } from "@/errors/NotFoundError";
import { Auth, AuthRequest } from "@/services/api/auth/auth";
import Cookies from "cookies";
import { env } from "@/lib/env";
import dayjs from "dayjs";
import { FirstLogin, FirstLoginRequest } from "@/services/api/auth/first-login";
import { UnauthorizedError } from "@/errors/UnauthorizedError";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string } | { error?: string }>
) {
  const { method, body } = req;

  switch (method) {
    case "POST":
      try {
        const { new_password, name, last_name } = body as FirstLoginRequest;

        const cookies = new Cookies(req, res);

        const first_login_token = cookies.get("first_login_token");

        const { message } = await new FirstLogin().execute({
          first_login_token,
          new_password,
          name,
          last_name
        });

        cookies.set("first_login_token", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          expires: new Date(0),
        });

        return res.status(200).json({ message });
      } catch (error) {
        console.error(
          `[SERVER: FirstLogin]: ${dayjs().format(
            "DD/MM/YYYY - HH:mm:ss"
          )} \n${error}`
        );

        if (
          error instanceof ValidationError ||
          error instanceof NotFoundError ||
          error instanceof UnauthorizedError
        )
          res.status(error.statusCode).json({ error: error.message });

        res.status(400).json({ error: "Erro ao realizar a troca de senhas." });
      }
      break;

    default:
      res.status(405).json({ error: "Método não permitido." });
  }
}
