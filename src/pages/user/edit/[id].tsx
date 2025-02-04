import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "../../../styles/edit-user.module.css";

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

    if (!id) return <p className="text-center text-lg mt-12 text-[#666]">Carregando...</p>;

    return (
        <div className="max-w-lg mx-auto m-12 p-5 text-center border-2 border-[#ddd] rounded-lg bg-[#f9f9f9] shadow-[0px_4px_10px_rgba(0,0,0,0.1)]"> 
            <h1 className="text-2xl mb-5 text-[#333]">Editar Usuário</h1>
            <form onSubmit={handleSubmit} className="flex flex-col text-left text-sm font-bold text-[#333] gap-4">
                <label className={styles.label}>
                    Nome:
                </label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required className={styles.input} />
                <label className={styles.label}>
                    Sobrenome:
                </label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required className={styles.input} />
                <label className={styles.label}>
                    Usuário:
                </label>
                <input type="text" name="username" value={form.username} onChange={handleChange} required className={styles.input} />
                <label className={styles.label}>
                    Email:
                </label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className={styles.input} />
                <div className="flex justify-center mt-5 gap-5">
                    <button type="submit" className="py-2.5 w-20 bg-[#28a745] text-white border-none rounded cursor-pointer text-md"> Salvar</button>
                    <button type="button" onClick={() => router.push("/user")} className="py-2.5 w-20 bg-[#dc3545] text-white border-none rounded cursor-pointer text-md"> Cancelar</button>
                </div>
            </form>
        </div>
    );
}
