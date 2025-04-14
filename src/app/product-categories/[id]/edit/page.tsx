"use client";
import React, { useEffect, useState } from "react";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import instance from "@/service/api";
import Menu from "@/app/components/Menu";
import Link from "next/link";
import { useParams } from "next/navigation";

//esquema de validação com yup
const schema = yup.object().shape({
name: yup.string().required("O campo nome da categoria é obrigatório!")
.min(3, "O nome da categoria deve ter pelo menos 3 caracteres!"),
});

export default function EditProductCategory() {
  //usar o useparams para acessar o id da url
  const { id } = useParams();
  //Apresentar carregamento
  const [loading, setLoading] = useState<boolean>(false);
  //Apresentar erros
  const [error, setError] = useState<string | null>(null);
  //Apresentar sucesso
  const [success, setSuccess] = useState<string | null>(null);

  //Função para recuperar os dados da situação a ser editada
  const fetchProductCategoryDetails = async () => {
    try {
      //Iniciar o carregamento
      setLoading(true);
      const response = await instance.get(`/product-categories/${id}`);
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
        setError("Erro ao editar a categoria!");
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
          const response = await instance.put(`/product-categories/${id}`, data);
        //exibir mensagem de sucesso
        setSuccess(response.data.message || "Categoria do produto editada com sucesso!");  
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
    setError("Erro ao editar a categoria do produto!");
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
      fetchProductCategoryDetails();
    }
  }, [id]); //recarrega os dados quando o id mudar
  return(
    <div>
    <Menu/> <br />

    <Link href={`/product-categories/list`}>Listar</Link><br /><br />
    <h1>Editar Categoria</h1><br />
     {/* exibir mensagem de carregamento */}
     {loading && <p>Carregando...</p>}
     {/* exibir erro, se houver */}
     {error && <p style ={{color: "#f00"}}>{error}</p>}
     {/* exibir sucesso, se houver */}
     {success && <p style ={{color: "#086"}}>{success}</p>}

     <form onSubmit={handleSubmit(onSubmit)}>
         <div>
             <label htmlFor="name">Nome da Categoria: </label>
             <input 
             type="text" 
             id="name" 
             {...register('name')}
             placeholder="Nome da Categoria" 
             className="border"
             />
             {/* Exibe o erro de validação do campo */}
             {errors.name && <p style={{ color: "#f00" }}>{errors.name.message}</p>}
         </div>
         <button type="submit" disabled ={loading}>
             {loading ? "Enviando..." : "Salvar"}
         </button>
     </form>
 </div>
  )
}
