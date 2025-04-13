"use client";
import React, { useEffect, useState } from "react";
import instance from "@/service/api";
import Menu from "@/app/components/Menu";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EditProductCategory() {
  //usar o useparams para acessar o id da url
  const { id } = useParams();
  //Estado para o campo name
  const [name, setName] = useState<string>("");
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
      setName(response.data.name);
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
  //função para enviar os dados utilizados para a API
  const handleSubmit = async (event: React.FormEvent)=>{
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
          const response = await instance.put(`/product-categories/${id}`, {
          name: name,
        });
        //exibir mensagem de sucesso
        setSuccess(response.data.message || "Categoria do produto editada com sucesso!");
        //limpa o campo do formulário
        // setNameSituation("");

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

     <form onSubmit={handleSubmit}>
         <div>
             <label htmlFor="name">Nome da Categoria: </label>
             <input 
             type="text" 
             id="name" 
             value = {name} 
             placeholder="Nome da Categoria" 
             onChange={(e) => setName(e.target.value)}
             className="border"
             />
         </div>
         <button type="submit" disabled ={loading}>
             {loading ? "Enviando..." : "Salvar"}
         </button>
     </form>
 </div>
  )
}
