// A diretiva "use client" é usada para indicar que este componente é executado no cliente (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
'use client'

// Importa hooks do React para usar o estado "useState" e os efeitos colaterais "useEffect"
import { useEffect, useState } from "react";

// Importa hooks usado para manipular a navegação do usuário
import { useRouter } from "next/navigation";

// useParams - Acessar os parâmetros da URL de uma página que usa rotas dinâmicas.
import { useParams } from "next/navigation";

// Importa a instância do axios configurada para fazer requisições para a API
import instance from "@/service/api";

// Importar o componente para criar link
import Link from "next/link";

// importar o componente com o Menu
import Menu from "@/app/components/Menu";

// Importa o componente para apagar registro
import DeleteButton from "@/app/components/DeleteButton";

// Importar componente de proteção de rotas
import ProtectedRoute from "@/app/components/ProtectedRoute";

// Definir tipos para a resposta da API
interface User {
    id: number,
    name: string,
    email: string,
    situation: { nameSituation: string},
    createdAt: string,
    updatedAt: string,
}

export default function UserDetails() {
    // Usando o useParams para acessar o parâmetro 'id' da URL
    const { id } = useParams();

    // Instancia o objeto router
    const router = useRouter();

    // Estado para armazenar o usuário
    const [user, setUser] = useState<User | null>(null);

    // Estado para controle de carregamento
    const [loading, setLoading] = useState<boolean>(true);

    // Estado para controle de erros
    const [error, setError] = useState<string | null>(null);

    // Estado para controle de sucesso
    const [success, setSuccess] = useState<string | null>(null);

    // Função para buscar o usuário na API
    const fetchUserDetails = async (id: string) => {
        try {

            // Inicia o carregamento
            setLoading(true);

            // Fazer a requisição à API
            const response = await instance.get(`/users/${id}`);

            // Atualizar o estado com os dados da API
            setUser(response.data);

            // Terminar o carregamento
            setLoading(false);

        } catch (error: any) {

            // Verifica se o erro contém mensagens de validação
            if (error.response && error.response.data) {

                // Se for uma única mensagem atribuir a mensagem de erro retornada da API
                setError(error.response.data.message);

            } else {
                // Criar a mensagem genérica de erro
                setError("Erro ao carregar os detalhes do usuário!");

            }

            // Termina o carregamento em caso de erro
            setLoading(false);

        }
    }

    // Redirecionar para a página listar após apagar o registro
    const handleSuccess = () => {

        // Salvar a mensagem no sessionStorage antes de redirecionar 
        sessionStorage.setItem("successMessage", "Registro apagado com sucesso.");

        // Redireciona para a página de listar
        router.push("/users/list");

    };

    // Hook para buscar os dados quando o id estiver disponível
    useEffect(() => {

        if (id) {
            // Garantir que id seja uma string
            const userId = Array.isArray(id) ? id[0] : id;

            // Busca os dados da situação se o id estiver disponível
            fetchUserDetails(userId);

        }

    }, [id]); // Recarrega os dados quando o id mudar

    return (
        <ProtectedRoute>

            <Menu /><br />

            <Link href={`/users/list`}>Listar</Link><br />

            <Link href={`/users/${id}/edit`}>Editar</Link>

            {user && !loading && !error && (
                <DeleteButton
                    id={String(user.id)}
                    route="users"
                    onSuccess={handleSuccess}
                    setError={setError}
                    setSuccess={setSuccess}
                />
            )}

            <h1>Detalhes da Situação</h1><br />

            {/* Exibir o carregando */}
            {loading && <p>Carregando...</p>}
            {/* Exibe mensagem de erro */}
            {error && <p style={{ color: "#f00" }}>{error}</p>}
            {/* Exibe mensagem de sucesso */}
            {success && <p style={{ color: "#086" }}>{success}</p>}

            {/* Imprimir os detalhes do registro */}
            {user && !loading && !error && (
                <div>
                    <p>ID: {user.id}</p>
                    <p>Nome: {user.name}</p>
                    <p>E-mail: {user.email}</p>
                    <p>Situação: {user.situation?.nameSituation}</p>
                    <p>Criando em: {new Date(user.createdAt).toLocaleString()}</p>
                    <p>Editado em: {new Date(user.updatedAt).toLocaleString()}</p>
                </div>
            )}
        </ProtectedRoute>
    )
}

