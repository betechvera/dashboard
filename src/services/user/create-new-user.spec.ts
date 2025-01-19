import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CreateNewUser } from "./create-new-user";
import { User } from "@/models/user";
import { db } from "../../../database";
import { users } from "../../../database/schema";
import { eq } from "drizzle-orm";
import { PostgresError } from "postgres";

describe("Create User", () => {
  it("should be able to create an user", () => {
    db.transaction(async (tx) => {
      const sut = new CreateNewUser();

      expect(
        sut.execute({
          email: "teste1@teste.com",
          username: "teste1",
          password: "teste",
        })
      ).resolves.toBeInstanceOf(User);
    });
  });

  it("should not be able to create a user, 'cause already exists an user using this username", () => {
    db.transaction(async () => {
      const sut = new CreateNewUser();

      await sut.execute({
        email: "teste1@teste.com",
        username: "teste1",
        password: "teste",
      });

      await expect(
        sut.execute({
          email: "teste2@teste.com",
          username: "teste1",
          password: "teste",
        })
      ).rejects.toThrow(PostgresError);
    });
  });
});
