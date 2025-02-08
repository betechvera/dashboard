import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/models/user";
import { ValidationError } from "@/errors/ValidationError";
import { NotFoundError } from "@/errors/NotFoundError";
import {
  CreateFirstUser,
  CreateFirstUserRequest,
} from "@/services/api/user/create-first-user";
import { env } from "@/lib/env";
import { UnauthorizedError } from "@/errors/UnauthorizedError";

export default async function handler(
  { method, body }: NextApiRequest,
  res: NextApiResponse<User | { error?: string }>
) {
  if (method !== "POST")
    res.status(405).json({ error: "Método não permitido." });

  try {
    const { username, email, admin_code } = body as CreateFirstUserRequest;

    if (!admin_code)
      throw new NotFoundError({
        message: "Código de adminstrador obrigatório.",
        stringCode: "not_admin_code",
      });

    if (admin_code !== env.ADMIN_CODE)
      throw new UnauthorizedError({
        message: "Código de administrador inválido.",
        stringCode: "invalid_admin_code",
      });

    const firstUser = await new CreateFirstUser().execute({
      username,
      email,
      admin_code,
    });

    res.status(200).json({ ...firstUser });
  } catch (error) {
    console.error(`[SERVER: CreateFirstUser] ${error}`);

    if (
      error instanceof ValidationError ||
      error instanceof NotFoundError ||
      error instanceof UnauthorizedError
    )
      res.status(error.statusCode).json({ error: error.message });

    res.status(400).json({ error: "Erro ao cadastrar usuário." });
  }
}
