import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "../../styles/edit-user.module.css"; // 🔥 Importa o CSS Module

interface User {
    id: number;
    name: string;
    lastName: string;
    username: string;
    email: string;
}

export default function EditUserPage() {
    const router = useRouter();
    const { id } = router.query;

    const [form, setForm] = useState<User>({
        id: 0,
        name: "",
        lastName: "",
        username: "",
        email: "",
    });

    useEffect(() => {
        if (id) {
            axios
                .get<User>(`/api/user/${id}`)
                .then(({ data }) => {
                    setForm({
                        id: data.id,
                        name: data.name,
                        lastName: data.lastName,
                        username: data.username,
                        email: data.email,
                    });
                })
                .catch((error) => console.error("Erro ao buscar usuário:", error));
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formattedData = {
            name: form.name,
            last_name: form.lastName, // 🔥 Converte `lastName` para `last_name`
            username: form.username,
            email: form.email,
        };

        try {
            await axios.put(`/api/user/${id}`, formattedData);
            router.push("/user");
        } catch (error) {
            console.error("Erro ao editar usuário", error);
        }
    };

    if (!id) return <p className={styles.loading}>Carregando...</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Editar Usuário</h1>
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
                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.saveButton}>💾 Salvar</button>
                    <button type="button" onClick={() => router.push("/user")} className={styles.cancelButton}>❌ Cancelar</button>
                </div>
            </form>
        </div>
    );
}
