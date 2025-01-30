import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

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

        console.log("Enviando usuário:", form);

        const formattedData = {
            name: form.name,
            last_name: form.lastName, // 🔥 Converte para last_name antes de enviar
            username: form.username,
            email: form.email,
            password: form.password,
        };

        try {
            const token = "fake-token-123";
            await axios.post("/api/user", formattedData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            router.push("/user");
        } catch (error) {
            console.error("Erro ao adicionar usuário", error);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Adicionar Novo Usuário</h1>
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
                <button type="submit" style={styles.submitButton}>Salvar</button>
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
    submitButton: {
        marginTop: "20px",
        padding: "10px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
    },
};
