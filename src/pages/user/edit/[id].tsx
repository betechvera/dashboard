import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

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
            const token = "fake-token-123"; // 🔥 Use um token real se necessário
            axios
                .get<User>(`/api/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(({ data }) => setForm(data))
                .catch((error) => console.error("Erro ao buscar usuário:", error));
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = "fake-token-123";
            await axios.put(`/api/user/${id}`, form, {
                headers: { Authorization: `Bearer ${token}` },
            });

            router.push("/user"); // 🔥 Redireciona para a lista de usuários
        } catch (error) {
            console.error("Erro ao editar usuário", error);
        }
    };

    if (!id) return <p style={styles.loading}>Carregando...</p>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Editar Usuário</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>
                    Nome:
                    <input type="text" name="name" value={form.name} onChange={handleChange} required style={styles.input} />
                </label>
                <label style={styles.label}>
                    Sobrenome:
                    <input type="text" name="last_name" value={form.lastName} onChange={handleChange} required style={styles.input} />
                </label>
                <label style={styles.label}>
                    Usuário:
                    <input type="text" name="username" value={form.username} onChange={handleChange} required style={styles.input} />
                </label>
                <label style={styles.label}>
                    Email:
                    <input type="email" name="email" value={form.email} onChange={handleChange} required style={styles.input} />
                </label>
                <div style={styles.buttonContainer}>
                    <button type="submit" style={styles.saveButton}>💾 Salvar</button>
                    <button type="button" onClick={() => router.push("/user")} style={styles.cancelButton}>❌ Cancelar</button>
                </div>
            </form>
        </div>
    );
}

// 🔥 Estilos
const styles = {
    container: {
        maxWidth: "500px",
        margin: "50px auto",
        padding: "20px",
        textAlign: "center" as const,
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    },
    title: {
        fontSize: "24px",
        marginBottom: "20px",
        color: "#333",
    },
    form: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "15px",
    },
    label: {
        display: "flex",
        flexDirection: "column" as const,
        textAlign: "left" as const,
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333",
    },
    input: {
        padding: "10px",
        border: "1px solid #aaa",
        borderRadius: "5px",
        backgroundColor: "#fff",
        fontSize: "16px",
        marginTop: "5px",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
    },
    saveButton: {
        padding: "10px 15px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
    cancelButton: {
        padding: "10px 15px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
    loading: {
        textAlign: "center" as const,
        fontSize: "18px",
        marginTop: "50px",
        color: "#666",
    },
};
