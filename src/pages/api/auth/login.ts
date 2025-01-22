import type { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "@/errors/ValidationError";
import { NotFoundError } from "@/errors/NotFoundError";
import { Auth, AuthRequest } from "@/services/auth/auth";
import Cookies from "cookies";
import { env } from "@/lib/env";
import dayjs from "dayjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string } | { error?: string }>
) {
  const { method, body } = req;

  switch (method) {
    case "POST":
      try {
        const { password, auth } = body as AuthRequest;

        const token = await new Auth().execute({
          auth,
          password,
        });

        const cookies = new Cookies(req, res);

        cookies.set("token", token, {
          httpOnly: true,
          secure: env.NODE_ENV === "production",
          maxAge: 60 * 60 * 1000,
          path: "/",
        });

        return res.status(200).json({ message: "Logado com sucesso." });
      } catch (error) {
        console.error(
          `[SERVER: Login]: ${dayjs().format(
            "DD/MM/YYYY - HH:mm:ss"
          )} \n${error}`
        );

        if (error instanceof ValidationError || error instanceof NotFoundError)
          res.status(400).json({ error: error.message });

        res.status(400).json({ error: "Erro ao realizar o login." });
      }
      break;

    default:
      res.status(405).json({ error: "Método não permitido." });
  }
}
