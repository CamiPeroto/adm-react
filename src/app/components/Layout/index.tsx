'use client'
import React from "react";
//importar componente de proteção de rotas
import ProtectedRoute from "../ProtectedRoute";
import Navbar from "../NavBar";
import Sidebar from "../Sidebar";

const Layout = ({ children } : {children: React.ReactNode}) => {
    return(
        <ProtectedRoute>
            <div className="bg-dashboard">
                
                 <Navbar/> 
                 <div className="flex">
                    <Sidebar/> 
                     {children}
                 </div>
               
            </div>
            
        </ProtectedRoute>
    )
}

export default Layout;