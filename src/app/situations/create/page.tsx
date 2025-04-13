"use client";
import { useState } from "react";
import instance from "@/service/api";
import Menu from "@/app/components/Menu";
import Link from "next/link";

export default function CreateSituation() {
  //Estado para o campo nameSituation
  const [nameSituation, setNameSituation] = useState<string>("");
  //Apresentar carregamento
  const [loading, setLoading] = useState<boolean>(false);
  //Apresentar erros
  const [error, setError] = useState<string | null>(null);
  //Apresentar sucesso
  const [success, setSuccess] = useState<string | null>(null);
  
  //Função para enviar os dados para a API
  const handleSubmit = async (event: React.FormEvent) => {
    //evitar o recarregar da página ao enviar o form
    event.preventDefault();
    //inicia o carregamento
    setLoading(true);
    //limpa o erro anterior
    setError(null);
    //limpa o sucesso anterior
    setSuccess(null);

    try{
        //fazer a requisição pra api e enviar os dados
        const response = await instance.post("/situations", {
            nameSituation: nameSituation,
        });
        //exibir mensagem de sucesso
        setSuccess(response.data.message || "Situação Cadastrada com sucesso!");
        //limpa o campo do formulário
        setNameSituation("");

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
    <div>
       <Menu/> <br />

       <Link href={`/situations/list`}>Listar</Link><br />
       <h1>Cadastrar Situaçao</h1><br />
        {/* exibir mensagem de carregamento */}
        {loading && <p>Carregando...</p>}
        {/* exibir erro, se houver */}
        {error && <p style ={{color: "#f00"}}>{error}</p>}
        {/* exibir sucesso, se houver */}
        {success && <p style ={{color: "#086"}}>{success}</p>}

        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="nameSituation">Nome da Situação: </label>
                <input 
                type="text" 
                id="nameSituation" 
                value = {nameSituation} 
                placeholder="Nome da Situação" 
                className="border"
                onChange={(e) => setNameSituation(e.target.value)}
                />
            </div>
            <button type="submit" disabled ={loading}>
                {loading ? "Enviando..." : "Cadastrar"}
            </button>
        </form>
    </div>
  )
}
