import bcrypt from "bcrypt";
import crypto from "crypto";
import dayjs from "dayjs";
import { env } from "@/lib/env";
import jwt from "jsonwebtoken";
import { User } from "@/models/user";

export const generateCryptoPassword = async (
  password: string
): Promise<string> => {
  return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS).catch(() => {
    throw new Error("Falha ao criptografar senha | crypt_password");
  });
};

export const compareCryptoPassword = (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const UserModelMap: { [key: string]: string } = {
  email: "Email",
  username: "Usuário",
  password: "Senha",
  name: "Nome",
  last_name: "Sobrenome",
};

export const generateRandomPassword = (length = 12) => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}?";
  const passwordArray = Array.from(
    crypto.randomFillSync(new Uint8Array(length))
  );
  const password = passwordArray
    .map((byte) => charset[byte % charset.length])
    .join("");

  return password;
};

export const thisDateHour = () => dayjs().format("DD/MM/YYYY - HH:mm:ss");

export const createToken = ({
  time,
  user,
  secret,
}: {
  time?: number;
  user: User;
  secret?: string;
}) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    secret || env.JWT_SECRET,
    { expiresIn: time || "15m" }
  );
};

export const createRefreshToken = ({
  time,
  user,
}: {
  time?: number;
  user: User;
}) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    env.JWT_SECRET,
    { expiresIn: time || "7d" }
  );
};
