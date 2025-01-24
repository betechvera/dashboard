import { User } from "@/models/user";
import { db } from "../../../../database";
import { users } from "../../../../database/schema";
import { generateCryptoPassword, isValidEmail } from "@/lib/utils";
import { NotFoundError } from "@/errors/NotFoundError";
import { ValidationError } from "@/errors/ValidationError";

export type CreateNewUserRequest = {
  username: string;
  name?: string | null;
  last_name?: string | null;
  email: string;
  password: string;
};

type CreateNewUserResponse = User;

export class CreateNewUser {
  async execute(req: CreateNewUserRequest): Promise<CreateNewUserResponse> {
    const { username, name = null, last_name = null, email, password } = req;

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

    if (!password)
      throw new NotFoundError({
        message: "Insira uma senha.",
        stringCode: "not_password",
      });

    if (!isValidEmail(email))
      throw new ValidationError({
        message: "Insira um email válido.",
        stringCode: "invalid_email",
      });

    const hashPassword = await generateCryptoPassword(password);

    const newUser = await db.transaction(
      async (trx) =>
        await trx
          .insert(users)
          .values({ username, name, last_name, email, password: hashPassword })
          .returning({
            id: users.id,
            username: users.username,
            name: users.name,
            last_name: users.last_name,
            email: users.email,
          })
          .then((data) => data[0])
    );

    return newUser;
  }
}
