import { AuthRequest } from "@/services/api/auth/auth";
import { authenticate } from "@/services/auth";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import styles from "@/styles/login.module.css";

const Login: React.FC = () => {
  const router = useRouter();

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthRequest>();

  const onSubmit = async (data: AuthRequest) => {
    await authenticate(data)
      .then(() => {
        router.push("/");
      })
      .catch((err) => {
        setError("root", { type: "manual", message: err.response.data.error });
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
            <label htmlFor="auth">E-mail ou Username &lowast;</label>
            <input className={styles.inputField}
              type="text"
              id="auth"
              {...register("auth", {
                required: "*Campo obrigatório",
              })}
            />
            {errors.auth && <p className={styles.errorMessage}>{errors.auth.message}</p>}
          </div>
          <div className={styles.containerInput}>
            <label htmlFor="password">Sua senha &lowast;</label>
            <input className={styles.inputField}
              type="password"
              id="password"
              {...register("password", { required: "*Campo obrigatório" })}
            />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password.message}</p>
            )}
          </div>
          <div className={styles.containerButton}>
            <button className={styles.button} type="submit">Entrar</button>
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

