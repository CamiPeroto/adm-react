"use client";
import { useState } from "react";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import instance from "@/service/api";
import Menu from "@/app/components/Menu";
import Link from "next/link";

//esquema de validação com yup
const schema = yup.object().shape({
name: yup.string().required("O campo nome da situação é obrigatório!")
.min(3, "A situação deve ter pelo menos 3 caracteres"),
});

export default function CreateProductSituation() {
  //Apresentar carregamento
  const [loading, setLoading] = useState<boolean>(false);
  //Apresentar erros
  const [error, setError] = useState<string | null>(null);
  //Apresentar sucesso
  const [success, setSuccess] = useState<string | null>(null);
  const {register, handleSubmit, formState: {errors}, reset} = useForm({
      resolver:yupResolver(schema),
    })
  
  //Função para enviar os dados para a API
  const onSubmit = async (data: {name: string}) => {
    //inicia o carregamento
    setLoading(true);
    //limpa o erro anterior
    setError(null);
    //limpa o sucesso anterior
    setSuccess(null);

    try{
        //fazer a requisição pra api e enviar os dados
        const response = await instance.post("/product-situations", data);
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
            setLoading(false);
        }
    }finally{
        //termina o carregamento 
        setLoading(false);
    }
  }
  return(
    <div>
       <Menu/> <br />

       <Link href={`/product-situations/list`}>Listar</Link><br />
       <h1>Cadastrar Situaçao de Produto</h1><br />
        {/* exibir mensagem de carregamento */}
        {loading && <p>Carregando...</p>}
        {/* exibir erro, se houver */}
        {error && <p style ={{color: "#f00"}}>{error}</p>}
        {/* exibir sucesso, se houver */}
        {success && <p style ={{color: "#086"}}>{success}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="name">Nome da Situação: </label>
                <input 
                type="text" 
                id="name" 
                {...register('name')}
                placeholder="Nome da Situação" 
                className="border"
                />
                 {/* exibe o erro de validação do campo */}
                 {errors.name && <p style ={{color: "#f00"}}>{errors.name.message}</p>}
            </div>
            <button type="submit" disabled ={loading}>
                {loading ? "Enviando..." : "Cadastrar"}
            </button>
        </form>
    </div>
  )
}
