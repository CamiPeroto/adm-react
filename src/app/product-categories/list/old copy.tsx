'use client'
import instance from "@/service/api";
import { useEffect, useState } from "react";
import Menu from "@/app/components/Menu";
import Pagination from "@/app/components/Pagination";
import Link from "next/link";
import DeleteButton from "@/app/components/DeleteButton";
import ProtectedRoute from "@/app/components/ProtectedRoute";

//definir tipos para a resposta da API
interface productCategory {
    id: number,
    name: string,
    createdAt: Date,
    updatedAt: Date,

}

export default function productCategoryList(){
    const [productCategories, setProductCategories] = useState<productCategory[]>([]);
    //Apresentar carregamento
    const [loading, setLoading] = useState<boolean>(true);
    //Apresentar erros
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    //Página atual
    const [currentPage, setCurrentPage] = useState <number>(1);
    //última Página
    const [lastPage, setLastPage] = useState <number>(1);

    //Função para buscar as situações da API
    const fetchProductCategories = async (page:number) =>{
        try{
            //Iniciar o carregamento 
            setLoading(true);
            //Fazer a requisição à API
            const response = await instance.get(`/product-categories?page=${page}&limit=10`);
            //Atualizar o estado com os dados da API
            setProductCategories (response.data.data);
            //Atualizar a página atual
            setCurrentPage (response.data.currentPage)
            //Atualizar a última página
            setLastPage (response.data.lastPage)
            //Terminar o carregamento
            setLoading(false);

        } catch (error){
            setError("Erro ao carregar as categorias!");
            setLoading(false);
        }
    };
    //Atualizar a lista de registros após apagar um registro
    const handleSuccess = () =>{
        fetchProductCategories(currentPage)
    }
    //hook para buscar os dados na primeira renderização
    useEffect(()=> {
          //recuperar a mensagem salva no sessionStorage do visualizar
          const message = sessionStorage.getItem("successMessage");
          //verificar se existe a mensagem
          if(message){
              //atribui a mensagem
              setSuccess(message);
              sessionStorage.removeItem("successMessage");
          }
        //Buscar os dados ao carregar a página
        fetchProductCategories(currentPage);

    }, [currentPage]); //Recarregar os dados sempre que a página for alterada
    
    return(
        <ProtectedRoute>
             <Menu/> <br />
             <Link href = {`/product-categories/create`}>Cadastrar</Link> <br />
            <h1>Listar as categorias</h1>

            {/* exibir mensagem de carregamento */}
            {loading && <p>Carregando...</p>}
            {/* exibir erro, se houver */}
            {error && <p style ={{color: "#f00"}}>{error}</p>}
            {/* exibir sucesso, se houver */}
            {success && <p style ={{color: "#086"}}>{success}</p>}

            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                          <th>ID</th>  
                          <th> Nome da Categoria</th> 
                          <th>Ações</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {productCategories.map((productCategory) => (
                            <tr key = {productCategory.id}>
                                <td>{productCategory.id}</td>
                                <td>{productCategory.name}</td>
                                <td> <Link href={`/product-categories/${productCategory.id}`}> Visualizar </Link>
                                <Link href={`/product-categories/${productCategory.id}/edit`}> - Editar  </Link>   
                                
                                <DeleteButton
                                   id={String(productCategory.id)}
                                   route="product-categories"
                                   onSuccess={handleSuccess}
                                   setError={setError}
                                   setSuccess={setSuccess}
                                   />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <br />
            <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={setCurrentPage}
            />
        </ProtectedRoute>
    )
}