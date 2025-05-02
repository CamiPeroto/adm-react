// A diretiva "use client" é usada para indicar que este componente é executado no cliente (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
'use client'

// Importa hooks do React para usar o estado "useState"
import React, { useState } from "react";

// Importar o adaptador para conectar react-hook-form com bibliotecas de validação como Yup
import { yupResolver } from '@hookform/resolvers/yup';

// Importar a função para gerenciar o formulário
import { useForm } from "react-hook-form";

// Importar a dependência para validar o formulário.
import * as yup from 'yup';

// Importa a instância do axios configurada para fazer requisições para a API
import instance from "@/service/api";

// Importar o componente para criar link
import Link from "next/link";

// Importar o componente com o Menu
import Menu from "@/app/components/Menu";

// Importar componente de proteção de rotas
import ProtectedRoute from "@/app/components/ProtectedRoute";

// Esquema de validação com Yup
const schema = yup.object().shape({
    name: yup.string().required("O campo nome é obrigatório!").min(3, "O campo nome deve ter no mínimo 3 caracteres!"),
    email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
    password: yup.string().required("O campo senha é obrigatório!").min(6, "O campo senha deve ter no mínimo 6 caracteres!"),
});

export default function CreateUser() {

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
    const onSubmit = async (data: { name: string, email: string, password: string, situation?: string}) => {

        // Se não for enviado, define como "1"
        data.situation = data.situation ?? "1";

        // Inicia o carregamento
        setLoading(true);

        // Limpa o erro anterior
        setError(null);

        // Limpa o sucesso anterior
        setSuccess(null);

        try {

            // Fazer a requisição à API e enviar os dados
            const response = await instance.post("/users", data);

            // Exibir mensagem de sucesso
            setSuccess(response.data.message || "Usuário cadastrado com sucesso!");

            // Limpa o campo do formulário
            reset();

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
                setError("Erro ao cadastrada o usuário. Tente novamente.");
            }
        } finally {

            // Termina o carregamento
            setLoading(false);
        }
    }

    return (
        <ProtectedRoute>
            <Menu /><br />

            <Link href={`/users/list`}>Listar</Link><br />

            <h1>Cadastrar Usuário</h1>

            {/* Exibir o carregando */}
            {loading && <p>Carregando...</p>}
            {/* Exibe mensagem de erro */}
            {error && <p style={{ color: "#f00" }}>{error}</p>}
            {/* Exibe mensagem de sucesso */}
            {success && <p style={{ color: "#086" }}>{success}</p>}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="name">Nome: </label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Nome completo do usuário"
                        {...register('name')}
                        className="border"
                    /><br/>
                    {/* Exibe o erro de validação do campo */}
                    {errors.name && <p style={{ color: "#f00" }}>{errors.name.message}</p>}

                    <label htmlFor="email">E-mail: </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Melhor e-mail do usuário"
                        {...register('email')}
                        className="border"
                    /><br/>
                    {/* Exibe o erro de validação do campo */}
                    {errors.email && <p style={{ color: "#f00" }}>{errors.email.message}</p>}

                    <label htmlFor="password">Senha: </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Senha com mínimo 6 caracteres"
                        {...register('password')}
                        className="border"
                    /><br/>
                    {/* Exibe o erro de validação do campo */}
                    {errors.password && <p style={{ color: "#f00" }}>{errors.password.message}</p>}

                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Enviando..." : "Cadastrar"}
                </button>
            </form>
        </ProtectedRoute>
    )
}

