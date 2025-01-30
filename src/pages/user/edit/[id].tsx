import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

interface User {
    id: number;
    name: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
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
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (id) {
            const token = "fake-token-123";
            axios
                .get<User>(`/api/user/${id}`, { // 🔥 Define explicitamente que 'data' é do tipo 'User'
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(({ data }) => {
                    setForm({
                        id: data.id,
                        name: data.name,
                        lastName: data.lastName, // 🔥 Agora TypeScript reconhece 'lastName'
                        username: data.username,
                        email: data.email,
                        password: "", // 🔥 Mantém a senha vazia por segurança
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
            password: form.password,
        };

        try {
            const token = "fake-token-123";
            await axios.put(`/api/user/${id}`, formattedData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            router.push("/user");
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
                    <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required style={styles.input} />
                </label>
                <label style={styles.label}>
                    Usuário:
                    <input type="text" name="username" value={form.username} onChange={handleChange} required style={styles.input} />
                </label>
                <label style={styles.label}>
                    Email:
                    <input type="email" name="email" value={form.email} onChange={handleChange} required style={styles.input} />
                </label>
                <label style={styles.label}>
                    Senha:
                    <div style={styles.passwordContainer}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            style={styles.passwordInput}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                </label>
                <div style={styles.buttonContainer}>
                    <button type="submit" style={styles.saveButton}>💾 Salvar</button>
                    <button type="button" onClick={() => router.push("/user")} style={styles.cancelButton}>❌ Cancelar</button>
                </div>
            </form>
        </div>
    );
}

// 🎨 Estilos
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
    passwordContainer: {
        display: "flex",
        alignItems: "center",
        position: "relative" as const,
    },
    passwordInput: {
        flex: 1,
        padding: "10px",
        border: "1px solid #aaa",
        borderRadius: "5px",
        fontSize: "16px",
    },
    eyeButton: {
        position: "absolute" as const,
        right: "10px",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
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
