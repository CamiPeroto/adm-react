'use client'
import { useEffect, useRef, useState } from "react";
// Importa hooks usado para manipular a navegação do usuário
import { useRouter } from "next/navigation";


const Navbar = ({setIsOpen}: {setIsOpen: (isOpen:boolean) => void}) => {

    //estado para controlar se o dropdown está fechado. começa em false(fechado)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    //criar uma referencia para armazenar o elemento dropdown
    const dropdownRef = useRef<HTMLDivElement>(null);

    //use effect é executado quando o componente é montado/desmontado 
    useEffect(() => {
      //função para detectar o clique fora do dropdown
      function handleClickOutside(event: MouseEvent){
        if(dropdownRef.current && !dropdownRef.current.contains(event.target as Node)){
          //fechar o dropdown se o clique for fora
          setDropdownOpen(false);
        }
      }
      //Adicionar um ouvinte de evento para detectar cliques no documento inteiro
      document.addEventListener('mousedown', handleClickOutside)
      // função de limpeza: remove o evento ao desmontar o compoente
      return () =>{
        document.removeEventListener('mousedown', handleClickOutside);
      }

    }, []);//o array vazio indica que o efeito só roda na montagem e desmontagem do componente
    
    //instanciar o objeto router
       const router = useRouter();

       const handleLogout = ()=> {
           //remover o token do localStorage
           localStorage.removeItem("token");
           //redirecionar para a página de login
           router.push("/login");
       }

    return(
        <nav className="navbar">
        <div className="navbar-container">
          <button id="toggleSidebar" className="menu-button" onClick={() => setIsOpen(true)}>
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="user-container">
            <div ref ={dropdownRef}>
             {/* Inicio Dropdown  */}
              <button id="userDropdownButton" className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                Usuário
                <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Conteúdo do Dropdown */}
              {dropdownOpen &&(
                  <div id="dropdownContent" className="dropdown-content">
                  <a href="#" className="dropdown-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <span>Perfil</span>
                  </a>
                  <a href="#" className="dropdown-item" onClick={handleLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                    <span>Sair</span>
                  </a>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </nav>
    )
}

export default Navbar;