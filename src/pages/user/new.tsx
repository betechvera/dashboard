import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function NewUserPage() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
    });
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("/api/user", form);
            router.push("/user"); // Redireciona após sucesso
        } catch (error) {
            console.error("Erro ao adicionar usuário", error);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Adicionar Novo Usuário</h1>
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    padding: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    backgroundColor: "#f9f9f9"
                }}
            >
                <label style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                    Nome:
                    <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                        style={{
                            padding: "10px",
                            border: "1px solid #aaa",
                            borderRadius: "5px",
                            backgroundColor: "#f0f0f0"
                        }}
                    />
                </label>
                <label style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                    Sobrenome:
                    <input
                        type="text"
                        name="last_name"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                        style={{
                            padding: "10px",
                            border: "1px solid #aaa",
                            borderRadius: "5px",
                            backgroundColor: "#f0f0f0"
                        }}
                    />
                </label>
                <label style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                    Usuário:
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        style={{
                            padding: "10px",
                            border: "1px solid #aaa",
                            borderRadius: "5px",
                            backgroundColor: "#f0f0f0"
                        }}
                    />
                </label>
                <label style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={{
                            padding: "10px",
                            border: "1px solid #aaa",
                            borderRadius: "5px",
                            backgroundColor: "#f0f0f0"
                        }}
                    />
                </label>
                <button
                    type="submit"
                    style={{
                        marginTop: "10px",
                        padding: "10px",
                        background: "blue",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Salvar
                </button>
            </form>
        </div>
    );
}
