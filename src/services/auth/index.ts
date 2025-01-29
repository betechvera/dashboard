import { api } from "@/lib/api";
import { AuthRequest, AuthResponse } from "../api/auth/auth";
import { RefreshTokenResponse } from "../api/auth/refresh-token";

export const authenticate = async ({
  auth,
  password,
}: AuthRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", {
    auth,
    password,
  });
  return response.data;
};

export const refreshAuth = async (): Promise<RefreshTokenResponse> => {
  const response = await api.post<RefreshTokenResponse>(`/auth/refresh-token`);
  return response.data;
};
