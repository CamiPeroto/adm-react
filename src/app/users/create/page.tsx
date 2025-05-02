// A diretiva "use client" é usada para indicar que este componente é executado no cliente (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa hooks do React para usar o estado "useState"
import React, { useState } from "react";

// Importar o adaptador para conectar react-hook-form com bibliotecas de validação como Yup
import { yupResolver } from "@hookform/resolvers/yup";

// Importar a função para gerenciar o formulário
import { useForm } from "react-hook-form";

// Importar a dependência para validar o formulário.
import * as yup from "yup";

// Importa a instância do axios configurada para fazer requisições para a API
import instance from "@/service/api";

// Importar o componente para criar link
import Link from "next/link";
import Layout from "@/app/components/Layout";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import AlertMessage from "@/app/components/AlertMessage";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Função para enviar os dados para a API
  const onSubmit = async (data: { name: string; email: string; password: string; situation?: string }) => {
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
  };

  return (
    <Layout>
      <main className="main-content">
        <div className="content-wrapper">
          <div className="content-header">
            <h2 className="content-title">Usuário</h2>
            <nav className="breadcrumb">
              <Link href="/dashboard" className="breadcrumb-link">
                Dashboard
              </Link>
              <span> / </span>
              <Link href="/users/list" className="breadcrumb-link">
             Usuários
              </Link>
              <span> / </span>
              <span>Cadastrar</span>
            </nav>
          </div>
        </div>
        <div className="content-box">
          <div className="content-box-header">
            <h3 className="content-box-title">Cadastrar</h3>
            <div className="content-box-btn">
              <a href="/users/list" className="btn-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </a>                
            </div>
          </div>
           {/* exibir mensagem de carregamento */}
           {loading && <LoadingSpinner />}
            {/* exibir erro, se houver */}
            {/* {error && <p className="alert-danger">{error}</p>} */}
            <AlertMessage type="error" message={error} />
            {/* exibir sucesso, se houver */}
            {/* {success && <p className="alert-success">{success}</p>} */}
            <AlertMessage type="success" message={success} />
           
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label htmlFor="name" className="form-label">Nome: </label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Nome completo do usuário"
                        {...register('name')}
                        className="form-input"/>
                  {/* exibe o erro de validação do campo */}
                  {errors.name &&  <AlertMessage type="error" message={errors.name.message ?? null}/>}
                    </div>

                    <div className="mb-4">
                    <label htmlFor="email" className="form-label">E-mail: </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="email@example.com"
                        {...register('email')}
                        className="form-input"/>
                      {/* exibe o erro de validação do campo */}
                      {errors.email &&  <AlertMessage type="error" message={errors.email.message ?? null}/>}
                    </div>

                    <div className="mb-4">
                    <label htmlFor="password" className="form-label">Senha: </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Senha com mínimo 6 caracteres"
                        {...register('password')}
                        className="form-input"/>
                    {/* Exibe o erro de validação do campo */}
                    {errors.password &&  <AlertMessage type="error" message={errors.password.message ?? null}/>}
                </div>
                <button type="submit" disabled={loading} className="btn-success">
                    {loading ? "Salvando..." : "Salvar"}
                </button>
            </form>
          </div>
      </main>
    </Layout>
  );
}
