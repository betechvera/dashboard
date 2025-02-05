import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import nookies from "nookies";
import { User } from "@/models/user";
import { authenticate, authLogout } from "@/services/auth";
import { AuthRequest } from "@/services/api/auth/auth";
import { toast, ToastContainer } from "react-toastify";

// Definindo o contexto de autenticação
interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: AuthRequest) => Promise<void>;
  logout: () => void;
}

// Criando o contexto com valores padrões
export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

// Componente Provider que envolve a aplicação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;
  const router = useRouter();

  useEffect(() => {
    const token = nookies.get(null).token;

    if (token) {
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (savedUser && savedUser.id) {
        setUser(savedUser);
      } else {
        logout();
      }
    }
  }, []);

  const login = async (data: AuthRequest) => {
    return await authenticate(data).then(() => {
      router.push("/");
    });
  };

  const logout = async () => {
    await authLogout().then((data) => {
      setUser(null);
      localStorage.removeItem("user");
      router.push("/login");
      toast.success(data.message, {
        autoClose: 2000,
      });
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      <ToastContainer />
      {children}
    </AuthContext.Provider>
  );
};
