import { api } from "@/lib/api";
import { User } from "@/models/user";
import { CreateNewUserRequest } from "../api/user/create-new-user";

export const createUser = async ({ username, email, password }: CreateNewUserRequest): Promise<User> => {
    const response = await api.post<User>("/user", { username, email, password })
    return response.data
}