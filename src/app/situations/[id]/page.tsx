"use client";
import { useEffect, useState } from "react";
//hook pra manipular navegação do usuário
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import instance from "@/service/api";
import Link from "next/link";
import DeleteButton from "@/app/components/DeleteButton";
import Layout from "@/app/components/Layout";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import AlertMessage from "@/app/components/AlertMessage";
interface Situation {
  id: number;
  nameSituation: string;
  createdAt: Date;
  updatedAt: Date;
}
export default function SituationDetails() {
  //usar o useparams para acessar o id da url
  const { id } = useParams();
  //instanciar o objeto router
  const router = useRouter();

  const [situation, setSituation] = useState<Situation | null>(null); //Apresentar carregamento
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  //Função para buscar a situação
  const fetchSituationDetails = async (id: string) => {
    try {
      //Iniciar o carregamento
      setLoading(true);
      const response = await instance.get(`/situations/${id}`);
      //Atualizar o estado com os dados da API
      setSituation(response.data);
      //Terminar o carregamento
      setLoading(false);
    } catch (error: any) {
      //Verificar se o erro contem mensagens de validação
      if (error.response && error.response.data) {
        //se for só 1, atribuir a resposta retornada pela API
        setError(error.response.data.message);
      } else {
        setError("Erro ao carregar os detalhes da situação!");
      }
      setLoading(false);
    }
  };
  //Atualizar a lista de registros após apagar um registro
  const handleSuccess = () => {
    //salvar a mensagem no sessionStorage antes de redirecionar
    sessionStorage.setItem("successMessage", "Registro apagado com sucesso!");
    //redireciona para a página listar
    router.push("/situations/list");
  };

  useEffect(() => {
    if (id) {
      //garantir que o id seja uma string
      const situationId = Array.isArray(id) ? id[0] : id;
      // buscar os dados da situação se o id estiver disponível
      fetchSituationDetails(situationId);
    }
  }, [id]); //Recarregar os dados quando o ID mudar

  return (
    <Layout>
      <main className="main-content">
        <div className="content-wrapper">
          <div className="content-header">
            <h2 className="content-title">Situação</h2>
            <nav className="breadcrumb">
              <Link href="/dashboard" className="breadcrumb-link"> 
              Dashboard</Link>
              <span> / </span>
              <span>Situações</span>
            </nav>
          </div>
        </div>
        <div className="content-box">
          <div className="content-box-header">
            <h3 className="content-box-title">Visualizar</h3>
            <div className="content-box-btn">
              <a href="/situations/list" className="btn-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </a>

              <a href={`/situations/${id}/edit`} className="btn-warning hidden md:flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </a>
              {situation && !loading && !error && (
                <DeleteButton
                    id={String(situation.id)}
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
            {situation && !loading && !error && (
              <div className="detail-box">
                <div className="mb-1">
                  <span className="detail-content">ID: </span>
                  {situation.id}
                </div>
                <div className="mb-1">
                  <span className="detail-content">Situação: </span>
                  {situation.nameSituation}
                </div>
                <div className="mb-1">
                  <span className="detail-content">Criado em: </span>
                  {new Date(situation.createdAt).toLocaleString()}
                </div>
                <div className="mb-1">
                  <span className="detail-content">Atualizado em: </span>
                  {new Date(situation.updatedAt).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
