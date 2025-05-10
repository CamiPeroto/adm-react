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
import LoadingSpinner from "../components/LoadingSpinner";
import AlertMessage from "../components/AlertMessage";

//esquema de validação com yup
const schema = yup.object().shape({
name: yup
    .string()
    .required("O campo nome é obrigatório!")
    .min(3, "O campo nome deve ter no mínimo 3 caracteres!"),
email: yup
    .string()
    .email( "E-mail inválido!")
    .required("O campo email é obrigatório!"),
password: yup
    .string()
    .required("A senha é obrigatória!")
    .min(6, "A senha deve ter no mínimo 6 caracteres!"),
});

export default function signUpPage(){
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
  const onSubmit = async (data: { name: string; email: string; password: string }) => {
    //inicia o carregamento
    setLoading(true);
    //limpa o erro anterior
    setError(null);
    //limpa o sucesso anterior
    setSuccess(null);

    try{
        //fazer a requisição pra api e enviar os dados
       const response = await instance.post("/new-users", data);
        //exibir mensagem de sucesso
        setSuccess(response.data.message || "Conta cadastrada com sucesso!!");
        //redirecionar para o LOGIN
        router.push("/login");

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
            setError("Erro ao cadastrar usuário. Tente novamente");
        }
    }finally{
        //termina o carregamento 
        setLoading(false);
    }
}
    return(
        <div className="bg-login">
            <div className="card-login">
                  <div className="logo-wrapper-login">
                    <Link href="/">
                        <img src="/images/logo.ico" alt="Loogo" className="logo-login" />
                    </Link>
        </div>
        <h1 className="title-login">Novo Usuário</h1>
               
                {/* exibir mensagem de carregamento */}
                {loading && <LoadingSpinner/>}
                {/* exibir erro, se houver */}
                {/* {error && <p className="alert-danger">{error}</p>} */}
                 <AlertMessage type="error" message={error}/>
                {/* exibir sucesso, se houver */}
                {/* {success && <p className="alert-success">{success}</p>} */}
                 <AlertMessage type="success" message={success}/>
                
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                <div className="form-group-login">
                        <label htmlFor="name" className="form-label-login">Nome: </label>
                        <input 
                            type="text" 
                            id="name" 
                            placeholder="Digite seu nome" 
                            {...register('name')}
                            className="form-input-login"
                        />
                        {/* exibe o erro de validação do campo */}
                        {errors.name &&  <AlertMessage type="error" message={errors.name.message ?? null}/>}
                     </div>
                    <div className="form-group-login">
                        <label htmlFor="email" className="form-label-login">E-mail: </label>
                        <input 
                            type="text" 
                            id="email" 
                            placeholder="email@example.com" 
                            {...register('email')}
                            className="form-input-login"
                        />
                        {/* exibe o erro de validação do campo */}
                        {errors.email &&  <AlertMessage type="error" message={errors.email.message ?? null}/>}
                     </div>
                     <div className="form-group-login">
                        <label htmlFor="password" className="form-label-login">Senha: </label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Digite sua senha" 
                            {...register('password')}
                            className="form-input-login"
                        />
                        {/* exibe o erro de validação do campo */}
                        {errors.password &&  <AlertMessage type="error" message={errors.password.message ?? null}/>}
                     </div>
                     <div className="btn-group-login">
                        <Link href="login" className="link-login"> Login </Link>
                        <button type="submit" className="btn-primary-md" disabled={loading}>
                        {loading ? "Cadastrando..." : "Cadastrar"}
                        </button>
                     </div>
                </form>
             </div>
        </div>
    )

}
