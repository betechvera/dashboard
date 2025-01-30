import { AuthRequest } from "@/services/api/auth/auth";
import { authenticate } from "@/services/auth";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const InputField = styled.input`
  padding: 10px 20px;
  border-radius: 10px;
  background-color: #f1f1f1;
  outline-width: 1px;
  outline-color: #108a3e;
`;


const ContainerInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ErrorMessage = styled.p`
  color: red;
`;

const ContainerButton = styled.div`
  position: relative;
  display: inline-block;

  &:after {
    content: "";
    height: 100%;
    width: 100%;
    padding: 4px;
    position: absolute;
    bottom: -15px;
    left: -4px;
    z-index: -1;
    background-color: #2b1800;
    border-radius: 5px;
  }
`;

const Button = styled.button`
  color: white;
  font-family: Helvetica, sans-serif;
  font-weight: bold;
  font-size: 24px;
  text-align: center;
  width: 100%;
  text-decoration: none;
  background-color: #19e066;
  display: block;
  position: relative;
  padding: 10px 0;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  text-shadow: 0px 1px 0px #000;
  box-shadow: inset 0 1px 0 #ffe5c4, 0 10px 0 #108a3e;

  &:active {
    top: 10px;
    background-color: #19e066;
    box-shadow: none;
  }
`;

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
        router.push("/user");
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
          <ContainerInput>
            <label htmlFor="auth">E-mail ou Username &lowast;</label>
            <InputField
              type="text"
              id="auth"
              {...register("auth", {
                required: "*Campo obrigatório",
              })}
            />
            {errors.auth && <ErrorMessage>{errors.auth.message}</ErrorMessage>}
          </ContainerInput>
          <ContainerInput>
            <label htmlFor="password">Sua senha &lowast;</label>
            <InputField
              type="password"
              id="password"
              {...register("password", { required: "*Campo obrigatório" })}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </ContainerInput>
          <ContainerButton>
            <Button type="submit">Entrar</Button>
          </ContainerButton>
          {errors.root && (
            <ErrorMessage className="text-center">
              &lowast;{errors.root.message}
            </ErrorMessage>
          )}
        </form>
      </div>
    </div>
  );
};


export default Login;

