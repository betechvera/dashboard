import { PageResponse } from "@/models";
import { User } from "@/models/user";
import { db } from "../../../database";
import { users } from "../../../database/schema";
import { count } from "drizzle-orm";

export interface GetAllUsersRequest {
  page?: number;
  perPage: number;
}

type GetAllUsersResponse = PageResponse<User>;

export class GetAllUsers {
  async execute(req: GetAllUsersRequest): Promise<GetAllUsersResponse> {
    const { page = 1, perPage } = req;
    const offset = (page - 1) * perPage;

    const totalCountResult = (
      await db.select({ count: count() }).from(users)
    )[0].count;

    const dbRows = await db
      .select({
        id: users.id,
        username: users.username,
        name: users.name,
        lastName: users.last_name,
        email: users.email,
      })
      .from(users)
      .limit(perPage)
      .offset(offset);

    const rows = dbRows.map((user) => new User({ ...user }));

    return {
      page,
      perPage,
      rows,
      total: totalCountResult,
    };
  }
}
