import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import styles from "../../styles/users.module.css";
import { getAllUsers } from "@/services/user";
import Layout from "@/components/Layout";

export default function UsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  const { data, error, refetch } = useQuery({
    queryKey: ["users", page],
    queryFn: async () => {
      const res = await getAllUsers({ page, perPage });
      return res;
    },
  });

  async function deleteUser(id: number) {
    await deleteUser(id);
    refetch();
  }

  if (error) {
    console.error("Erro ao carregar os usuários:", error);
    if ((error as any).response?.status === 401) {
      router.push("/login");
    }
    return <p>Erro ao carregar os usuários. Redirecionando...</p>;
  }

  return (

    <Layout>
      <div>
        <div className="max-w-screen-md mx-auto m-5 text-center bg-[#f9f9f9] rounded-3xl text-black shadow-[0px_4px_10px_rgba(0,0,0,0.1)]">
          <h1 className="text-2xl mb-4 pt-5">Lista de Usuários</h1>
          {data?.rows?.length === 0 ? (
            <p>Nenhum usuário encontrado.</p>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#d2ecdc] text-center text-black">
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
                      {`${user.name ?? ""} ${user.last_name ?? ""}`.trim() ||
                        "Sem Nome"}
                    </td>
                    <td className={styles.tableCell}>{user.username}</td>
                    <td className={styles.tableCell}>{user.email}</td>
                    <td className={styles.tableCell}>
                      <button
                        onClick={() => router.push(`/user/edit/${user.id}`)}
                        className="mr-3 bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded"
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
            <button className="mt-6 p-2 bg-[rgb(127,203,127)] text-black border-none rounded cursor-pointer transform translate-x-[215%]">➕ Novo Usuário</button>
          </Link>
          <div className="mt-4">
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
              onClick={() => {
                console.log("teste");
                setPage((prev) => prev + 1);
              }}
              className={styles.paginationButton}
            >
              ➡️
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
