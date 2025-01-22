import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/models/user";
import { GetUserById } from "@/services/user/get-user-by-id";

export default async function handler(
  { method, query }: NextApiRequest,
  res: NextApiResponse<User | { error?: string }>
) {
  switch (method) {
    case "GET":
      try {
        const { id } = query;

        const numberId = Number(id);

        if (typeof numberId !== "number")
          res.status(400).json({ error: "ID precisa ser um número." });

        const user = await new GetUserById().execute({ id: numberId });

        res.status(200).json(user);
      } catch (error) {
        console.error(`[SERVER: GetUserById] ${error}`);
        res.status(400).json({ error: "Erro ao consultar os usuários." });
      }

      break;

    default:
      res.status(405).json({ error: "Método não permitido." });
  }
}
