'use client'
import instance from "@/service/api";
import { useEffect, useState } from "react";
import Menu from "@/app/components/Menu";
import Pagination from "@/app/components/Pagination";
import Link from "next/link";

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
    //Página atual
    const [currentPage, setCurrentPage] = useState <number>(1);
    //última Página
    const [lastPage, setLastPage] = useState <number>(1);

    //Função para buscar as situações da API
    const fetchCategories = async (page:number) =>{
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
    //hook para buscar os dados na primeira renderização
    useEffect(()=> {
        //Buscar os dados ao carregar a página
        fetchCategories(currentPage);

    }, [currentPage]); //Recarregar os dados sempre que a página for alterada
    
    return(
        <div>
             <Menu/> <br />
             <Link href = {`/product-categories/create`}>Cadastrar</Link> <br />
            <h1>Listar as categorias</h1>

            {/* exibir mensagem de carregamento */}
            {loading && <p>Carregando...</p>}
            {/* exibir erro, se houver */}
            {error && <p>{error}</p>}

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
                                <td>Visualizar - Editar - Apagar</td>
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
        </div>
    )
}