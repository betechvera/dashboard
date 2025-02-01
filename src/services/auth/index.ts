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
  console.log(ctx?.req.headers.host);
  console.log(ctx?.req.headers["x-forwarded-proto"]);
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
