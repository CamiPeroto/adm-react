"use client";
import { useState } from "react";
import instance from "@/service/api";
import Menu from "@/app/components/Menu";
import Link from "next/link";

export default function CreateProductCategory() {
  //Estado para o campo name
  const [name, setName] = useState<string>("");
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
        const response = await instance.post("/product-categories", {
            name: name,
        });
        //exibir mensagem de sucesso
        setSuccess(response.data.message || "Categoria cadastrada com sucesso!");
        //limpa o campo do formulário
        setName("");

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
            setError("Erro ao criar a categoria!");
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

       <Link href={`/product-categories/list`}>Listar Cat</Link><br />
       <h1>Cadastrar Categoria</h1><br />
        {/* exibir mensagem de carregamento */}
        {loading && <p>Carregando...</p>}
        {/* exibir erro, se houver */}
        {error && <p style ={{color: "#f00"}}>{error}</p>}
        {/* exibir sucesso, se houver */}
        {success && <p style ={{color: "#086"}}>{success}</p>}

        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Nome da Categoria: </label>
                <input 
                type="text" 
                id="name" 
                value = {name} 
                placeholder="Nome da Categoria" 
                className="border"
                onChange={(e) => setName(e.target.value)}
                />
            </div>
            <button type="submit" disabled ={loading}>
                {loading ? "Enviando..." : "Cadastrar"}
            </button>
        </form>
    </div>
  )
}
