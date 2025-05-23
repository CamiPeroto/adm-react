'use client'
import { useEffect, useState } from "react";
import instance from "@/service/api";
import Menu from "@/app/components/Menu";
import DeleteButton from "@/app/components/DeleteButton";
import Link from "next/link";
import { useParams } from "next/navigation";
//hook pra manipular navegação do usuário
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoute";

interface ProductSituation {
    id: number,
    name: string,
    createdAt: Date,
    updatedAt: Date,
}

export default function ProductSituationDetails(){
    //usar o useparams para acessar o id da url
    const { id } = useParams();
      //instanciar o objeto router
      const router = useRouter();

    const [productSituation, setProductSituation] = useState<ProductSituation | null>(null);  //Apresentar carregamento
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    //Função para buscar a situação 
    const fetchProductSituationDetails = async (id: string) => {
        try{
            //Iniciar o carregamento 
            setLoading(true);
            const response = await instance.get(`/product-situations/${id}`);
            //Atualizar o estado com os dados da API
            setProductSituation (response.data);
            //Terminar o carregamento
            setLoading(false);
        } catch (error: any){
            //Verificar se o erro contem mensagens de validação
            if(error.response && error.response.data){
            
                    //se for só 1, atribuir a resposta retornada pela API
                    setError(error.response.data.message);
          
            }else{
                setError("Erro ao carregar os detalhes da situação do produto!");  
            }
            setLoading(false);
        }
    }
      //Atualizar a lista de registros após apagar um registro
      const handleSuccess = () =>{
        //salvar a mensagem no sessionStorage antes de redirecionar
        sessionStorage.setItem("successMessage", "Registro apagado com sucesso!")
        //redireciona para a página listar
        router.push("/product-situations/list");
      }
    useEffect(()=>{
        if(id){
            //garantir que o id seja uma string
            const situationId = Array.isArray(id) ? id[0]: id;
            // buscar os dados da situação se o id estiver disponível
            fetchProductSituationDetails(situationId);
        }

    }, [id]); //Recarregar os dados quando o ID mudar

    return(
        <ProtectedRoute>
             <Menu/> <br />
             <Link href={`/product-situations/list`}>Listar</Link> <br />
             <Link href={`/product-situations/${id}/edit`}>Editar</Link>

             {productSituation && !loading && !error &&(
               <DeleteButton
               id={String(productSituation.id)}
               route="product-situations"
               onSuccess={handleSuccess}
               setError={setError}
               setSuccess={setSuccess}
               />
             )}
             <h1>Detalhes da situação</h1><br />

            {/* exibir mensagem de carregamento */}
            {loading && <p>Carregando...</p>}
            {/* exibir erro, se houver */}
             {error && <p style ={{color: "#f00"}}>{error}</p>}
             {/* exibir sucesso, se houver */}
            {success && <p style ={{color: "#086"}}>{success}</p>}

            {/* Imprimir os detalhes do Registro */}
            {productSituation && !loading && !error &&(
                <div>
                    <p>ID: {productSituation.id}  </p>
                    <p>Nome da Situação: {productSituation.name}  </p>
                    <p>Cadastrado em: {new Date(productSituation.createdAt).toLocaleString()}</p>
                    <p>Editado em: {new Date(productSituation.updatedAt).toLocaleString()}</p>
                </div>
            )}
        </ProtectedRoute>
    )
}