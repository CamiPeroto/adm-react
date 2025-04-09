import axios, { AxiosInstance } from "axios";

const instance: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080", //definir a URL base para todas as requisições
    headers: {
        "Content-Type": "application/json", //definir cabeçalho padrão para envio de dados no formato json
    }
});

export default instance;