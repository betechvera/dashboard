import styles from "@/styles/new-user.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { users } from "../../database/schema";
import { db } from "../../database";
import { count } from "drizzle-orm";
import { useAuth } from "@/hooks/useAuth";
import { CreateFirstUserRequest } from "@/services/api/user/create-first-user";
import { registerFirstUser } from "@/services/register";

export default function Register() {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateFirstUserRequest>();

  const onSubmit = async (data: CreateFirstUserRequest) => {
    await registerFirstUser({ ...data })
      .then((response) => {
        toast.success("Usuário administrador criado com sucesso!", {
          position: "top-right",
          autoClose: 3000,
        });
        login({ auth: response.username, password: response.password! });
      })
      .catch((error) => {
        toast.error(error.response.data.error, {
          position: "top-right",
          autoClose: 3000,
        });
        setError("root", {
          type: "manual",
          message: error.response.data.error,
        });
      });
  };

  return (
    <div className="h-[100vh] flex items-center">
      <div className={styles.container}>
        <h1 className={styles.title}>Criar Primeiro Usuário</h1>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <label htmlFor="username" className={styles.label}>
            <span>
              Usuário: <span className="text-red-400">&lowast;</span>
            </span>
            <input
              type="text"
              {...register("username", {
                required: "* Insira um nome de usuário.",
              })}
              className={styles.input}
            />
          </label>
          <label htmlFor="email" className={styles.label}>
            <span>
              Email:{" "}
              <span className="text-red-400 mt-2 ml-2 font-normal">
                &lowast;
              </span>
            </span>
            <input
              type="email"
              {...register("email", { required: "* Insira um email válido." })}
              className={styles.input}
            />
            {errors.email && (
              <p className="text-red-600 mt-2 ml-2 font-normal">
                {errors.email.message as string}
              </p>
            )}
          </label>
          <label htmlFor="email" className={styles.label}>
            <span>
              Código de Administrador:{" "}
              <span className="text-red-400">&lowast;</span>
            </span>
            <input
              type="password"
              {...register("admin_code", { required: "Campo obrigatório." })}
              className={styles.input}
            />
            {errors.admin_code && (
              <p className="text-red-600 mt-2 ml-2 font-normal">
                &lowast; {errors.admin_code.message as string}
              </p>
            )}
          </label>
          <button type="submit" className={styles.submitButton}>
            💾 Criar Usuário
          </button>
        </form>
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  if ((await db.select({ count: count() }).from(users))[0].count > 0) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
