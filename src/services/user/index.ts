import { api } from "@/lib/api";
import { User } from "@/models/user";
import { CreateNewUserRequest } from "../api/user/create-new-user";
import { GetAllUsersRequest } from "../api/user/get-all-users";
import { PageResponse } from "@/models";
import { DeleteUserById, DeleteUserByIdResponse } from "../api/user/delete-user-by-id";

export const createUser = async ({
  username,
  email,
  name = null,
  last_name = null,
}: CreateNewUserRequest): Promise<PageResponse<User>> => {
  const response = await api.post<PageResponse<User>>("/user", { username, email, name, last_name });
  return response.data;
};

export const getAllUsers = async ({
  perPage,
  page,
}: GetAllUsersRequest): Promise<PageResponse<User>> => {
  const response = await api.get<PageResponse<User>>(`/user`, {
    params: { page, perPage },
  });
  return response.data;
};

export const deleteUser = async (id: number): Promise<DeleteUserByIdResponse> => {
  const response = await api.delete<DeleteUserByIdResponse>(`/user/${id}`);
  return response.data;
};
