import React from "react";
import { useForm } from "react-hook-form";
import styles from "./login.module.css";

interface FormData {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        console.log(data);
    };

    return (
        <div className={styles.containerAll}>
            <div>
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.containerTitle}>
                        <h1 className={styles.title}>Faça o seu login</h1>
                        <div className={styles.bar}></div>
                    </div>
                    <div className={styles.campoInput}>
                        <label htmlFor="email">Seu e-mail*</label>
                        <input
                            className={styles.inputField}
                            type="email"
                            id="email"
                            {...register('email', {
                                required: 'Campo obrigatório*',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: 'Formato de email inválido'
                                }
                            })}
                        />
                        {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
                    </div>
                    <div className={styles.campoInput}>
                        <label htmlFor="password">Sua senha*</label>
                        <input
                            className={styles.inputField}
                            type="password"
                            id="password"
                            {...register('password', { required: 'Campo obrigatório*' })}
                        />
                        {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
                    </div>
                    <div className={styles.remember}>
                        <input type="checkbox" />
                        <p>Lembrar-me</p>
                    </div>
                    <div className={styles.button}>
                        <button type="submit" >
                            Entrar
                        </button>
                    </div>
                    {/* <p className={styles.paragraf}>
                        Esqueceu sua senha?
                        <a className={styles.link} href="/recovery"> Clique aqui!</a>
                    </p> */}
                </form>
            </div>
        </div>
    );
}

export default Login;