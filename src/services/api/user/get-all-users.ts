import { PageResponse } from "@/models";
import { User } from "@/models/user";
import { db } from "../../../../database";
import { users } from "../../../../database/schema";
import { count } from "drizzle-orm";

export interface GetAllUsersRequest {
  page?: number;
  perPage?: number;
}

type GetAllUsersResponse = PageResponse<User>;

export class GetAllUsers {
  async execute(req: GetAllUsersRequest): Promise<GetAllUsersResponse> {
    const { page = 1, perPage = 10 } = req;

    const perPageNumber = Number(perPage);
    const pageNumber = Number(page);

    const offset = (pageNumber - 1) * perPageNumber;

    const [{ count: total }] = await db.select({ count: count() }).from(users);

    const rows = await db
      .select({
        id: users.id,
        username: users.username,
        name: users.name,
        last_name: users.last_name,
        email: users.email,
      })
      .from(users)
      .orderBy(users.id)
      .limit(perPageNumber)
      .offset(offset);

    return {
      page,
      perPage,
      rows,
      total,
    };
  }
}
