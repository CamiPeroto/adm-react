//importar os hooks do react para o estado useState
import React from "react"; 

interface AlertMessageProps{
    type: "success" | "error";
    message: string | null
}

export default function AlertMessage( {type, message}: AlertMessageProps ){
    if(!message) return null;
    //mapeia o tipo para classes dde estilo do tailwind
    const alertClasses = {
        success: "p-3 my-3 text-sm text-green-900 rounded-lg bg-green-100 border border-green-200",
        error: "p-3 my-3 text-sm text-red-900 rounded-lg bg-red-100 border border-red-200"
    }

    return(
        <p className={alertClasses[type]}> 
        {message}
         </p>
    )
}