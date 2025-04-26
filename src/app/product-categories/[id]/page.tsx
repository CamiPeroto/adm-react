'use client'
import { useEffect, useState } from "react";
//hook pra manipular navegação do usuário
import { useRouter } from "next/navigation";
import instance from "@/service/api";
import Menu from "@/app/components/Menu";
import Link from "next/link";
import { useParams } from "next/navigation";
import DeleteButton from "@/app/components/DeleteButton";
import ProtectedRoute from "@/app/components/ProtectedRoute";

interface ProductCategory {
    id: number,
    name: string,
    createdAt: Date,
    updatedAt: Date,
}
export default function ProductCategoryDetails(){
    //usar o useparams para acessar o id da url
    const { id } = useParams();
       //instanciar o objeto router
       const router = useRouter();

    const [productCategory, setProductCategory] = useState<ProductCategory | null>(null);  //Apresentar carregamento
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    //Função para buscar a situação 
    const fetchCategoryDetails = async (id: string) => {
        try{
            //Iniciar o carregamento 
            setLoading(true);
            const response = await instance.get(`/product-categories/${id}`);
            //Atualizar o estado com os dados da API
            setProductCategory (response.data);
            //Terminar o carregamento
            setLoading(false);
        } catch (error: any){
            //Verificar se o erro contem mensagens de validação
            if(error.response && error.response.data){
                    //se for só 1, atribuir a resposta retornada pela API
                    setError(error.response.data.message);
            }else{
                setError("Erro ao carregar a categoria do produto!");  
            }
            setLoading(false);
        }
    }
      //Atualizar a lista de registros após apagar um registro
      const handleSuccess = () =>{
        //salvar a mensagem no sessionStorage antes de redirecionar
        sessionStorage.setItem("successMessage", "Registro apagado com sucesso!");
        //redireciona para a página listar
        router.push("/product-categories/list");
      }

    useEffect(()=>{
        if(id){
            //garantir que o id seja uma string
            const categoryId = Array.isArray(id) ? id[0]: id;
            // buscar os dados da situação se o id estiver disponível
            fetchCategoryDetails(categoryId);
        }
    }, [id]); //Recarregar os dados quando o ID mudar

    return(
        <ProtectedRoute>
             <Menu/> <br />
             <Link href={`/product-categories/list`}>Listar</Link>
              <Link href={`/product-categories/${id}/edit`}>Editar</Link>

             {productCategory && !loading && !error &&(
               <DeleteButton
               id={String(productCategory.id)}
               route="product-categories"
               onSuccess={handleSuccess}
               setError={setError}
               setSuccess={setSuccess}
               />
             )}
             <h1>Detalhes da Categoria</h1><br />

            {/* exibir mensagem de carregamento */}
            {loading && <p>Carregando...</p>}
            {/* exibir erro, se houver */}
            {error && <p style ={{color: "#f00"}}>{error}</p>}
            {/* exibir sucesso, se houver */}
            {success && <p style ={{color: "#086"}}>{success}</p>}

            {/* Imprimir os detalhes do Registro */}
            {productCategory && !loading && !error &&(
                <div>
                    <p>ID: {productCategory.id}  </p>
                    <p>Nome da Categoria: {productCategory.name}  </p>
                    <p>Cadastrado em: {new Date(productCategory.createdAt).toLocaleString()}</p>
                    <p>Editado em: {new Date(productCategory.updatedAt).toLocaleString()}</p>
                </div>
            )}
        </ProtectedRoute>
    )
}