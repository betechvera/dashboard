import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import { User } from "@/models/user";
import { authenticate, authLogout } from "@/services/auth";
import { AuthRequest } from "@/services/api/auth/auth";
import { toast, ToastContainer } from "react-toastify";
import nookies from "nookies";
import { UpdateUserByIdRequest } from "@/services/api/user/update-user-by-id";

// Definindo o contexto de autenticação
interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: AuthRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: UpdateUserByIdRequest) => void;
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
    const token = nookies.get().token;
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
    return await authenticate(data).then(({ user }) => {
      router.push("/");
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
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

  const updateUser = ({
    name,
    last_name,
    email,
    id,
    username,
    admin,
    first_login,
  }: UpdateUserByIdRequest) => {
    const localUser: User = JSON.parse(localStorage.getItem("user") || "{}");

    localUser.name = name ?? localUser.name;
    localUser.last_name = last_name ?? localUser.last_name;
    localUser.id = id ?? localUser.id;
    localUser.email = email ?? localUser.email;
    localUser.username = username ?? localUser.username;
    localUser.admin = admin !== undefined ? admin : localUser.admin;
    localUser.first_login =
      first_login !== undefined ? first_login : localUser.first_login;

    setUser(localUser);

    localStorage.setItem("user", JSON.stringify(localUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, updateUser }}
    >
      <ToastContainer />
      {children}
    </AuthContext.Provider>
  );
};
