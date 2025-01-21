import { User } from "@/models/user";
import { db } from "../../../database";
import { users } from "../../../database/schema";
import { eq } from "drizzle-orm";

export interface GetUserByIdRequest {
  id: number;
}

type GetUserByIdResponse = User;

export class GetUserById {
  async execute(req: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    const { id } = req;

    const user = await db
      .select({
        id: users.id,
        username: users.username,
        name: users.name,
        lastName: users.last_name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, id));

    return user[0];
  }
}
