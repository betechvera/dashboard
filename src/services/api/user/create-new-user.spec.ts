// import { describe, expect, it } from "vitest";
// import { CreateNewUser } from "./create-new-user";
// import { User } from "@/models/user";
// import { db } from "../../../database";
// import { users } from "../../../database/schema";
// import { eq } from "drizzle-orm";
// import { PostgresError } from "postgres";
// import { NotFoundError } from "@/errors/NotFoundError";

// describe("Create User", async () => {
//   it("should be able to create an user", async () => {
//     const sut = new CreateNewUser();

//     await expect(
//       sut
//         .execute({
//           email: "teste1@teste.com",
//           username: "teste1",
//           password: "teste",
//         })
//         .then(async (data) => {
//           await db.delete(users).where(eq(users.id, data.id));
//           return data;
//         })
//     ).resolves.toBeInstanceOf(User);
//   });

//   it("should not be able to create a user, 'cause already exists an user using this username", async () => {
//     const sut = new CreateNewUser();

//     const firstUserTest = await sut.execute({
//       email: "teste2@teste.com",
//       username: "teste2",
//       password: "teste",
//     });

//     await expect(
//       sut.execute({
//         email: "teste3@teste.com",
//         username: "teste2",
//         password: "teste",
//       })
//     ).rejects.toThrow(PostgresError);

//     await db.delete(users).where(eq(users.id, firstUserTest.id));
//   });

//   it("should not be able to create a user, 'cause already exists an user using this email", async () => {
//     const sut = new CreateNewUser();

//     const firstUserTest = await sut.execute({
//       email: "teste4@teste.com",
//       username: "teste4",
//       password: "teste",
//     });

//     await expect(
//       sut.execute({
//         email: "teste4@teste.com",
//         username: "teste5",
//         password: "teste",
//       })
//     ).rejects.toThrow(PostgresError);

//     await db.delete(users).where(eq(users.id, firstUserTest.id));
//   });

//   it("should not be able to create a user, 'cause username is needed", async () => {
//     const sut = new CreateNewUser();

//     await expect(
//       sut.execute({
//         email: "teste6@teste.com",
//         username: "",
//         password: "teste",
//       })
//     ).rejects.toThrow(NotFoundError);
//   });

//   it("should not be able to create a user, 'cause password is needed", async () => {
//     const sut = new CreateNewUser();

//     await expect(
//       sut.execute({
//         email: "teste7@teste.com",
//         username: "teste7",
//         password: "",
//       })
//     ).rejects.toThrow(NotFoundError);
//   });

//   it("should not be able to create a user, 'cause email is needed", async () => {
//     const sut = new CreateNewUser();

//     await expect(
//       sut.execute({
//         email: "",
//         username: "teste8",
//         password: "teste",
//       })
//     ).rejects.toThrow(NotFoundError);
//   });
// });
