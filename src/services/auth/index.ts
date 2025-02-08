import { api } from "@/lib/api";
import { AuthRequest, AuthResponse } from "../api/auth/auth";
import { RefreshTokenResponse } from "../api/auth/refresh-token";
import { GetServerSidePropsContext } from "next";

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

export const refreshAuth = async (
  ctx?: GetServerSidePropsContext
): Promise<RefreshTokenResponse> => {
  const baseUrl = `${ctx?.req.headers["x-forwarded-proto"] || "http"}://${
    ctx?.req.headers.host
  }`;
  const response = await api.post<RefreshTokenResponse>(
    ctx ? `${baseUrl}/api/auth/refresh-token` : "/auth/refresh-token",
    {},
    { headers: ctx ? { Cookie: ctx?.req.headers.cookie || "" } : undefined }
  );
  return response.data;
};

export const authLogout = async (): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/auth/logout");
  return response.data;
};

export const firstLogin = async ({
  new_password,
  name,
  last_name,
}: {
  new_password: string;
  name: string;
  last_name: string;
}): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/auth/first-login", {
    new_password,
    name,
    last_name,
  });
  return response.data;
};
