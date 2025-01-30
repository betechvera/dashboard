import { db } from "../../../../database";
import { users } from "../../../../database/schema";
import { eq } from "drizzle-orm";
import { NotFoundError } from "@/errors/NotFoundError";

export interface DeleteUserByIdRequest {
  id: number;
}

export type DeleteUserByIdResponse = { message: string };

export class DeleteUserById {
  async execute(req: DeleteUserByIdRequest): Promise<DeleteUserByIdResponse> {
    const { id } = req;

    const user = await db.select().from(users).where(eq(users.id, id));

    if (!user)
      throw new NotFoundError({
        message: "Usuário não enccontrado.",
        stringCode: "not_user",
      });

    await db.delete(users).where(eq(users.id, id));

    return { message: "Usuário deletado com sucesso." };
  }
}
