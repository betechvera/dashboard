import { db } from "../../../../database";
import { users } from "../../../../database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { NotFoundError } from "@/errors/NotFoundError";
import { ValidationError } from "@/errors/ValidationError";
import { createRefreshToken, createToken } from "@/lib/utils";
import { UnauthorizedError } from "@/errors/UnauthorizedError";
import jwt from "jsonwebtoken";
import { env } from "@/lib/env";
import { User } from "@/models/user";
import { UpdateUserById } from "../user/update-user-by-id";
import { GetUserById } from "../user/get-user-by-id";

export interface FirstLoginRequest {
  new_password: string;
  name: string;
  last_name: string;
  first_login_token?: string;
}

export type FirstLoginResponse = { message: string };

export class FirstLogin {
  async execute(req: FirstLoginRequest): Promise<FirstLoginResponse> {
    const { new_password: password, first_login_token, name, last_name } = req;

    if (!password)
      throw new NotFoundError({
        message: "Insira uma nova senha.",
        stringCode: "not_username_email",
      });

    if (!name)
      throw new NotFoundError({
        message: "Insira seu primeiro nome.",
        stringCode: "not_name",
      });

    if (!last_name)
      throw new NotFoundError({
        message: "Insira seu sobrenome.",
        stringCode: "not_last_name",
      });

    if (!first_login_token) throw new UnauthorizedError({});

    const { id } = jwt.verify(
      first_login_token,
      env.FIRST_LOGIN_JWT_SECRET
    ) as User;

    const { first_login } = await new GetUserById().execute({ id });

    if (!first_login) {
      throw new ValidationError({
        message: "Usuário já fez o primeiro acesso.",
        stringCode: "just_first_login",
      });
    }

    await new UpdateUserById().execute({
      id,
      name,
      last_name,
      password,
      first_login: false,
    });

    return { message: "Primeira senha alterada com sucesso." };
  }
}
