// A diretiva "use client" é usada para indicar que este componente é executado no cliente (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
'use client'

// Importa hooks do React para usar o estado "useState"
import React, { useEffect, useState } from "react";

// Importar o adaptador para conectar react-hook-form com bibliotecas de validação como Yup
import { yupResolver } from '@hookform/resolvers/yup';

// Importar a função para gerenciar o formulário
import { useForm } from "react-hook-form";

// Importa hooks usado para manipular a navegação do usuário, useSearchParams para obter os parâmetros da URL
import { useRouter, useSearchParams } from "next/navigation";

// Importar a dependência para validar o formulário.
import * as yup from 'yup';

// Importa a instância do axios configurada para fazer requisições para a API
import instance from "@/service/api";

// Importar o componente para criar link
import Link from "next/link";

// Esquema de validação com Yup
const schema = yup.object().shape({
    password: yup.string().required("O campo senha é obrigatório!").min(6, "O campo senha deve ter no mínimo 6 caracteres!"),
});

export default function UpdatePassword() {

    // Instancia o objeto router
    const router = useRouter();

    // Instancia o objeto para obter os parâmetros da URL
    const searchParams = useSearchParams();

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
    const onSubmit = async (data: { password: string, recoverPassword?: string, email?: string }) => {

        // Chave recuperar senha
        data.recoverPassword = searchParams.get("key") || "";
        // E-mail do usuário
        data.email = searchParams.get("email") || "";

        // Inicia o carregamento
        setLoading(true);

        // Limpa o erro anterior
        setError(null);

        // Limpa o sucesso anterior
        setSuccess(null);

        try {
            // Fazer a requisição à API e enviar os dados
            const response = await instance.put("/update-password", data);

            // Limpa o campo do formulário
            reset();

            // Salvar a mensagem no sessionStorage antes de redirecionar 
            sessionStorage.setItem("successMessage", response.data.message || "Senha atualizada com sucesso!");

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
                setError("Erro ao atualizar a senha!");
            }
        } finally {

            // Termina o carregamento
            setLoading(false);
        }
    }

    // Hook para verificar se o token existe
    useEffect(() => {

        // Inicia o carregamento
        setLoading(true);

        // Recuperar o email e key da URL
        const email = searchParams.get("email") || "";
        const recoverPassword = searchParams.get("key") || "";

        // Verificar se o token existe
        if (!email || !recoverPassword) {

            // Salvar a mensagem no sessionStorage antes de redirecionar 
            sessionStorage.setItem("errorMessage", "Dados inválidos para recuperar a senha!");

            // Redirecionar para o login se não tiver email e key
            router.push("/login");
        }

        // Verifica a validade da chave na API
        const validateKey = async () => {
            try {

                // Fazer a requisição à API
                await instance.post("/validate-recover-password", { email, recoverPassword });

            } catch (error: any) {
                // Verifica se o erro contém mensagens de validação
                if (error.response && error.response.data && error.response.data.message) {

                    // Exibe as mensagens de erro se for um array de mensagens
                    if (Array.isArray(error.response.data.message)) {
                        sessionStorage.setItem("errorMessage", error.response.data.message.join(" - "));
                    } else {
                        // Exibe a mensagem de erro se for uma única mensagem
                        sessionStorage.setItem("errorMessage", error.response.data.message);
                    }

                } else {
                    // Salvar a mensagem no sessionStorage antes de redirecionar 
                    sessionStorage.setItem("errorMessage", "Dados inválidos para recuperar a senha!");
                }

                // Redirecionar para o login se não tiver email e key
                router.push("/login");
            } finally {
                setLoading(false);
            }
        }

        // Chamar a função validar o token
        validateKey();

    }, []);

    return (
        <div>

            <h1>Recuperar Senha</h1>

            {/* Exibir o carregando */}
            {loading && <p>Carregando...</p>}
            {/* Exibe mensagem de erro */}
            {error && <p style={{ color: "#f00" }}>{error}</p>}
            {/* Exibe mensagem de sucesso */}
            {success && <p style={{ color: "#086" }}>{success}</p>}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="password">Senha: </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Senha com mínimo 6 caracteres"
                        {...register('password')}
                        className="border"
                    /><br />
                    {/* Exibe o erro de validação do campo */}
                    {errors.password && <p style={{ color: "#f00" }}>{errors.password.message}</p>}

                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Enviando..." : "Atualizar"}
                </button>
            </form>

            <Link href="/login">Login</Link>

        </div>
    )
}

