"use client";
import { useState, useEffect } from "react"; //importar hooks para usar UseState
//importa hooks para manipular a navegação do usuário
import { useRouter } from "next/navigation";
//adaptador para conectar o react-hook-form com bibliotecas de validação yup
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import instance from "@/service/api";
import Link from "next/link";
import LoadingSpinner from "../components/LoadingSpinner";
import AlertMessage from "../components/AlertMessage";

//esquema de validação com yup
const schema = yup.object().shape({
  email: yup.string().email("E-mail inválido!").required("O campo email é obrigatório!"),
  password: yup.string().required("A senha é obrigatória!"),
});

export default function LoginPage() {
  //instaciar o objeto router para redirecionamentos
  const router = useRouter();
  //Apresentar o carregamento
  const [loading, setLoading] = useState<boolean>(false);
  //Apresentar erros
  const [error, setError] = useState<string | null>(null);
  //Apresentar sucesso
  const [success, setSuccess] = useState<string | null>(null);

  //iniciar o formulário com as validações
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  //Função para enviar os dados para a API validar
  const onSubmit = async (data: { email: string; password: string }) => {
    //inicia o carregamento
    setLoading(true);
    //limpa o erro anterior
    setError(null);
    //limpa o sucesso anterior
    setSuccess(null);

    try {
      //fazer a requisição pra api e enviar os dados
      const response = await instance.post("/", data);
      //exibir mensagem de sucesso
      // alert(response.data.message ||"Login realizado com sucesso!");
      console.log(response.data);
      //salvar o token no localStorage
      localStorage.setItem("token", response.data.user.token);

      //redirecionar para o dashboard
      router.push("/dashboard");
    } catch (error: any) {
      //verifica se o erro contem mensagens de validação
      if (error.response && error.response.data && error.response.data.message) {
        //exibe mensagens de erro se for um array
        if (Array.isArray(error.response.data.message)) {
          setError(error.response.data.message.join(" - "));
        } else {
          //exibe uma unica mensagem de erro
          setError(error.response.data.message);
        }
      } else {
        setError("Erro ao realizar login. Tente novamente");
      }
    } finally {
      //termina o carregamento
      setLoading(false);
    }
  };
  // Hook para buscar os dados na primeira renderização
  useEffect(() => {
    // Recuperar a mensagem de sucesso salva no sessionStorage
    const successMessage = sessionStorage.getItem("successMessage");

    // Verificar se existe a mensagem
    if (successMessage) {
      // Atribuir a mensagem
      setSuccess(successMessage);
      // Remover para evitar duplicação
      sessionStorage.removeItem("successMessage");
    }

    // Recuperar a mensagem de error salva no sessionStorage
    const errorMessage = sessionStorage.getItem("errorMessage");

    // Verificar se existe a mensagem
    if (errorMessage) {
      // Atribuir a mensagem
      setError(errorMessage);
      // Remover para evitar duplicação
      sessionStorage.removeItem("errorMessage");
    }
  }, []);
  return (
    <div className="bg-login">
      <div className="card-login">
        <div className="logo-wrapper-login">
          <a href="/">
            <img src="/images/logo.ico" alt="Loogo" className="logo-login" />
          </a>
        </div>
        <h1 className="title-login">Área Restrita</h1>

        {/* exibir mensagem de carregamento */}
        {loading && <LoadingSpinner/>}

        {/* exibir erro, se houver */}
        <AlertMessage type="error" message={error}/>
        {/* {error && <p className="alert-danger">{error}</p>} */}
        {/* exibir sucesso, se houver */}
        {/* {success && <p className="alert-success">{success}</p>} */}
        <AlertMessage type="success" message={success}/>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="form-group-login">
            <label htmlFor="email" className="form-label-login">
              E-mail:{" "}
            </label>
            <input type="text" id="email" placeholder="email@example.com" {...register("email")} className="form-input-login" />
            {/* exibe o erro de validação do campo */}
            {errors.email &&  <AlertMessage type="error" message={errors.email.message ?? null}/>}
          </div>
          <div className="form-group-login">
            <label htmlFor="password" className="form-label-login">
              Senha:{" "}
            </label>
            <input type="password" id="password" placeholder="Digite sua senha" {...register("password")} className="form-input-login" />
            
            {/* exibe o erro de validação do campo */}
            {errors.password &&  <AlertMessage type="error" message={errors.password.message ?? null}/>}
          </div>

          <div className="btn-group-login">
            <Link href="/recover-password" className="link-login">
              Esqueceu a senha ?
            </Link>
            <button type="submit" className="btn-primary-md" disabled={loading}>
              {loading ? "Acessando..." : "Acessar"}
            </button>
          </div>

          <div className="ref-login">
            <Link href="/sign-up" className="link-login">
              Criar conta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
