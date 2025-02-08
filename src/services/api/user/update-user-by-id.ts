import { User } from "@/models/user";
import { db } from "../../../../database";
import { users } from "../../../../database/schema";
import { eq } from "drizzle-orm";
import { NotFoundError } from "@/errors/NotFoundError";
import { generateCryptoPassword } from "@/lib/utils";

export interface UpdateUserByIdRequest {
  id: number;
  username?: string;
  password?: string;
  email?: string;
  name?: string;
  last_name?: string;
  first_login?: boolean;
  admin?: boolean;
}

export type UpdateUserByIdResponse = User;

export class UpdateUserById {
  async execute(req: UpdateUserByIdRequest): Promise<UpdateUserByIdResponse> {
    const {
      id,
      username,
      password,
      email,
      name,
      last_name,
      admin,
      first_login,
    } = req;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .then((data) => data[0]);

    if (!user)
      throw new NotFoundError({
        message: "Usuário não enccontrado.",
        stringCode: "not_user",
      });

    const hashPassword = password
      ? await generateCryptoPassword(password)
      : undefined;

    const upadtedUser = await db
      .update(users)
      .set({
        username: username || user.username,
        password: hashPassword || user.password,
        email: email || user.email,
        name: name || user.name,
        last_name: last_name || user.last_name,
        first_login: first_login === undefined ? user.first_login : first_login,
        admin: admin === undefined ? user.admin : admin,
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        name: users.name,
        last_name: users.last_name,
      });

    return upadtedUser[0];
  }
}
