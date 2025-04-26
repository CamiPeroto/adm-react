'use client'
import Menu from "@/app/components/Menu";
//importar componente de proteção de rotas
import ProtectedRoute from "../components/ProtectedRoute";


export default function Dashboard() {
  return (
  <ProtectedRoute>
     
     <Menu/><br />
    
    <h1>Dashboard</h1>
  
  </ProtectedRoute>
  );
}
