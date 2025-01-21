import z from "zod";

const envSchema = z.object({
  POSTGRES_URL_NON_POOLING: z.string().url(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.string(),
});

export const env = envSchema.parse(process.env);
