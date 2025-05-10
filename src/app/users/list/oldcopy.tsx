// A diretiva "use client" é usada para indicar que este componente é executado no cliente (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
'use client'

// Importa hooks do React para usar o estado "useState" e os efeitos colaterais "useEffect"
import { useEffect, useState } from "react";

// Importa a instância do axios configurada para fazer requisições para a API
import instance from "@/service/api";

// Importar o componente para criar link
import Link from "next/link";

// importar o componente com o Menu
import Menu from "@/app/components/Menu";

// Importa o componente de paginação
import Pagination from "@/app/components/Pagination";

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

export default function UsersList() {

    // Estado para armazenar os usuários
    const [users, setUsers] = useState<User[]>([]);
    // Estado para controle de carregamento
    const [loading, setLoading] = useState<boolean>(true);
    // Estado para controle de erros
    const [error, setError] = useState<string | null>(null);
    // Estado para controle de sucesso
    const [success, setSuccess] = useState<string | null>(null);
    // Página atual
    const [currentPage, setCurrentPage] = useState<number>(1);
    // Última página
    const [lastPage, setLastPage] = useState<number>(1);

    // Função para buscar as situações da API
    const fetchUsers = async (page: number) => {
        try {

            // Inicia o carregamento
            setLoading(true);

            // Fazer a requisição à API
            const response = await instance.get(`/users?page=${page}&limit=3`);

            // Atualizar o estado com os dados da API
            setUsers(response.data.data);

            // Atualizar a página atual
            setCurrentPage(response.data.currentPage);

            // Atualizar a última página
            setLastPage(response.data.lastPage);

            // Terminar o carregamento
            setLoading(false);


        } catch (error) {
            // Criar a mensagem genérica de erro
            setError("Erro ao carregar os usuários");

            // Termina o carregamento em caso de erro
            setLoading(false);
        }
    };

    // Atualizar a lista de registros após apagar o registro
    const handleSuccess = () => {
        fetchUsers(currentPage);
    };

    // Hook para buscar os dados na primeira renderização
    useEffect(() => {

        // Recuperar a mensagem salva no sessionStorage
        const message = sessionStorage.getItem("successMessage");

        // Verificar se existe a mensagem
        if(message){
            // Atribuir a mensagem
            setSuccess(message);
            // Remover para evitar duplicação
            sessionStorage.removeItem("successMessage");
        }

        // Busca os dados ao carregar a página
        fetchUsers(currentPage);

    }, [currentPage]); // Recarregar os dados sempre que a página for alterada

    return (
        <ProtectedRoute>

            <Menu /><br />

            <Link href={`/users/create`}>Cadastrar</Link>

            <h1>Listar os Usuários</h1><br />

            {/* Exibir o carregando */}
            {loading && <p>Carregando...</p>}
            {/* Exibe mensagem de erro */}
            {error && <p style={{ color: "#f00" }}>{error}</p>}
            {/* Exibe mensagem de sucesso */}
            {success && <p style={{ color: "#086" }}>{success}</p>}

            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Situação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.situation?.nameSituation}</td>
                                <td>
                                    <Link href={`/users/${user.id}`}>Visualizar</Link>{` - `}
                                    <Link href={`/users/${user.id}/edit`}>Editar</Link>{` `}
                                    <DeleteButton
                                        id={String(user.id)}
                                        route="users"
                                        onSuccess={handleSuccess}
                                        setError={setError}
                                        setSuccess={setSuccess}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Usar o componente de Paginação */}
            <br />
            <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={setCurrentPage}
            />
        </ProtectedRoute>
    )
}