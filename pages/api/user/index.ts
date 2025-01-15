import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/pages";
import { db } from "@/db";
import { users } from "@/db/schema";

type Data = {
  rows?: User[];
  total?: number;
  error?: string;
};

export default async function handler(
  { method, body }: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (method) {
    case "GET":
      try {
        const result = await db.select().from(users);

        res.status(200).json({ rows: result, total: result.length });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar usuários" });
      }
      break;
    case "POST":
      try {
        console.log(body)

        const { username, password, email } = body;

        const result = await db
          .insert(users)
          .values({ username, password, email }).returning();

        res.status(200).json({ rows: result, total: result.length });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao cadastrar usuário" });
      }
      break;

      default: res.status(500).json({ error: "Método não permitido." });
  }
}
