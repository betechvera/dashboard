import { pgTable, text, bigint, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: bigint("id", { mode: "number" })
    .generatedAlwaysAsIdentity()
    .primaryKey()
    .notNull(),
  username: text("username").notNull().unique(),
  name: text("name"),
  last_name: text("last_name"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  first_login: boolean("first_login").notNull().default(true),
  admin: boolean("admin").notNull().default(false),
});
