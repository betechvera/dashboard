import { useForm } from "react-hook-form";
import styles from "@/styles/login.module.css";
import { withAuth } from "@/lib/auth";
import { FirstLoginRequest } from "@/services/api/auth/first-login";
import { firstLogin } from "@/services/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { User } from "@/models/user";
import { useAuth } from "@/hooks/useAuth";

const Login: React.FC = () => {
  const router = useRouter();

  const { user, updateUser } = useAuth();

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<FirstLoginRequest & { confirm_new_password: string }>();

  const onSubmit = async (
    data: FirstLoginRequest & { confirm_new_password: string }
  ) => {
    const { new_password, confirm_new_password, name, last_name } = data;

    if (new_password !== confirm_new_password) {
      setError("confirm_new_password", {
        type: "manual",
        message: "As senhas não correspondem.",
      });
      return;
    }

    await firstLogin({ name, last_name, new_password })
      .then((response) => {
        
        updateUser({ name, last_name, id: user?.id! });

        toast.success(response.message, {
          position: "top-right",
          autoClose: 3000,
        });
        router.push("/");
      })
      .catch((error) => {
        setError("root", {
          type: "manual",
          message: error.response.data.error,
        });
      });
  };

  return (
    <div className="text-[#404040]  flex h-[100vh] justify-center items-center bg-cover bg-center p-5">
      <form
        className="min-w-[350px] max-w-[500px] w-[40%] p-12 bg-white rounded-3xl flex flex-col gap-6 shadow-xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold text-center">
            Primeiro Acesso!
          </h1>
          <h1 className="text-xl mt-2">Conclua seu cadastro:</h1>
          <div className="bg-[#19E066] h-2 w-[90%] rounded-full"></div>
        </div>
        <div className={styles.containerInput}>
          <label htmlFor="name">
            Nome: <span className="text-red-400">&lowast;</span>
          </label>
          <input
            placeholder="Digite o primeiro nome..."
            className={styles.inputField}
            type="text"
            id="name"
            {...register("name", {
              required: "* Primeiro nome é obrigatório.",
            })}
          />
          {errors.name && (
            <p className={styles.errorMessage}>{errors.name.message}</p>
          )}
        </div>
        <div className={styles.containerInput}>
          <label htmlFor="last_name">
            Sobrenome: <span className="text-red-400">&lowast;</span>
          </label>
          <input
            placeholder="Digite seu sobrenome..."
            className={styles.inputField}
            type="text"
            id="last_name"
            {...register("last_name", {
              required: "* Sobrenome é obrigatório.",
            })}
          />
          {errors.last_name && (
            <p className={styles.errorMessage}>{errors.last_name.message}</p>
          )}
        </div>
        <div className={styles.containerInput}>
          <label htmlFor="new_password">
            Nova senha: <span className="text-red-400">&lowast;</span>
          </label>
          <input
            placeholder="Insira sua senha..."
            className={styles.inputField}
            type="password"
            id="new_password"
            {...register("new_password", {
              required: "* Insira uma nova senha",
            })}
          />
          {errors.new_password && (
            <p className={styles.errorMessage}>{errors.new_password.message}</p>
          )}
        </div>
        <div className={styles.containerInput}>
          <label htmlFor="confirm_password">
            Confirmação da nova senha:{" "}
            <span className="text-red-400">&lowast;</span>
          </label>
          <input
            className={styles.inputField}
            placeholder="Confirme sua senha..."
            type="password"
            id="confirm_password"
            {...register("confirm_new_password", {
              required: "* Insira sua senha novamente.",
            })}
          />
          {errors.confirm_new_password && (
            <p className={`${styles.errorMessage}`}>
              &lowast; {errors.confirm_new_password.message}
            </p>
          )}
        </div>
        <div className={styles.containerButton}>
          <button className={styles.button} type="submit">
            Alterar senha
          </button>
        </div>
        {errors.root && (
          <p className={`${styles.errorMessage} text-center`}>
            &lowast; {errors.root.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;

export const getServerSideProps = withAuth();
