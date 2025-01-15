import type { NextApiRequest, NextApiResponse } from "next";
import { PageResponse } from "@/models";
import { User } from "@/models/user";
import { GetAllUsers, GetAllUsersRequest } from "@/services/user/get-all-users";

export default async function handler(
  { method, body }: NextApiRequest,
  res: NextApiResponse<PageResponse<User> | { error?: string }>
) {
  switch (method) {
    case "GET":
      const { page: reqPage, perPage: reqPerPage } = body as GetAllUsersRequest;

      try {
        const { page, perPage, rows, total } = await new GetAllUsers().execute({
          page: reqPage,
          perPage: reqPerPage,
        });

        throw new Error("Teste")

        res.status(200).json({ page, perPage, rows, total });
      } catch (error) {
        console.error(`[SERVER: GetAllUsers] ${error}`);
        res.status(400).json({ error: "Erro ao consultar os usuários." });
      }

      break;
    case "POST":
      break;

    default:
      res.status(500).json({ error: "Método não permitido." });
  }
}
