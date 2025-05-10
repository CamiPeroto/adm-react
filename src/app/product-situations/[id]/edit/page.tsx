"use client";
import React, { useEffect, useState } from "react";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import instance from "@/service/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import Layout from "@/app/components/Layout";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import AlertMessage from "@/app/components/AlertMessage";

//esquema de validação com yup
const schema = yup.object().shape({
name: yup.string().required("O campo nome é obrigatório!")
.min(3, "O nome deve ter pelo menos 3 caracteres!"),
});

export default function EditProductSituation() {
  //usar o useparams para acessar o id da url
  const { id } = useParams();
  //Apresentar carregamento
  const [loading, setLoading] = useState<boolean>(false);
  //Apresentar erros
  const [error, setError] = useState<string | null>(null);
  //Apresentar sucesso
  const [success, setSuccess] = useState<string | null>(null);

  //Função para recuperar os dados da situação a ser editada
  const fetchProductSituationDetails = async () => {
    try {
      //Iniciar o carregamento
      setLoading(true);
      const response = await instance.get(`/product-situations/${id}`);
      //Preenche o campo com os dados existentes
      reset({name: response.data.name});
    } catch (error: any) {
      //verifica se o erro contem mensagens de validação
      if (error.response && error.response.data && error.response.data.message) {
        //exibe mensagens de erro se for um array
        if (Array.isArray(error.response.data.message)) {
          setError(error.response.data.message.join(" - "));
        } else {
          //exibe uma unica mensagem de erro
          setError(error.response.data.message);
        }
      } else {
        setError("Erro ao editar a situação!");
      }
    } finally {
      //termina o carregamento
      setLoading(false);
    }
  };

   const {register, handleSubmit, formState: {errors}, reset} = useForm({
      resolver:yupResolver(schema),
    });
  //função para enviar os dados utilizados para a API
  const onSubmit = async (data: {name: string}) => {
    //inicia o carregamento
    setLoading(true);
    //limpa o erro anterior
    setError(null);
    //limpa o sucesso anterior
    setSuccess(null);

    try{
        //fazer a requisição pra api e enviar os dados
          const response = await instance.put(`/product-situations/${id}`, data);
        //exibir mensagem de sucesso
        setSuccess(response.data.message || "Situação do produto editada com sucesso!");
        //limpa o campo do formulário
        // setName("");

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
    setError("Erro ao editar a situação do produto!");
}
    }finally{
        //termina o carregamento 
        setLoading(false);
    }
  }
  //Chamar a função fetchSituation quando o componente é montado
  useEffect(() => {
    if (id) {
      //buscar os dados da situação se o id estiver disponível
      fetchProductSituationDetails();
    }
  }, [id]); //recarrega os dados quando o id mudar
  return(
    <Layout>

            <main className="main-content">
                <div className="content-wrapper">
                    <div className="content-header">
                        <h2 className="content-title">Sitação de Produto</h2>
                        <nav className="breadcrumb">
                            <Link href="/dashboard" className="breadcrumb-link">Dashboard</Link>
                            <span> / </span>
                            <Link href="/product-situations/list" className="breadcrumb-link">Situações de Produto</Link>
                            <span> / </span>
                            <span>Editar</span>
                        </nav>
                    </div>
                </div>

                <div className="content-box">
                    <div className="content-box-header">
                        <h3 className="content-box-title">Editar</h3>
                        <div className="content-box-btn">
                            <a href="/product-situations/list" className="btn-info align-icon-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                    stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                                </svg>
                                <span>Listar</span>
                            </a>

                            <a href={`/product-situations/${id}`} className="btn-primary align-icon-btn">
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
                                placeholder="Nome da Situação"
                                {...register('name')}
                                className="form-input"
                            />
                            {/* Exibe o erro de validação do campo */}
                            {errors.name && <AlertMessage type="error" message={errors.name.message ?? null} />}
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
