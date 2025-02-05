import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string } | { error?: string }>
) {
  const { method, body } = req;

  if (method !== "POST") {
    res.status(405).json({ error: "Método não permitido." });
  }
  const cookies = new Cookies(req, res);

  cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });

  cookies.set("refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });

  return res.status(200).json({ message: "Logout realizado com sucesso." });
}
