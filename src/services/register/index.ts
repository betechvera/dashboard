import { api } from "@/lib/api";
import { CreateFirstUserRequest } from "../api/user/create-first-user";
import { User } from "@/models/user";

export const registerFirstUser = async ({
  username,
  email,
  admin_code,
}: CreateFirstUserRequest): Promise<User> => {
  const response = await api.post<User>("/register", {
    username,
    email,
    admin_code,
  });
  return response.data;
};
