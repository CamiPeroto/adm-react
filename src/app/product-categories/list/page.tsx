'use client'
import instance from "@/service/api";
import { useEffect, useState } from "react";
import Menu from "@/app/components/Menu";
import Pagination from "@/app/components/Pagination";
import Link from "next/link";
import DeleteButton from "@/app/components/DeleteButton";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Layout from "@/app/components/Layout";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import AlertMessage from "@/app/components/AlertMessage";

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
        <Layout>
        <main className="main-content">
          <div className="content-wrapper">
            <div className="content-header">
              <h2 className="content-title">Categorias de Produto</h2>
              <nav className="breadcrumb">
                <Link href="/dashboard" className="breadcrumb-link">
                  Dashboard
                </Link>
                <span> / </span>
                <span>Categorias de Produto</span>
              </nav>
            </div>
          </div>
          <div className="content-box">
            <div className="content-box-header">
              <h3 className="content-box-title">Listar</h3>
              <div className="content-box-btn">
                <a href="/product-categories/create" className="btn-success align-icon-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </a>
              </div>
            </div>
  
              {/* exibir mensagem de carregamento */}
              {loading && <LoadingSpinner/>}
              {/* exibir erro, se houver */}
              <AlertMessage type="error" message={error}/>
              {/* exibir sucesso, se houver */}
              <AlertMessage type="success" message={success}/>
              
            <div className="table-container mt-6">
              <table className="table">
                <thead>
                  <tr className="table-row-header">
                    <th className="table-header">ID</th>
                    <th className="table-header">Categoria</th>
                    <th className="table-header center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                {productCategories.map((productCategory) => (
                  <tr className="table-row-body" key={productCategory.id}>
                    <td className="table-body">{productCategory.id}</td>
                    <td className="table-body">{productCategory.name}</td>
                    <td className="table-body table-actions">
                    
                    <a href={`/product-categories/${productCategory.id}`} className="btn-primary flex items-center space-x-1">
                            
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>   
  
                          </a>
  
                          <a href={`/product-categories/${productCategory.id}/edit`} className="btn-warning hidden md:flex items-center space-x-1">
  
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>   
                          </a>
                        
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
            </div>
          </div>
        </main>
      </Layout>
    )
}