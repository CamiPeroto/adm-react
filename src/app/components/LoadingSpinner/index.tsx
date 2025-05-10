"use client";
//importar os hooks do react para o estado useState
import React from "react"; 

const LoadingSpinner = () => {
    return(
        <div className="fixed inset-0  bg-black opacity-10 z-50 flex justify-center items-center">
            <div className="w-16 h-16 border-t-4  border-fuchsia-200 border-solid rounded-full animate-spin">           
            </div>     
        </div>
    );
}

export default LoadingSpinner;