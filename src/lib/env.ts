import z from "zod";

const envSchema = z.object({
  POSTGRES_URL_NON_POOLING: z.string().url(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.string(),
  BCRYPT_SALT_ROUNDS: z.string().transform((val) => Number(val)),
  ADMIN_CODE: z.string(),
  FIRST_LOGIN_JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
