'use client'
import instance from "@/service/api";
import { useEffect, useState } from "react";
import Menu from "@/app/components/Menu";
import DeleteButton from "@/app/components/DeleteButton"; 
import Pagination from "@/app/components/Pagination";
import Link from "next/link";
import ProtectedRoute from "@/app/components/ProtectedRoute";

//definir tipos para a resposta da API
interface productSituation {
    id: number,
    name: string,
    createdAt: Date,
    updatedAt: Date,
}

export default function productSituationList(){
    const [productSituations, setProductSituations] = useState<productSituation[]>([]);
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
    const fetchProductSituations = async (page:number) =>{
        try{
            //Iniciar o carregamento 
            setLoading(true);
            //Fazer a requisição à API
            const response = await instance.get(`/product-situations?page=${page}&limit=10`);
            //Atualizar o estado com os dados da API
            setProductSituations (response.data.data);
            //Atualizar a página atual
            setCurrentPage (response.data.currentPage)
            //Atualizar a última página
            setLastPage (response.data.lastPage)
            //Terminar o carregamento
            setLoading(false);

        } catch (error){
            setError("Erro ao carregar as situações!");
            setLoading(false);
        } 
    };

     //Atualizar a lista de registros após apagar um registro
     const handleSuccess = () =>{
        fetchProductSituations(currentPage)
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
        fetchProductSituations(currentPage);

    }, [currentPage]); //Recarregar os dados sempre que a página for alterada

    return(
        <ProtectedRoute>
             <Menu/><br />
             <Link href = {`/product-situations/create`}>Cadastrar</Link> <br />
            <h1>Listar as situações</h1>

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
                          <th> Nome da Situação</th> 
                          <th>Ações</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {productSituations.map((productSituation) => (
                            <tr key = {productSituation.id}>
                                <td>{productSituation.id}</td>
                                <td>{productSituation.name}</td>
                                <td> <Link href={`/product-situations/${productSituation.id}`}> Visualizar </Link>  
                                <Link href={`/product-situations/${productSituation.id}/edit`}> - Editar  </Link>
                                <DeleteButton
                                   id={String(productSituation.id)}
                                   route="product-situations"
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
            {/* Paginação */}
            <br />
            <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={setCurrentPage}
            />
        </ProtectedRoute>
    );
}