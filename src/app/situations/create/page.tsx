"use client";
import { useState } from "react";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import instance from "@/service/api";
import Link from "next/link";
import Layout from "@/app/components/Layout";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import AlertMessage from "@/app/components/AlertMessage";

//esquema de validação com yup
const schema = yup.object().shape({
nameSituation: yup.string().required("O campo nome é obrigatório!")
.min(3, "O nome deve ter pelo menos 3 caracteres"),
});

export default function CreateSituation() {
  //Estado para o campo nameSituation
//   const [nameSituation, setNameSituation] = useState<string>("");
  //Apresentar carregamento
  const [loading, setLoading] = useState<boolean>(false);
  //Apresentar erros
  const [error, setError] = useState<string | null>(null);
  //Apresentar sucesso
  const [success, setSuccess] = useState<string | null>(null);
  //iniciar o formulário com as validações
  const {register, handleSubmit, formState: {errors}, reset} = useForm({
    resolver:yupResolver(schema),
  });

  //Função para enviar os dados para a API
  const onSubmit = async (data: {nameSituation: string}) => {
    //evitar o recarregar da página ao enviar o form
    // event.preventDefault();
    //inicia o carregamento
    setLoading(true);
    //limpa o erro anterior
    setError(null);
    //limpa o sucesso anterior
    setSuccess(null);

    try{
        //fazer a requisição pra api e enviar os dados
        const response = await instance.post("/situations", data);
        //exibir mensagem de sucesso
        setSuccess(response.data.message || "Situação Cadastrada com sucesso!");
        //limpa o campo do formulário
        reset();

    }catch(error: any){
        //verifica se o erro contem mensagens de validação
        if(error.response && error.response.data && error.response.data.message){
            //exibe mensagens de erro se for um array
            if(Array.isArray(error.response.data.message)){
                setError(error.response.data.message.join(" - "));
            }else{
                //exibe uma unica mensagem de erro
             setError(error.response.data.message); 
            }
        }else{
            setError("Erro ao criar a situação!");
        }
    }finally{
        //termina o carregamento 
        setLoading(false);
    }
  }
  return(
    <Layout>
      <main className="main-content">
        <div className="content-wrapper">
          <div className="content-header">
            <h2 className="content-title">Situação</h2>
            <nav className="breadcrumb">
              <Link href="/dashboard" className="breadcrumb-link">
                Dashboard
              </Link>
              <span> / </span>
              <Link href="/situations/list" className="breadcrumb-link">
             Situações
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
              <a href="/situations/list" className="btn-info">
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
                        placeholder="Nome da situação"
                        {...register('nameSituation')}
                        className="form-input"/>
                  {/* exibe o erro de validação do campo */}
                  {errors.nameSituation &&  <AlertMessage type="error" message={errors.nameSituation.message ?? null}/>}
                    </div>
                <button type="submit" disabled={loading} className="btn-success">
                    {loading ? "Salvando..." : "Salvar"}
                </button>
            </form>
          </div>
      </main>
    </Layout>
  )
}
