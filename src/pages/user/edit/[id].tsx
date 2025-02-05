import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import styles from "../../../styles/edit-user.module.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUserById } from "@/services/user";
import Layout from "@/components/Layout";
import { User } from "@/models/user";
import { UpdateUserByIdRequest } from "@/services/api/user/update-user-by-id";
import { toast } from "react-toastify";

export default function EditUserPage() {
    const router = useRouter();
    const { id } = router.query;
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ["user", id],
        queryFn: async () => {
            const res = await getUserById(Number(id)).catch(error => {
                toast.error(error.response.data.error, {
                    position: "top-right",
                    autoClose: 3000,
                }); 
                setTimeout(() => { router.back() }, 3000);
                throw error;
            });
            return res;
        },
        enabled: !!id,
    });


    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<UpdateUserByIdRequest>();

    const onSubmit = async (data: UpdateUserByIdRequest) => {
        await updateUserById(Number(id), { ...data }).then(response => {
            queryClient.invalidateQueries({ queryKey: ["user", id] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Usuário alterado com sucesso!", {
                position: "top-right",
                autoClose: 3000,
            });
            router.push("/user");
        }).catch(error => {
            toast.error(error.response.data.error, {
                position: "top-right",
                autoClose: 3000,
            });
            setError("root", { type: "manual", message: error.response.data.error });
        })
    };

    if (!id) return <p className="text-center text-lg mt-12 text-[#666]">Carregando...</p>;

    return (
        <Layout>
            <div className="max-w-lg mx-auto m-12 p-5 text-center border-2 border-[#ddd] rounded-lg bg-[#f9f9f9] shadow-[0px_4px_10px_rgba(0,0,0,0.1)]">
                <h1 className="text-2xl mb-5 text-[#333]">Editar Usuário</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col text-left text-sm font-bold text-[#333] gap-4">
                    <label className={styles.label}>
                        Nome:
                    </label>
                    <input defaultValue={data?.name!} type="text" {...register("name")} className={styles.input} />
                    {errors.name && <span className={styles.error}>{errors.name.message}</span>}
                    <label className={styles.label}>
                        Sobrenome:
                    </label>
                    <input defaultValue={data?.last_name!} type="text" {...register("last_name")} className={styles.input} />
                    {errors.last_name && <span className={styles.error}>{errors.last_name.message}</span>}
                    <label className={styles.label}>
                        Usuário:
                    </label>
                    <input defaultValue={data?.username} type="text" {...register("username")} className={styles.input} />
                    {errors.username && <span className={styles.error}>{errors.username.message}</span>}
                    <label className={styles.label}>
                        Email:
                    </label>
                    <input defaultValue={data?.email} type="email" {...register("email")} className={styles.input} />
                    {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                    <div className="flex justify-center mt-5 gap-5">
                        <button type="submit" className="py-2.5 w-20 bg-[#28a745] text-white border-none rounded cursor-pointer text-md"> Salvar</button>
                        <button type="button" onClick={() => router.push("/user")} className="py-2.5 w-20 bg-[#dc3545] text-white border-none rounded cursor-pointer text-md"> Cancelar</button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
