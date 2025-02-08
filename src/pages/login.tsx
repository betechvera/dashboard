import { AuthRequest } from "@/services/api/auth/auth";
import { useForm } from "react-hook-form";
import styles from "@/styles/login.module.css";
import { useAuth } from "@/hooks/useAuth";
import { GetServerSidePropsContext } from "next";
import { db } from "../../database";
import { users } from "../../database/schema";
import { count } from "drizzle-orm";

const Login: React.FC = () => {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthRequest>();

  const { login } = useAuth();

  const onSubmit = async (data: AuthRequest) => {
    await login(data).catch((error) => {
      setError("root", {
        type: "manual",
        message: error.response.data.error,
      });
    });
  };

  return (
    <div className="text-[#404040] flex h-[100vh] justify-center items-center bg-[url(/assets/bg-login.webp)] bg-cover bg-center p-5">
      <div>
        <form
          className="p-12 bg-white rounded-3xl flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl">Faça o seu login</h1>
            <div className="bg-[#19E066] h-2 w-[90%] rounded-full"></div>
          </div>
          <div className={styles.containerInput}>
            <label htmlFor="auth">
              E-mail ou Username <span className="text-red-400">&lowast;</span>
            </label>
            <input
              className={styles.inputField}
              type="text"
              id="auth"
              {...register("auth", {
                required: "* Insira usuário ou email.",
              })}
            />
            {errors.auth && (
              <p className={styles.errorMessage}>{errors.auth.message}</p>
            )}
          </div>
          <div className={styles.containerInput}>
            <label htmlFor="password">Sua senha <span className="text-red-400">&lowast;</span></label>
            <input
              className={styles.inputField}
              type="password"
              id="password"
              {...register("password", { required: "*Campo obrigatório" })}
            />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password.message}</p>
            )}
          </div>
          <div className={styles.containerButton}>
            <button className={styles.button} type="submit">
              Entrar
            </button>
          </div>
          {errors.root && (
            <p className={`${styles.errorMessage} text-center`}>
              &lowast;{errors.root.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  if (ctx.req.cookies.token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else if ((await db.select({ count: count() }).from(users))[0].count <= 0) {
    return {
      redirect: {
        destination: "/register",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
