import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";

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

// 🔥 Função para obter um token falso (ou pegue dos cookies/localStorage se necessário)
const getFakeToken = () => "fake-token-123";

export default function UsersPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const perPage = 10;

    // Hook para buscar usuários com autenticação
    const { data, isLoading, error } = useQuery<PageResponse<User>>({
        queryKey: ["users", page],
        queryFn: async () => {
            const token = getFakeToken();
            const { data } = await axios.get<PageResponse<User>>("/api/user", {
                params: { page, perPage },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        },
        staleTime: 5000,
    });

    // 🔥 Redirecionar para login se der erro
    if (error) {
        console.error("Erro ao carregar os usuários:", error);

        // Se o erro for 401 (não autorizado), redireciona para login
        if ((error as any).response?.status === 401) {
            router.push("/login");
        }

        return <p>Erro ao carregar os usuários. Redirecionando...</p>;
    }

    return (
        <div style={{ maxWidth: "800px", margin: "20px auto", textAlign: "center" }}>
            <h1>Lista de Usuários</h1>

            <Link href="/user/new">
                <button style={{ marginBottom: "15px", padding: "10px", background: "green", color: "white", border: "none", borderRadius: "5px" }}>
                    Adicionar Novo Usuário
                </button>
            </Link>

            {data?.rows?.length === 0 ? (
                <p>Nenhum usuário encontrado.</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ background: "#f0f0f0" }}>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Nome</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Sobrenome</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Usuário</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.rows?.map((user) => (
                            <tr key={user.id}>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.name ?? "Sem Nome"}</td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.lastName ?? "Sem Sobrenome"}</td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.username}</td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.email}</td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                    <button
                                        onClick={() => router.push(`/user/edit/${user.id}`)}
                                        style={{ marginRight: "10px", background: "blue", color: "white", border: "none", padding: "5px", borderRadius: "5px" }}>
                                        ✏️ Editar
                                    </button>
                                    <button
                                        onClick={() => console.log(`Excluir usuário ${user.id}`)}
                                        style={{ background: "red", color: "white", border: "none", padding: "5px", borderRadius: "5px" }}>
                                        🗑️ Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Paginação */}
            <div style={{ marginTop: "15px" }}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)} style={{ padding: "10px", marginRight: "5px" }}>
                    Anterior
                </button>
                <span>Página {page}</span>
                <button disabled={(data?.total ?? 0) / perPage <= page} onClick={() => setPage(page + 1)} style={{ padding: "10px", marginLeft: "5px" }}>
                    Próxima
                </button>
            </div>
        </div>
    );
}
