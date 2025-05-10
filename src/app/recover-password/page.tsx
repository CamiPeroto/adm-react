// A diretiva "use client" é usada para indicar que este componente é executado no cliente (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
'use client'

// Importa hooks do React para usar o estado "useState"
import React, { useState } from "react";

// Importar o adaptador para conectar react-hook-form com bibliotecas de validação como Yup
import { yupResolver } from '@hookform/resolvers/yup';

// Importar a função para gerenciar o formulário
import { useForm } from "react-hook-form";

// Importa hooks usado para manipular a navegação do usuário
import { useRouter } from "next/navigation";

// Importar a dependência para validar o formulário.
import * as yup from 'yup';

// Importa a instância do axios configurada para fazer requisições para a API
import instance from "@/service/api";

// Importar o componente para criar link
import Link from "next/link";
import LoadingSpinner from "../components/LoadingSpinner";
import AlertMessage from "../components/AlertMessage";

// Esquema de validação com Yup
const schema = yup.object().shape({
    email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
});

export default function RecoverPassword() {

    // Instancia o objeto router
    const router = useRouter();

    // Estado para controle de carregamento
    const [loading, setLoading] = useState<boolean>(false);

    // Estado para controle de erros
    const [error, setError] = useState<string | null>(null);

    // Estado para controle de sucesso
    const [success, setSuccess] = useState<string | null>(null);

    // Iniciar o formulário com validações
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    // Função para enviar os dados para a API
    const onSubmit = async (data: { email: string, urlRecoverPassword?: string }) => {

        // Atribuir a URL da aplicação
        data.urlRecoverPassword = "http://localhost:3000/recover-password/update-password";

        // Inicia o carregamento
        setLoading(true);

        // Limpa o erro anterior
        setError(null);

        // Limpa o sucesso anterior
        setSuccess(null);

        try {

            // Fazer a requisição à API e enviar os dados
            const response = await instance.post("/recover-password", data);

            // Limpa o campo do formulário
            reset();

            // Salvar a mensagem no sessionStorage antes de redirecionar 
            sessionStorage.setItem("successMessage", response.data.message || "E-mail enviado! Verifique sua caixa de entrada!");

            // Redireciona para a página de listar
            router.push("/login");

        } catch (error: any) {
            // Verifica se o erro contém mensagens de validação
            if (error.response && error.response.data && error.response.data.message) {

                // Exibe as mensagens de erro se for um array de mensagens
                if (Array.isArray(error.response.data.message)) {
                    setError(error.response.data.message.join(" - "));
                } else {
                    // Exibe a mensagem de erro se for uma única mensagem
                    setError(error.response.data.message);
                }

            } else {
                // Criar a mensagem genérica de erro
                setError("Erro ao recuperar a senha!");
            }
        } finally {

            // Termina o carregamento
            setLoading(false);
        }
    }

    return (
        <div className="bg-login">
            <div className="card-login">
                 <div className="logo-wrapper-login">
                    <a href="/">
                     <img src="/images/logo.ico" alt="Loogo" className="logo-login" />
                     </a>
                 </div>
            <h1 className="title-login">Recuperar Senha</h1>

            {/* Exibir o carregando */}
            {loading && <LoadingSpinner/>}
            <AlertMessage type="error" message={error}/>
            {/* Exibe mensagem de sucesso */}
            <AlertMessage type="success" message={success}/>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                <div className="form-group-login">
                <label htmlFor="email" className="form-label-login">E-mail: </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Digite seu e-mail cadastrado"
                        {...register('email')}
                        className="form-input-login"
                    /><br />
                    {/* Exibe o erro de validação do campo */}
                    {errors.email &&  <AlertMessage type="error" message={errors.email.message ?? null}/>}

                </div>
                <div className="btn-group-login">
                    <Link href="login" className="link-login">Login</Link>
                    <button type="submit" className="btn-primary-md">Recuperar</button>
                </div>
                <div className="ref-login">
                    <Link href="sign-up" className="link-login">Criar conta</Link>
                </div>
        </form>
    </div>
</div>
    )
}

