import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({path: ".env.local"})

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./.migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL_NON_POOLING! /*"postgres://postgres.iltctuwmnqmwedoovqrr:GENYLC19rBuboYHz@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"*/,
  },
});
