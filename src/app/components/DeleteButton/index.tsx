import instance from "@/service/api";
//hooks do react
import {  useState } from "react";

interface DeleteButtonProps{
    id:string;
    route: string;
    onSuccess ?: () => void;
    setError: (message: string | null) => void;
    setSuccess: (message: string | null) => void;
}

const DeleteButton = ({id, route, onSuccess, setError, setSuccess}:
DeleteButtonProps ) =>{
    //Apresentar carregamento
    const [loading, setLoading] = useState<boolean>(false);
    const handleDelete = async() =>{
        //Evitar múltiplos cliques
        if(loading) return;

        setLoading(true);
        //limpa o erro anterior
         setError(null);
         //limpa o sucesso anterior
         setSuccess(null);

         try{
            //Fazer a requisição para a API
            const response = await instance.delete(`/${route}/${id}`)

            setSuccess(response.data.message || "Registro apagado com sucesso!")
            
            if(onSuccess){
                onSuccess();
            }
            
         }catch(error: any){
            setError(error.response?.data?.message || "Erro ao excluir o registro!");
         }finally{
            setLoading(false);
         }
    }
    return(
        <div>
            <button  onClick = {handleDelete} disabled={loading}>
                {loading ? "Excluindo..." : "Apagar"}
            </button>
        </div>
    );

}
export default DeleteButton;
