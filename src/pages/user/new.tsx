import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "../../styles/new-user.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CreatedUser {
    name: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

interface User {
    name: string;
    lastName?: string;
    last_name?: string;
    username: string;
    email: string;
    password?: string;
}

interface ApiResponse {
    page: number;
    perPage: number;
    rows: User[];
}

export default function NewUserPage() {
    const [form, setForm] = useState({
        name: "",
        lastName: "",
        username: "",
        email: "",
    });

    const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { data } = await axios.post<ApiResponse>("/api/user", {
                name: form.name,
                last_name: form.lastName,
                username: form.username,
                email: form.email,
            });

            if (data.rows && data.rows.length > 0) {
                setCreatedUser({
                    name: data.rows[0].name,
                    lastName: (data.rows[0] as any).last_name || "",
                    username: data.rows[0].username,
                    email: data.rows[0].email,
                    password: data.rows[0].password ?? "Senha gerada automaticamente",
                });

                toast.success("Usuário criado com sucesso!", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                toast.error("Erro ao criar usuário, tente novamente.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error: any) {
            toast.error("Erro ao criar usuário. Verifique os campos.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

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
                    <p><strong>Nome Completo:</strong> {createdUser.name} {createdUser.lastName}</p>
                    <p><strong>Usuário:</strong> {createdUser.username}</p>
                    <p><strong>Email:</strong> {createdUser.email}</p>
                    <div className={styles.passwordContainer}>
                        <p><strong>Senha:</strong> {showPassword ? createdUser.password : "••••••••"}</p>
                        <button onClick={() => setShowPassword(!showPassword)} className={styles.eyeButton}>
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                        <button onClick={() => copyToClipboard(createdUser.password)} className={styles.copyButton}>
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
            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>
                    Nome:
                    <input type="text" name="name" value={form.name} onChange={handleChange} required className={styles.input} />
                </label>
                <label className={styles.label}>
                    Sobrenome:
                    <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required className={styles.input} />
                </label>
                <label className={styles.label}>
                    Usuário:
                    <input type="text" name="username" value={form.username} onChange={handleChange} required className={styles.input} />
                </label>
                <label className={styles.label}>
                    Email:
                    <input type="email" name="email" value={form.email} onChange={handleChange} required className={styles.input} />
                </label>
                <button type="submit" className={styles.submitButton}>💾 Criar Usuário</button>
            </form>
        </div>
    );
}
