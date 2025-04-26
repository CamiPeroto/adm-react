import axios, { AxiosInstance } from "axios";


const instance: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080", //definir a URL base para todas as requisições
    headers: {
        "Content-Type": "application/json", //definir cabeçalho padrão para envio de dados no formato json
    }
});
//interceptador para adicionar o token automaticamente nas requisições
instance.interceptors.request.use(
    (config) => {
        //Verifica se está no cliente antes de acessar o localStorage
        if(typeof window !== "undefined"){
            //recuperar o token
            const token = localStorage.getItem("token");
            //berificar se existse o token
            if(token){
                //adicionar o token no Authorization
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;

}, (error) =>{
    return Promise.reject(error);
}
);

export default instance;