import { refreshAuth } from "@/services/auth";
import axios from "axios";
import Router from "next/router";

export const api = axios.create({ baseURL: "/api" });

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("Aloo??");

    if (error.response?.status === 401) {
      if (error.response.data?.stringCode === "jwt_expired") {
        console.log("[AXIOS] Token expirado, tentando renovar...");

        try {
          await refreshAuth();
          // Reenvia a requisição original
          return api(originalRequest);
        } catch (refreshError) {
          console.error("[AXIOS] Erro ao renovar o token", refreshError);
          Router.push("/login");
        }
      } else if (error.response.data?.stringCode === "no_token") {
        console.log("no_token");
        Router.push("/login");
      }
    }

    return Promise.reject(error);
  }
);
