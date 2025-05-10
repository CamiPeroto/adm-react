// A diretiva "use client" é usada para indicar que este componente é executado no cliente (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
'use client'

// Importa hooks do React para usar o estado "useState" e os efeitos colaterais "useEffect"
import { useEffect, useState } from "react";

// useParams - Acessar os parâmetros da URL de uma página que usa rotas dinâmicas.
import { useParams } from "next/navigation";

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

// importar o componente com o Menu
import Menu from "@/app/components/Menu";

// Importar componente de proteção de rotas
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Layout from "@/app/components/Layout";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import AlertMessage from "@/app/components/AlertMessage";

// Esquema de validação com Yup
const schema = yup.object().shape({
    name: yup.string().required("O campo nome é obrigatório!").min(3, "O campo nome deve ter no mínimo 3 caracteres!"),
    email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
});

export default function EditUser() {

    // Usando o useParams para acessar o parâmetro 'id' da URL
    const { id } = useParams();

    // Estado para controle de carregamento
    const [loading, setLoading] = useState<boolean>(false);

    // Estado para controle de erros
    const [error, setError] = useState<string | null>(null);

    // Estado para controle de sucesso
    const [success, setSuccess] = useState<string | null>(null);

    // Função para recuperar os dados da situação a ser editada
    const fetchUserDetails = async () => {

        try {

            // Inicia o carregamento
            setLoading(true);

            // Fazer a requisição à API
            const response = await instance.get(`/users/${id}`);

            // Preenche o campo com os dados existentes
            reset({ name: response.data.name, email: response.data.email });

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
                setError("Erro ao editar o usuário. Tente novamente.");
            }

        } finally {

            // Termina o carregamento
            setLoading(false);
        }

    };

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    // Função para enviar os dados atualizados para a API
    const onSubmit = async (data: {name: string, email: String, situation?: string}) => {

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
            const response = await instance.put(`/users/${id}`, data);

            // Exibir mensagem de sucesso
            setSuccess(response.data.message || "Usuário editado com sucesso!");

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
                setError("Erro ao editar o usuário. Tente novamente.");
            }
        } finally {

            // Termina o carregamento
            setLoading(false);
        }

    }

    // Chamar a função fetchUser quando o componente é montado
    useEffect(() => {
        if (id) {
            // Busca os dados do usuário se o id estiver disponível
            fetchUserDetails();
        }
    }, [id]); // Recarrega os dados quando o id mudar

    return (
        <Layout>

            <main className="main-content">
                <div className="content-wrapper">
                    <div className="content-header">
                        <h2 className="content-title">Usuário</h2>
                        <nav className="breadcrumb">
                            <Link href="/dashboard" className="breadcrumb-link">Dashboard</Link>
                            <span> / </span>
                            <Link href="/users/list" className="breadcrumb-link">Usuários</Link>
                            <span> / </span>
                            <span>Editar</span>
                        </nav>
                    </div>
                </div>

                <div className="content-box">
                    <div className="content-box-header">
                        <h3 className="content-box-title">Editar</h3>
                        <div className="content-box-btn">
                            <a href="/users/list" className="btn-info align-icon-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                    stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                                </svg>
                                <span>Listar</span>
                            </a>

                            <a href={`/users/${id}`} className="btn-primary align-icon-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                    stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                                <span>Visualizar</span>
                            </a>
                        </div>
                    </div>

                    {/* Exibir o carregando */}
                    {loading && <LoadingSpinner />}

                    {/* Exibe mensagem de erro */}
                    <AlertMessage type="error" message={error} />
                    {/* Exibe mensagem de sucesso */}
                    <AlertMessage type="success" message={success} />

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label htmlFor="name" className="form-label">Nome: </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Nome completo do usuário"
                                {...register('name')}
                                className="form-input"
                            />
                            {/* Exibe o erro de validação do campo */}
                            {errors.name && <AlertMessage type="error" message={errors.name.message ?? null} />}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="form-label">E-mail: </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Melhor e-mail do usuário"
                                {...register('email')}
                                className="form-input"
                            />
                            {/* Exibe o erro de validação do campo */}
                            {errors.email && <AlertMessage type="error" message={errors.email.message ?? null} />}
                        </div>

                        <button type="submit" disabled={loading} className="btn-warning">
                            {loading ? "Salvando..." : "Salvar"}
                        </button>
                    </form>

                </div>

            </main>

        </Layout>
    )
}