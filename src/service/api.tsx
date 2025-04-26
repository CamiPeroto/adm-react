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
            const token = localStorage.getItem("token");

            if(token){
                config.headers.Authorization = `Bearer ${token}`;
                console.log(`Bearer ${token}`);
            }
        }
        return config;
        
}, (error) =>{
    return Promise.reject(error);
}
);

export default instance;