import { useRouter } from "next/navigation";
const Menu = () => {
   //instanciar o objeto router
    const router = useRouter();

    const handleLogout = ()=> {
        //remover o token do localStorage
        localStorage.removeItem("token");
        //redirecionar para a página de login
        router.push("/login");
    }
    return(
        <nav>
            <ul>
                <li> <a href="/">Dashboard</a></li>
                <li> <a href="/situations/list">Situações</a></li>
                <li> <a href="/products/list">Produtos</a></li>
                <li> <a href="/product-situations/list">Situações Produtos</a></li>
                <li> <a href="/product-categories/list">Categorias Produtos</a></li>
                <li> <a href="/users/list">Usuários</a></li>
                <li> <a href="#" onClick={handleLogout}>Sair</a></li>
            </ul>
        </nav>
    )
}

export default Menu;