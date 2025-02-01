import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "@/lib/env";

export const client = postgres(env.POSTGRES_URL_NON_POOLING, {
  max: 10,
  idle_timeout: 30,
  connect_timeout: 5,
});
export const db = drizzle(client, { schema, logger: true });
