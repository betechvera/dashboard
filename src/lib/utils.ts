import bcrypt from "bcrypt";
import crypto from "crypto";

export const generateCryptoPassword = async (
  password: string
): Promise<string> => {
  return bcrypt.hash(password, 10).catch(() => {
    throw new Error("Falha ao criptografar senha | crypt_password");
  });
};

export const compareCryptoPassword = async (
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
