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
interface Product {
    id: number,
    name: string,
    slug: string,
    description: string,
    price: string,
    situation: { name: string},
    category: { name: string},
    createdAt: string,
    updatedAt: string,
}

export default function ProductDetails() {
    // Usando o useParams para acessar o parâmetro 'id' da URL
    const { id } = useParams();

    // Instancia o objeto router
    const router = useRouter();

    // Estado para armazenar o produto
    const [product, setProduct] = useState<Product | null>(null);

    // Estado para controle de carregamento
    const [loading, setLoading] = useState<boolean>(true);

    // Estado para controle de erros
    const [error, setError] = useState<string | null>(null);

    // Estado para controle de sucesso
    const [success, setSuccess] = useState<string | null>(null);

    // Função para buscar o produto na API
    const fetchProductDetails = async (id: string) => {
        try {

            // Inicia o carregamento
            setLoading(true);

            // Fazer a requisição à API
            const response = await instance.get(`/products/${id}`);

            // Atualizar o estado com os dados da API
            setProduct(response.data);

            // Terminar o carregamento
            setLoading(false);

        } catch (error: any) {

            // Verifica se o erro contém mensagens de validação
            if (error.response && error.response.data) {

                // Se for uma única mensagem atribuir a mensagem de erro retornada da API
                setError(error.response.data.message);

            } else {
                // Criar a mensagem genérica de erro
                setError("Erro ao carregar os detalhes do produto!");

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
        router.push("/products/list");

    };

    // Hook para buscar os dados quando o id estiver disponível
    useEffect(() => {

        if (id) {
            // Garantir que id seja uma string
            const productId = Array.isArray(id) ? id[0] : id;

            // Busca os dados da situação se o id estiver disponível
            fetchProductDetails(productId);

        }

    }, [id]); // Recarrega os dados quando o id mudar

    return (
        <ProtectedRoute>

            <Menu /><br />

            <Link href={`/products/list`}>Listar</Link><br />

            <Link href={`/products/${id}/edit`}>Editar</Link>

            {product && !loading && !error && (
                <DeleteButton
                    id={String(product.id)}
                    route="products"
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
            {product && !loading && !error && (
                <div>
                    <p>ID: {product.id}</p>
                    <p>Nome: {product.name}</p>
                    <p>Slug: {product.slug}</p>
                    <p>Preço: {product.price}</p>
                    <p>Situação: {product.situation?.name}</p>
                    <p>Situação: {product.category?.name}</p>
                    <p>Descrição: {product.description}</p>
                    <p>Criando em: {new Date(product.createdAt).toLocaleString()}</p>
                    <p>Editado em: {new Date(product.updatedAt).toLocaleString()}</p>
                </div>
            )}
        </ProtectedRoute>
    )
}

