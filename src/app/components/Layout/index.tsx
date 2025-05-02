'use client'
import React, { useState } from "react";
//importar componente de proteção de rotas
import ProtectedRoute from "../ProtectedRoute";
import Navbar from "../NavBar";
import Sidebar from "../Sidebar";

const Layout = ({ children } : {children: React.ReactNode}) => {
    //estado para controlar a sidebar aberta/fechada
    const [isOpen, setIsOpen] = useState(false)


    return(
        <ProtectedRoute>
            <div className="bg-dashboard">
                
                 <Navbar setIsOpen={setIsOpen}/> 

                 <div className="flex">

                    <Sidebar isOpen={isOpen} setIsOpen = {setIsOpen}/> 

                     {children}

                 </div>
               
            </div>
            
        </ProtectedRoute>
    )
}

export default Layout;