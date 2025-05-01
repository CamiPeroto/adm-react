//importar os hooks do react para o estado useState
import React from "react"; 

interface AlertMessageProps{
    type: "success" | "error";
    message: string | null
}

export default function AlertMessage( {type, message}: AlertMessageProps ){
    if(!message) return null;
    return(
        <p className={`alert-${type=== "success" ? "success" : "danger"}`}> 
        {message}
         </p>
    )
}