'use client'
import { useEffect, useState } from "react";
import instance from "@/service/api";
import Menu from "@/app/components/Menu";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Situation {
    id: number,
    nameSituation: string,
    createdAt: Date,
    updatedAt: Date,
}

export default function SituationDetails(){
    //usar o useparams para acessar o id da url
    const { id } = useParams();

    const [situation, setSituation] = useState<Situation | null>(null);  //Apresentar carregamento
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    //Função para buscar a situação 
    const fetchSituationDetails = async (id: string) => {
        try{
            //Iniciar o carregamento 
            setLoading(true);
            const response = await instance.get(`/situations/${id}`);
            //Atualizar o estado com os dados da API
            setSituation (response.data);
            //Terminar o carregamento
            setLoading(false);
        } catch (error: any){
            //Verificar se o erro contem mensagens de validação
            if(error.response && error.response.data){
            
                    //se for só 1, atribuir a resposta retornada pela API
                    setError(error.response.data.message);
          
            }else{
                setError("Erro ao carregar os detalhes da situação!");  
            }
            setLoading(false);
        }
    }
    useEffect(()=>{
        if(id){
            //garantir que o id seja uma string
            const situationId = Array.isArray(id) ? id[0]: id;
            // buscar os dados da situação se o id estiver disponível
            fetchSituationDetails(situationId);
        }

    }, [id]); //Recarregar os dados quando o ID mudar

    return(
        <div>
             <Menu/> <br />
             <Link href={`/situations/list`}>Listar</Link>
             <h1>Detalhes da situação</h1><br />

            {/* exibir mensagem de carregamento */}
            {loading && <p>Carregando...</p>}
            {/* exibir erro, se houver */}
            {error && <p>{error}</p>}

            {/* Imprimir os detalhes do Registro */}
            {situation && !loading && !error &&(
                <div>
                    <p>ID: {situation.id}  </p>
                    <p>Nome da Situação: {situation.nameSituation}  </p>
                    <p>Cadastrado em: {new Date(situation.createdAt).toLocaleString()}</p>
                    <p>Editado em: {new Date(situation.updatedAt).toLocaleString()}</p>

                </div>
            )}



        </div>
    )
}