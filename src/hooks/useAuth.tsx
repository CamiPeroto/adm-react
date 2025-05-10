//hook pra manipular navegação do usuário
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import instance from "@/service/api";

export function useAuth(){
    
    //instanciar o objeto router
    const router = useRouter();

    //estado para armazenar a autenticação
    const[ authenticated, setAuthenticated ] = useState<boolean>(false);
   
    //Apresentar carregamento
    const [loading, setLoading] = useState<boolean>(true);
    
    //hook para verificar se o token existe
    useEffect(()=>{
        //recuperar o token do localStorage
        const token = localStorage.getItem("token");

        //verificar se o token existe
        if(!token){
            //redireciona para o login se não estiver autenticado
            router.push("/login");
        }
            //função para validar o token
            const validateToken = async() => {
                try{
                    //fazer requisição para a API
                    await instance.get("/validate-token");
                     
                    //atribui a situação da autenticação
                     setAuthenticated(true);

                }catch(error){
                    //remover token inválido
                    localStorage.removeItem("token");
                    
                    //redireciona para o login se o token for inválido
                    router.push("/login");
                }  finally{
                    setLoading(false);
                }
        }
        //chamar a função
        validateToken();

    }, []); //colchete para executar somente uma vez
    
    //retornar a situação da autenticação
    return { authenticated, loading };
}