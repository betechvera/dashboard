import { db } from "../../../../database";
import { users } from "../../../../database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "@/lib/env";
import { NotFoundError } from "@/errors/NotFoundError";
import { ValidationError } from "@/errors/ValidationError";
import { createRefreshToken, createToken } from "@/lib/utils";
import { User } from "@/models/user";

export interface AuthRequest {
  auth?: string;
  password: string;
}

export type AuthResponse = {
  token: string;
  refreshToken: string;
  first_login_token?: string;
  user: User;
};

export class Auth {
  async execute(req: AuthRequest): Promise<AuthResponse> {
    const { auth = "", password } = req;

    if (!auth)
      throw new NotFoundError({
        message: "Insira um usuário ou email.",
        stringCode: "not_username_email",
      });

    if (!password)
      throw new NotFoundError({
        message: "Insira uma senha.",
        stringCode: "not_password",
      });

    let user = await db
      .select()
      .from(users)
      .where(eq(users.email, auth))
      .then((data) => data[0]);

    if (!user)
      user = await db
        .select()
        .from(users)
        .where(eq(users.username, auth))
        .then((data) => data[0]);

    // if (!user)
    //   throw new NotFoundError({
    //     message: "Usuário ou email não encontrado.",
    //     stringCode: "not_user",
    //   });

    const isMatchPassword = await bcrypt.compare(
      password,
      user ? user.password : ""
    );

    if (!isMatchPassword)
      throw new ValidationError({
        message: "As credenciais não coincidem.",
        stringCode: "invalid_credentials",
      });

    const token = createToken({ user });

    const refreshToken = createRefreshToken({ user });

    let first_login_token;

    if (user.first_login) {
      first_login_token = createToken({
        user,
        secret: env.FIRST_LOGIN_JWT_SECRET,
      });
    }

    return {
      token,
      refreshToken,
      first_login_token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        last_name: user.last_name,
        admin: user.admin,
      },
    };
  }
}
