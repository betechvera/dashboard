import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";


interface FormData {
    auth: string;
    password: string;
}

const InputField = styled.input`
    padding: 10px 20px;
    border-radius: 10px;
    background-color: #f1f1f1;
    outline-width: 1px;
    outline-color: #108a3e; 
`

const ContainerInput = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`

const ErrorMessage = styled.p`
    color: red;
`

const ContainerButton = styled.div`
    position: relative;
    display: inline-block;

    &:after{
        content: "";
        height: 100%;
        width: 100%;
        padding: 4px;
        position: absolute;
        bottom: -15px;
        left: -4px;
        z-index: -1;
        background-color: #2B1800;
        border-radius: 5px;
    }
`

const Button = styled.button`
    color: white;
    font-family: Helvetica, sans-serif;
    font-weight: bold;
    font-size: 24px;
    text-align: center;
    text-decoration: none;
    background-color: #19E066;
    display: block;
    position: relative;
    padding: 10px 0;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    text-shadow: 0px 1px 0px #000;
    filter: dropshadow(color=#000, offx=0px, offy=1px);
    box-shadow: inset 0 1px 0 #FFE5C4, 0 10px 0 #108a3e;

    &:active{
        top: 24px;
        background-color: #19E066;
    }
`


const Login: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        console.log(data);
    };

    return (
        <div className="text-[#404040] flex h-[100vh] justify-center items-center bg-[url(/assets/bg-login.webp)] bg-cover bg-center p-5">
            <div>
                <form className="p-12 bg-white rounded-3xl flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl">Faça o seu login</h1>
                        <div className="bg-[#19E066] h-2 w-[90%] rounded-full"></div>
                    </div>
                    <ContainerInput>
                        <label htmlFor="auth">Seu e-mail &lowast;</label>
                        <InputField
                            type="text"
                            id="auth"
                            {...register("auth", {
                                required: "*Campo obrigatório",
                            })}
                        />
                        {errors.auth && (
                            <ErrorMessage>{errors.auth.message}</ErrorMessage>
                        )}
                    </ContainerInput>
                    <ContainerInput>
                        <label htmlFor="password">Sua senha &lowast;</label>
                        <InputField
                            type="password"
                            id="password"
                            {...register("password", { required: "*Campo obrigatório" })}
                        />
                        {errors.password && (
                            <ErrorMessage>{errors.password.message}</ErrorMessage>
                        )}
                    </ContainerInput>
                    <ContainerButton>
                        <Button type="submit">Entrar</Button>
                    </ContainerButton>
                </form>
            </div>
        </div>
    );
};

export default Login;
