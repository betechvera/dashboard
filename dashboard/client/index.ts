import { Pool } from "pg";

export const pool = new Pool({
  connectionString:
    "postgres://postgres.iltctuwmnqmwedoovqrr:GENYLC19rBuboYHz@aws-0-sa-east-1.pooler.supabase.com:5432/postgres",
  ssl: {
    rejectUnauthorized: false,
  },
});

