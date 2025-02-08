import { User } from "@/models/user";
import { db } from "../../../../database";
import { users } from "../../../../database/schema";
import {
  compareCryptoPassword,
  generateCryptoPassword,
  generateRandomPassword,
  isValidEmail,
} from "@/lib/utils";
import { NotFoundError } from "@/errors/NotFoundError";
import { ValidationError } from "@/errors/ValidationError";
import { env } from "@/lib/env";

export type CreateFirstUserRequest = {
  username: string;
  email: string;
  admin_code: string;
};

type CreateFirstUserResponse = User;

export class CreateFirstUser {
  async execute(req: CreateFirstUserRequest): Promise<CreateFirstUserResponse> {
    const { username, email, admin_code } = req;

    if (!username)
      throw new NotFoundError({
        message: "Insira um nome de usuário.",
        stringCode: "not_username",
      });

    if (!email)
      throw new NotFoundError({
        message: "Insira um email.",
        stringCode: "not_email",
      });

    if (!isValidEmail(email))
      throw new ValidationError({
        message: "Insira um email válido.",
        stringCode: "invalid_email",
      });

    if (!compareCryptoPassword(admin_code, env.BCRYPT_ADMIN_CODE)) {
      throw new ValidationError({
        message: "Código de administrador inválido.",
        stringCode: "invalid_admin_code",
      });
    }

    const password = generateRandomPassword();

    const hashPassword = await generateCryptoPassword(password);

    const firstUser = await db.transaction(
      async (trx) =>
        await trx
          .insert(users)
          .values({
            username,
            name: null,
            last_name: null,
            email,
            password: hashPassword,
            admin: true,
          })
          .returning({
            id: users.id,
            email: users.email,
            username: users.username,
          })
          .then((data) => data[0])
    );

    return { ...firstUser, password };
  }
}
