import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/new-user.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User } from "@/models/user";
import { createUser } from "@/services/user";
import { useForm } from "react-hook-form";
import { CreateNewUserRequest } from "@/services/api/user/create-new-user";


export default function NewUserPage() {

    const [createdUser, setCreatedUser] = useState<User | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<CreateNewUserRequest>();

    const onSubmit = async (data: CreateNewUserRequest) => {

        // console.log(data)
        await createUser({ ...data }).then(response => {
            setCreatedUser(response.rows[0]);

            toast.success("Usuário criado com sucesso!", {
                position: "top-right",
                autoClose: 3000,
            });
        }).catch(error => {
            toast.error(error.response.data.error, {
                position: "top-right",
                autoClose: 3000,
            });
            setError("root", { type: "manual", message: error.response.data.error });
        });
    }


    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("📋 Senha copiada para a área de transferência!", {
            position: "top-right",
            autoClose: 2000,
        });
    };

    if (createdUser) {
        return (
            <div className={styles.container}>
                <ToastContainer /> {/* 🔥 Adicionando o ToastContainer aqui */}
                <h1 className={styles.title}>Usuário Criado com Sucesso! 🎉</h1>
                <div className={styles.userInfo}>
                    <p><strong>Nome Completo:</strong> {createdUser.name} {createdUser.last_name}</p>
                    <p><strong>Usuário:</strong> {createdUser.username}</p>
                    <p><strong>Email:</strong> {createdUser.email}</p>
                    <div className={styles.passwordContainer}>
                        <p><strong>Senha:</strong> {showPassword ? createdUser.password : "••••••••"}</p>
                        <button onClick={() => setShowPassword(!showPassword)} className={styles.eyeButton}>
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                        <button onClick={() => copyToClipboard(createdUser.password!)} className={styles.copyButton}>
                            📋 Copiar
                        </button>
                    </div>
                </div>
                <button onClick={() => router.push("/user")} className={styles.backButton}>
                    🔙 Voltar para Usuários
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <ToastContainer />
            <h1 className={styles.title}>Adicionar Novo Usuário</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <label htmlFor="name" className={styles.label}>
                    Nome: <span className="text-red-400">*</span>
                    <input type="text" {...register("name", { required: "*Insi" })} className={styles.input} />
                    {errors.name && <p className="text-red-600">{errors.name.message as string}</p>}
                </label>
                <label htmlFor="last_name" className={styles.label}>
                    Sobrenome: <span className="text-red-400">*</span>
                    <input type="text" {...register("last_name", { required: "*Campo obrigatório" })} className={styles.input} />
                    {errors.last_name && <p className="text-red-600">{errors.last_name.message as string}</p>}
                </label>
                <label htmlFor="auth" className={styles.label}>
                    Usuário: <span className="text-red-400">*</span>
                    <input type="text" {...register("username")} className={styles.input} />
                </label>
                <label htmlFor="auth" className={styles.label}>
                    Email: <span className="text-red-400">*</span>
                    <input type="email" {...register("email", { required: "*Campo obrigatório" })} className={styles.input} />
                    {errors.email && <p className="text-red-600">{errors.email.message as string}</p>}
                </label>
                <button type="submit" className={styles.submitButton}>💾 Criar Usuário</button>
            </form>
        </div>
    );
}
