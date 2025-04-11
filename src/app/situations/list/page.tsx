'use client'
import Menu from "@/app/components/Menu";
import Pagination from "@/app/components/Pagination";
import instance from "@/service/api";
import Link from "next/link";
import { useEffect, useState } from "react";

//definir tipos para a resposta da API
interface Situation {
    id: number,
    nameSituation: string,
    createdAt: Date,
    updatedAt: Date,

}

export default function SituationList(){
    const [situations, setSituations] = useState<Situation[]>([]);
    //Apresentar carregamento
    const [loading, setLoading] = useState<boolean>(true);
    //Apresentar erros
    const [error, setError] = useState<string | null>(null);
    //Página atual
    const [currentPage, setCurrentPage] = useState <number>(1);
    //última Página
    const [lastPage, setLastPage] = useState <number>(1);

    //Função para buscar as situações da API
    const fetchSituations = async (page:number) =>{
        try{
            //Iniciar o carregamento 
            setLoading(true);
            //Fazer a requisição à API
            const response = await instance.get(`/situations?page=${page}&limit=10`);
            //Atualizar o estado com os dados da API
            setSituations (response.data.data);
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
    //hook para buscar os dados na primeira renderização
    useEffect(()=> {
        //Buscar os dados ao carregar a página
        fetchSituations(currentPage);

    }, [currentPage]); //Recarregar os dados sempre que a página for alterada

    return(
        <div>
           <Menu/> <br />
            <h1>Listar as situações</h1><br />

            {/* exibir mensagem de carregamento */}
            {loading && <p>Carregando...</p>}
            {/* exibir erro, se houver */}
            {error && <p>{error}</p>}

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
                        {situations.map((situation) => (
                            <tr key = {situation.id}>
                                <td>{situation.id}</td>
                                <td>{situation.nameSituation}</td>
                                <td>
                                   <Link href={`/situations/${situation.id}`}> Visualizar </Link>
                                     - Editar - Apagar</td>
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