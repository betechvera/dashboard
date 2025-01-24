import React from "react";
import { useForm } from "react-hook-form";
import styles from "./login.module.css";

interface FormData {
  email: string;
  password: string;
}

/*
.campoInput {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.remember {
    display: flex;
    gap: 5px;
}

.button {
    position: relative;
    display: inline-block;
}

.button button {
    color: white;
    font-family: Helvetica, sans-serif;
    font-weight: bold;
    font-size: 24px;
    text-align: center;
    text-decoration: none;
    background-color: #19E066;
    display: block;
    position: relative;
    padding: 10px 0;
    border: none; 
    cursor: pointer;
    border-radius: 5px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0); 
    text-shadow: 0px 1px 0px #000; 
    filter: dropshadow(color=#000, offx=0px, offy=1px); 
    box-shadow: inset 0 1px 0 #FFE5C4, 0 10px 0 #108a3e; 
}

.button button:active {
    top: 2px; 
    background-color: #19E066;
}

.button:after {
    content: "";
    height: 100%;
    width: 100%;
    padding: 4px;
    position: absolute;
    bottom: -15px;
    left: -4px;
    z-index: -1;
    background-color: #2B1800;
    border-radius: 5px;
}

.inputField {
    padding: 10px 20px;
    border-radius: 10px;
    background-color: #f1f1f1;
    outline-width: 1px;
    outline-color: #108a3e;
}

.link {
    color: rgb(0, 179, 12);
    font-weight: 500;
}

.paragraf {
    text-align: center;
}

.campoInput {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.remember {
    display: flex;
    gap: 5px;
}

.button {
    position: relative;
    display: inline-block;
}

.button button {
    color: white;
    font-family: Helvetica, sans-serif;
    font-weight: bold;
    font-size: 24px;
    text-align: center;
    text-decoration: none;
    background-color: #19E066;
    display: block;
    position: relative;
    width: 100%;
    padding: 10px 0;
    border: none; 
    cursor: pointer; 
    border-radius: 5px; 
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0); 
    text-shadow: 0px 1px 0px #000; 
    filter: dropshadow(color=#000, offx=0px, offy=1px); 
    box-shadow: inset 0 1px 0 #FFE5C4, 0 10px 0 #108a3e; 
}

.button button:active {
    top: 2px; 
    background-color: #19E066;
}

.button:after {
    content: "";
    height: 100%;
    width: 100%;
    padding: 4px;
    position: absolute;
    bottom: -15px;
    left: -4px;
    z-index: -1;
    background-color: #2B1800;
    border-radius: 5px;
}

.inputField {
    padding: 10px 20px;
    border-radius: 10px;
    background-color: #f1f1f1;
}

.link {
    color: rgb(0, 179, 12);
    font-weight: 500;
}

.paragraf {
    text-align: center;
}

.errorMessage{
    color: red;
}


*/

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  /*

  */

  return (
    <div className="text-[#404040] flex h-[100vh] justify-center items-center bg-[url(/assets/bg-login.webp)] bg-cover bg-center p-5">
      <div>
        <form className="p-12 bg-white rounded-3xl flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl">Faça o seu login</h1>
            <div className="bg-[#19E066] h-2 w-[90%] rounded-full"></div>
          </div>
          <div className={styles.campoInput}>
            <label htmlFor="email">Seu e-mail &lowast;</label>
            <input
              className={styles.inputField}
              type="text"
              id="email"
              {...register("email", {
                required: "Campo obrigatório*",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Formato de email inválido*",
                },
              })}
            />
            {errors.email && (
              <p className={styles.errorMessage}>{errors.email.message}</p>
            )}
          </div>
          <div className={styles.campoInput}>
            <label htmlFor="password">Sua senha &lowast;</label>
            <input
              className={styles.inputField}
              type="password"
              id="password"
              {...register("password", { required: "Campo obrigatório*" })}
            />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password.message}</p>
            )}
          </div>
          <div className={styles.remember}>
            <input type="checkbox" />
            <p>Lembrar-me</p>
          </div>
          <div className={styles.button}>
            <button type="submit">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
