import { db } from "../../../../database";
import { users } from "../../../../database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "@/lib/env";
import { NotFoundError } from "@/errors/NotFoundError";
import { ValidationError } from "@/errors/ValidationError";

export interface AuthRequest {
  auth?: string;
  password: string;
}

type AuthResponse = { token: string; refreshToken: string };

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

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token, refreshToken };
  }
}
