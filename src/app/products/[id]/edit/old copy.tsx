// A diretiva "use client" é usada para indicar que este componente é executado no cliente (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
'use client'

// Importa hooks do React para usar o estado "useState" e os efeitos colaterais "useEffect"
import { useEffect, useState } from "react";

// useParams - Acessar os parâmetros da URL de uma página que usa rotas dinâmicas.
import { useParams } from "next/navigation";

// Importar o adaptador para conectar react-hook-form com bibliotecas de validação como Yup
import { yupResolver } from '@hookform/resolvers/yup';

// Importar a função para gerenciar o formulário
import { useForm } from "react-hook-form";

// Importar a dependência para validar o formulário.
import * as yup from 'yup';

// Importa a instância do axios configurada para fazer requisições para a API
import instance from "@/service/api";

// Importar o componente para criar link
import Link from "next/link";

// importar o componente com o Menu
import Menu from "@/app/components/Menu";

// Importar componente de proteção de rotas
import ProtectedRoute from "@/app/components/ProtectedRoute";

// Esquema de validação com Yup
const schema = yup.object().shape({
    name: yup.string().required("O campo nome é obrigatório!").min(3, "O campo nome deve ter no mínimo 3 caracteres!"),
    slug: yup.string().required("O campo slug é obrigatório!").min(3, "O campo slug deve ter no mínimo 3 caracteres!"),
    description: yup.string().required("O campo descrição é obrigatório!").min(3, "O campo descrição deve ter no mínimo 10 caracteres!"),
    price: yup.number().typeError("O preço deve ser um número!").required("O campo preço é obrigatório!").positive("O preço deve ser um valor positivo!").test("is-decimal", "O preço deve ter no máximo duas casas decimais!", (value) => /^\d+(\.\d{1,2})?$/.test(value?.toString() || "")),
});

export default function EditUser() {

    // Usando o useParams para acessar o parâmetro 'id' da URL
    const { id } = useParams();

    // Estado para controle de carregamento
    const [loading, setLoading] = useState<boolean>(false);

    // Estado para controle de erros
    const [error, setError] = useState<string | null>(null);

    // Estado para controle de sucesso
    const [success, setSuccess] = useState<string | null>(null);

    // Função para recuperar os dados da situação a ser editada
    const fetchProductDetails = async () => {

        try {

            // Inicia o carregamento
            setLoading(true);

            // Fazer a requisição à API
            const response = await instance.get(`/products/${id}`);

            // Preenche o campo com os dados existentes
            reset({ name: response.data.name, slug: response.data.slug, description: response.data.description, price: response.data.price });

        } catch (error: any) {
            // Verifica se o erro contém mensagens de validação
            if (error.response && error.response.data && error.response.data.message) {

                // Exibe as mensagens de erro se for um array de mensagens
                if (Array.isArray(error.response.data.message)) {
                    setError(error.response.data.message.join(" - "));
                } else {
                    // Exibe a mensagem de erro se for uma única mensagem
                    setError(error.response.data.message);
                }

            } else {
                // Criar a mensagem genérica de erro
                setError("Erro ao editar o produto. Tente novamente.");
            }

        } finally {

            // Termina o carregamento
            setLoading(false);
        }

    };

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    // Função para enviar os dados atualizados para a API
    const onSubmit = async (data: { name: string, slug: string, description: string, price: number, situation?: string, category?: string }) => {

        // Se não for enviado, define como "1"
        data.situation = data.situation ?? "1";
        data.category = data.category ?? "1";

        // Inicia o carregamento
        setLoading(true);

        // Limpa o erro anterior
        setError(null);

        // Limpa o sucesso anterior
        setSuccess(null);

        try {

            // Fazer a requisição à API e enviar os dados
            const response = await instance.put(`/products/${id}`, data);

            // Exibir mensagem de sucesso
            setSuccess(response.data.message || "Produto editado com sucesso!");

        } catch (error: any) {
            // Verifica se o erro contém mensagens de validação
            if (error.response && error.response.data && error.response.data.message) {

                // Exibe as mensagens de erro se for um array de mensagens
                if (Array.isArray(error.response.data.message)) {
                    setError(error.response.data.message.join(" - "));
                } else {
                    // Exibe a mensagem de erro se for uma única mensagem
                    setError(error.response.data.message);
                }

            } else {
                // Criar a mensagem genérica de erro
                setError("Erro ao editar o produto. Tente novamente.");
            }
        } finally {

            // Termina o carregamento
            setLoading(false);
        }

    }

    // Chamar a função fetchUser quando o componente é montado
    useEffect(() => {
        if (id) {
            // Busca os dados do produto se o id estiver disponível
            fetchProductDetails();
        }
    }, [id]); // Recarrega os dados quando o id mudar

    return (
        <ProtectedRoute>
            <Menu /><br />

            <Link href={`/products/list`}>Listar</Link><br />

            <Link href={`/products/${id}`}>Visualizar</Link>

            <h1>Editar Produto</h1><br />

            {/* Exibir o carregando */}
            {loading && <p>Carregando...</p>}
            {/* Exibe mensagem de erro */}
            {error && <p style={{ color: "#f00" }}>{error}</p>}
            {/* Exibe mensagem de sucesso */}
            {success && <p style={{ color: "#086" }}>{success}</p>}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="name">Nome: </label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Nome do produto"
                        {...register('name')}
                        className="border"
                    /><br />
                    {/* Exibe o erro de validação do campo */}
                    {errors.name && <p style={{ color: "#f00" }}>{errors.name.message}</p>}

                    <label htmlFor="slug">Slug: </label>
                    <input
                        type="text"
                        id="slug"
                        placeholder="Nome do produto na URL"
                        {...register('slug')}
                        className="border"
                    /><br />
                    {/* Exibe o erro de validação do campo */}
                    {errors.slug && <p style={{ color: "#f00" }}>{errors.slug.message}</p>}

                    <label htmlFor="description">Descrição: </label>
                    <input
                        type="text"
                        id="description"
                        placeholder="Descrição do produto"
                        {...register('description')}
                        className="border"
                    /><br />
                    {/* Exibe o erro de validação do campo */}
                    {errors.description && <p style={{ color: "#f00" }}>{errors.description.message}</p>}

                    <label htmlFor="price">Preço: </label>
                    <input
                        type="text"
                        id="price"
                        placeholder="Preço do produto. Ex: 2.45"
                        {...register('price')}
                        className="border"
                    /><br />
                    {/* Exibe o erro de validação do campo */}
                    {errors.price && <p style={{ color: "#f00" }}>{errors.price.message}</p>}

                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Enviando..." : "Salvar"}
                </button>
            </form>


        </ProtectedRoute>
    )
}