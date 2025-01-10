import { pgTable, text, bigint } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: bigint("id", { mode: "number" })
    .generatedAlwaysAsIdentity()
    .primaryKey()
    .notNull(),
  username: text("username").notNull().unique(),
  name: text("name"),
  last_name: text("last_name"),
  email: text("email").notNull(),
  password: text("password").notNull(),
});
