//hook pra manipular navegação do usuário
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth(){
    
    //instanciar o objeto router
    const router = useRouter();

    //estado para armazenar a autenticação
    const[ authenticated, setAuthenticated ] = useState<boolean>(false);
    
    //hook para verificar se o token existe
    useEffect(()=>{
        //recuperar o token do localStorage
        const token = localStorage.getItem("token");

        //verificar se o token existe
        if(!token){
            //redireciona para o login se não estiver autenticado
            router.push("/login");
        }else{
            //atribui a situação da autenticação
            setAuthenticated(true);
        }
    }, []); //colchete para executar somente uma vez
    
    //retornar a situação da autenticação
    return { authenticated };
}