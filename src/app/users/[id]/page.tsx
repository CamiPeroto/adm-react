// A diretiva "use client" é usada para indicar que este componente é executado no cliente (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

// Importa hooks do React para usar o estado "useState" e os efeitos colaterais "useEffect"
import { useEffect, useState } from "react";

// Importa hooks usado para manipular a navegação do usuário
import { useRouter } from "next/navigation";

// useParams - Acessar os parâmetros da URL de uma página que usa rotas dinâmicas.
import { useParams } from "next/navigation";

// Importa a instância do axios configurada para fazer requisições para a API
import instance from "@/service/api";

// Importar o componente para criar link
import Link from "next/link";

// importar o componente com o Menu
import Menu from "@/app/components/Menu";

// Importa o componente para apagar registro
import DeleteButton from "@/app/components/DeleteButton";

// Importar componente de proteção de rotas
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Layout from "@/app/components/Layout";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import AlertMessage from "@/app/components/AlertMessage";

// Definir tipos para a resposta da API
interface User {
  id: number;
  name: string;
  email: string;
  situation: { nameSituation: string };
  createdAt: string;
  updatedAt: string;
}

export default function UserDetails() {
  // Usando o useParams para acessar o parâmetro 'id' da URL
  const { id } = useParams();

  // Instancia o objeto router
  const router = useRouter();

  // Estado para armazenar o usuário
  const [user, setUser] = useState<User | null>(null);

  // Estado para controle de carregamento
  const [loading, setLoading] = useState<boolean>(true);

  // Estado para controle de erros
  const [error, setError] = useState<string | null>(null);

  // Estado para controle de sucesso
  const [success, setSuccess] = useState<string | null>(null);

  // Função para buscar o usuário na API
  const fetchUserDetails = async (id: string) => {
    try {
      // Inicia o carregamento
      setLoading(true);

      // Fazer a requisição à API
      const response = await instance.get(`/users/${id}`);

      // Atualizar o estado com os dados da API
      setUser(response.data);

      // Terminar o carregamento
      setLoading(false);
    } catch (error: any) {
      // Verifica se o erro contém mensagens de validação
      if (error.response && error.response.data) {
        // Se for uma única mensagem atribuir a mensagem de erro retornada da API
        setError(error.response.data.message);
      } else {
        // Criar a mensagem genérica de erro
        setError("Erro ao carregar os detalhes do usuário!");
      }

      // Termina o carregamento em caso de erro
      setLoading(false);
    }
  };

  // Redirecionar para a página listar após apagar o registro
  const handleSuccess = () => {
    // Salvar a mensagem no sessionStorage antes de redirecionar
    sessionStorage.setItem("successMessage", "Registro apagado com sucesso.");

    // Redireciona para a página de listar
    router.push("/users/list");
  };

  // Hook para buscar os dados quando o id estiver disponível
  useEffect(() => {
    if (id) {
      // Garantir que id seja uma string
      const userId = Array.isArray(id) ? id[0] : id;

      // Busca os dados da situação se o id estiver disponível
      fetchUserDetails(userId);
    }
  }, [id]); // Recarrega os dados quando o id mudar

  return (
    <Layout>
      <main className="main-content">
        <div className="content-wrapper">
          <div className="content-header">
            <h2 className="content-title">Usuário</h2>
            <nav className="breadcrumb">
              <Link href="/dashboard" className="breadcrumb-link"> 
              Dashboard</Link>
              <span> / </span>
              <span>Usuários</span>
            </nav>
          </div>
        </div>
        <div className="content-box">
          <div className="content-box-header">
            <h3 className="content-box-title">Visualizar</h3>
            <div className="content-box-btn">
              <a href="/users/list" className="btn-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </a>

              <a href={`/users/${id}/edit`} className="btn-warning hidden md:flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </a>
              {user && !loading && !error && (
                <DeleteButton
                    id={String(user.id)}
                    route="users"
                    onSuccess={handleSuccess}
                    setError={setError}
                    setSuccess={setSuccess}
                />
            )}
            </div>
          </div>

          <div className="content-box-body">
            {/* exibir mensagem de carregamento */}
            {loading && <LoadingSpinner />}
            {/* exibir erro, se houver */}
            {/* {error && <p className="alert-danger">{error}</p>} */}
            <AlertMessage type="error" message={error} />
            {/* exibir sucesso, se houver */}
            {/* {success && <p className="alert-success">{success}</p>} */}
            <AlertMessage type="success" message={success} />

            {/* Imprimir os detalhes do registro */}
            {user && !loading && !error && (
              <div className="detail-box">
                <div className="mb-1">
                  <span className="detail-content">ID: </span>
                  {user.id}
                </div>
                <div className="mb-1">
                  <span className="detail-content">Nome: </span>
                  {user.name}
                </div>
                <div className="mb-1">
                  <span className="detail-content">E-mail: </span>
                  {user.email}
                </div>
                <div className="mb-1">
                  <span className="detail-content">Situação: </span>
                  {user.situation?.nameSituation}
                </div>
                <div className="mb-1">
                  <span className="detail-content">Criado em: </span>
                  {new Date(user.createdAt).toLocaleString()}
                </div>
                <div className="mb-1">
                  <span className="detail-content">Atualizado em: </span>
                  {new Date(user.updatedAt).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
