'use client'
import { useEffect, useState } from "react";
//importar a instancia do axios configurada pra fazer requisições para a API
import instance from "@/service/api";

export default function TestConnection() {
  const [message, setMessage] = useState<string>("Carregando...");

  //
  useEffect(() => {
    const testConnection = async () => {
      //tentar fazer uma requisição GET para "/test-connection"
      const response = await instance.get("/test-connection");
      try {
        //Se a conexão for realizada, atualiza a mensagem com a resposta da API
        setMessage(response.data.message || "Conexão com API realizada com sucesso no ADM! ");
      } catch (error: any) {
        console.error("Erro ao testar a conexão: ", error);
        setMessage("Erro ao conectar com a API");
      }
    };
    //Chama a função para testar a conexão
    testConnection();
  }, []); // a dependecia vazia faz o UseEffect executar só uma vez após o componente ser montado
  return (
    <div>
      {message} <br />
    </div>
  );
}
