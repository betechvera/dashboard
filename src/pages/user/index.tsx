import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import styles from "../../styles/users.module.css"; // 🔥 Importa o arquivo CSS

interface User {
    id: number;
    name: string | null;
    lastName: string | null;
    username: string;
    email: string;
}

interface PageResponse<T> {
    page: number;
    perPage: number;
    rows: T[];
    total: number;
}

export default function UsersPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const perPage = 10;

    const { data, error } = useQuery<PageResponse<User>>({
        queryKey: ["users", page],
        queryFn: async () => {
            const { data } = await axios.get<PageResponse<User>>("/api/user", {
                params: { page, perPage },
            });
            return data;
        },
        staleTime: 5000,
    });

    if (error) {
        console.error("Erro ao carregar os usuários:", error);
        if ((error as any).response?.status === 401) {
            router.push("/login");
        }
        return <p>Erro ao carregar os usuários. Redirecionando...</p>;
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>Lista de Usuários</h1>
                {data?.rows?.length === 0 ? (
                    <p>Nenhum usuário encontrado.</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.tableHead}>
                                <th className={styles.tableCell}>Nome</th>
                                <th className={styles.tableCell}>Usuário</th>
                                <th className={styles.tableCell}>Email</th>
                                <th className={styles.tableCell}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.rows?.map((user) => (
                                <tr key={user.id}>
                                    <td className={styles.tableCell}>
                                        {`${user.name ?? ""} ${user.lastName ?? ""}`.trim() || "Sem Nome"}
                                    </td>
                                    <td className={styles.tableCell}>{user.username}</td>
                                    <td className={styles.tableCell}>{user.email}</td>
                                    <td className={styles.tableCell}>
                                        <button
                                            onClick={() => router.push(`/user/edit/${user.id}`)}
                                            className={styles.actionButton}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => console.log(`Excluir usuário ${user.id}`)}
                                            className={styles.deleteButton}
                                        >
                                            🗑️ Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <Link href="/user/new">
                    <button className={styles.addButton}>➕ Novo Usuário</button>
                </Link>

                <div className={styles.pagination}>
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className={styles.paginationButton}
                    >
                        ⬅️
                    </button>
                    <span>Página {page}</span>
                    <button
                        disabled={Math.ceil((data?.total ?? 0) / perPage) <= page}
                        onClick={() => setPage(page + 1)}
                        className={styles.paginationButton}
                    >
                        ➡️
                    </button>
                </div>
            </div>
        </div>
    );
}
