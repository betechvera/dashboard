import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "../../styles/new-user.module.css";

export default function NewUserPage() {
    const [form, setForm] = useState({
        name: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formattedData = {
            name: form.name,
            last_name: form.lastName,
            username: form.username,
            email: form.email,
            password: form.password,
        };

        try {
            await axios.post("/api/user", formattedData);
            router.push("/user");
        } catch (error) {
            console.error("Erro ao adicionar usuário", error);
        }
    };

    return (
        <div className={styles.container}>
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
                <label className={styles.label}>
                    Senha:
                    <div className={styles.passwordContainer}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className={styles.passwordInput}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.eyeButton}>
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                </label>
                <button type="submit" className={styles.submitButton}>Salvar</button>
            </form>
        </div>
    );
}
