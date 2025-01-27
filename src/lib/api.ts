import axios from "axios";
import nookies from "nookies";

export const api = axios.create({ baseURL: "/api" });

export const setAuthToken = (externalToken?: string) => {
  if (!api.defaults.headers.common["Authorization"]) {
    const token = externalToken || nookies.get(null, "token");
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

setAuthToken();
