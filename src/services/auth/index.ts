import { api } from "@/lib/api";
import { AuthRequest } from "../api/auth/auth";


export const authenticate = async ({ auth, password }: AuthRequest): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>("/auth/login", { auth, password })
    return response.data
}