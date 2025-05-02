//permite que o children seja qualquer coisa renderizável em jsx
import { ReactNode } from "react";
//hook responsável por validar o token
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/app/components/LoadingSpinner";

//Criar initerface para tipar o parametro children do componente
interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({children} : ProtectedRouteProps){
    
    //Acessar a propriedade authenticated
    const { authenticated } = useAuth();
    //Verifica se está autenticado
    if(!authenticated){
        //mostrar algo enquanto redireciona
        return <LoadingSpinner/>
    }
    //Retorna o conteúdo protegido caso o usuário esteja autenticado
    return <>{ children }</>
}