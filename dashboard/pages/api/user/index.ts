import type { NextApiRequest, NextApiResponse } from "next";
import { pool } from "@/client";
import { User } from "@/pages";

type Data = {
  data?: User[];
  error?: string;
};

export default async function handler(
  { method }: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (method !== "GET")
    res.status(400).json({ error: "Método não habilitado para essa rota." });

  try {
    const client = await pool.connect();
    const result = await client.query<User>("SELECT * FROM users");
    client.release();

    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
}
