import { User } from "@/models/user";
import { db } from "../../../database";
import { users } from "../../../database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "@/lib/env";
import { NotFoundError } from "@/errors/NotFoundError";
import { ValidationError } from "@/errors/ValidationError";

export interface AuthRequest {
  email?: string;
  username?: string;
  password: string;
}

type AuthResponse = string;

export class Auth {
  async execute(req: AuthRequest): Promise<AuthResponse> {
    const { email, username = "", password } = req;

    if (!email && !username)
      throw new NotFoundError({
        message: "Insira um usuário ou email.",
        stringCode: "not_username_email",
      });

    if (!password)
      throw new NotFoundError({
        message: "Insira uma senha.",
        stringCode: "not_password",
      });

    const user = await db
      .select()
      .from(users)
      .where(email ? eq(users.email, email) : eq(users.username, username))
      .then((data) => data[0]);

    if (!user)
      throw new NotFoundError({
        message: "Usuário ou email não encontrado.",
        stringCode: "not_user",
      });

    const isMatchPassword = await bcrypt.compare(password, user.password);

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

    return token;
  }
}
