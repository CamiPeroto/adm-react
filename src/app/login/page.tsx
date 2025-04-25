"use client";
import { useState } from "react";//importar hooks para usar UseState
//importa hooks para manipular a navegação do usuário
import { useRouter } from "next/navigation";
//adaptador para conectar o react-hook-form com bibliotecas de validação yup
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import instance from "@/service/api";
import Link from "next/link";

//esquema de validação com yup
const schema = yup.object().shape({
email: yup
.string()
.email( "E-mail inválido!")
.required("O campo email é obrigatório!"),
password: yup
.string()
.required("A senha é obrigatória!")
});

export default function LoginPage(){
    //instaciar o objeto router para redirecionamentos
    const router = useRouter();
    //Apresentar o carregamento
    const [loading, setLoading] = useState<boolean>(false);
    //Apresentar erros
    const [error, setError] = useState<string | null>(null);
    //Apresentar sucesso
    const [success, setSuccess] = useState<string | null>(null);

    //iniciar o formulário com as validações
    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        resolver:yupResolver(schema),
      });

 //Função para enviar os dados para a API validar
  const onSubmit = async (data: { email: string; password: string }) => {
    //inicia o carregamento
    setLoading(true);
    //limpa o erro anterior
    setError(null);
    //limpa o sucesso anterior
    setSuccess(null);

    try{
        //fazer a requisição pra api e enviar os dados
       const response = await instance.post("/", data);
        //exibir mensagem de sucesso
        // alert(response.data.message ||"Login realizado com sucesso!");
        console.log(response.data)
        //redirecionar para o dashboard
        // router.push("/dashboard")

    }catch(error: any){
        //verifica se o erro contem mensagens de validação
        if(error.response && error.response.data && error.response.data.message){
            //exibe mensagens de erro se for um array
            if(Array.isArray(error.response.data.message)){
                setError(error.response.data.message.join(" - "));
            }else{
                //exibe uma unica mensagem de erro
             setError(error.response.data.message); 
            }
        }else{
            setError("Erro ao realizar login. Tente novamente");
        }
    }finally{
        //termina o carregamento 
        setLoading(false);
    }
}
    return(
        <div>
                <h1>Login</h1>
                {/* exibir mensagem de carregamento */}
                {loading && <p>Carregando...</p>}
                {/* exibir erro, se houver */}
                {error && <p style ={{color: "#f00"}}>{error}</p>}
                {/* exibir sucesso, se houver */}
                {success && <p style ={{color: "#086"}}>{success}</p>}
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email">E-mail: </label>
                        <input 
                            type="text" 
                            id="email" 
                            placeholder="email@example.com" 
                            {...register('email')}
                            className="border"
                        />
                        {/* exibe o erro de validação do campo */}
                        {errors.email && <p style ={{color: "#f00"}}>{errors.email.message}</p>}
                     </div>
                     <div>
                        <label htmlFor="password">Senha: </label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Digite sua senha" 
                            {...register('password')}
                            className="border"
                        />
                        {/* exibe o erro de validação do campo */}
                        {errors.password && <p style ={{color: "#f00"}}>{errors.password.message}</p>}
                     </div>
                     <button type="submit" disabled ={loading}>
                         {loading ? "Acessando..." : "Acessar"}
                     </button>
                </form>
        </div>
    )

}
