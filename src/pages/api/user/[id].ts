import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/models/user";
import { GetUserById } from "@/services/user/get-user-by-id";
import { NotFoundError } from "@/errors/NotFoundError";
import { DeleteUserById } from "@/services/user/delete-user-by-id";
import {
  UpdateUserById,
  UpdateUserByIdRequest,
} from "@/services/user/update-user-by-id";

export default async function handler(
  { method, query, body }: NextApiRequest,
  res: NextApiResponse<User | { error?: string } | { message: string }>
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
        if (error instanceof NotFoundError)
          res.status(400).json({ error: error.message });

        res.status(400).json({ error: "Erro ao consultar os usuários." });
      }
      break;

    case "DELETE":
      try {
        const { id } = query;

        const numberId = Number(id);

        if (typeof numberId !== "number")
          res.status(400).json({ error: "ID precisa ser um número." });

        const response = await new DeleteUserById().execute({ id: numberId });

        res.status(200).json(response);
      } catch (error) {
        console.error(`[SERVER: CreateNewUser] ${error}`);

        if (error instanceof NotFoundError)
          res.status(400).json({ error: error.message });

        res.status(400).json({ error: "Erro ao apagar usuário." });
      }
      break;

    case "PUT":
      try {
        const { id, email, last_name, name, password, username } =
          body as UpdateUserByIdRequest;

        console.log(username);

        const userUpdated = await new UpdateUserById().execute({
          id,
          email,
          last_name,
          name,
          password,
          username,
        });

        res.status(200).json(userUpdated);
      } catch (error) {
        console.error(`[SERVER: CreateNewUser] ${error}`);

        if (error instanceof NotFoundError)
          res.status(400).json({ error: error.message });

        res.status(400).json({ error: "Erro ao editar usuário." });
      }
      break;

    default:
      res.status(405).json({ error: "Método não permitido." });
  }
}
