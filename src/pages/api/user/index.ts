import type { NextApiRequest, NextApiResponse } from "next";
import { PageResponse } from "@/models";
import { User } from "@/models/user";
import { GetAllUsers, GetAllUsersRequest } from "@/services/user/get-all-users";
import {
  CreateNewUser,
  CreateNewUserRequest,
} from "@/services/user/create-new-user";
import { ValidationError } from "@/errors/ValidationError";
import { NotFoundError } from "@/errors/NotFoundError";

export default async function handler(
  { method, body }: NextApiRequest,
  res: NextApiResponse<PageResponse<User> | { error?: string }>
) {
  switch (method) {
    case "GET":
      try {
        const { page: reqPage, perPage: reqPerPage } =
          body as GetAllUsersRequest;

        const { page, perPage, rows, total } = await new GetAllUsers().execute({
          page: reqPage,
          perPage: reqPerPage,
        });

        res.status(200).json({ page, perPage, rows, total });
      } catch (error) {
        console.error(`[SERVER: GetAllUsers] ${error}`);
        res.status(400).json({ error: "Erro ao consultar os usuários." });
      }

      break;
    case "POST":
      try {
        const { username, password, email, name, last_name } =
          body as CreateNewUserRequest;

        const newUser = await new CreateNewUser().execute({
          username,
          password,
          email,
          name,
          last_name,
        });

        const response = {
          page: 1,
          rows: [newUser],
          perPage: 10,
        } as PageResponse<User>;

        res.status(200).json(response);
      } catch (error) {
        console.error(`[SERVER: CreateNewUser] ${error}`);

        if (error instanceof ValidationError || error instanceof NotFoundError)
          res.status(400).json({ error: error.message });

        res.status(400).json({ error: "Erro ao cadastrar usuário." });
      }
      break;

    default:
      res.status(405).json({ error: "Método não permitido." });
  }
}
