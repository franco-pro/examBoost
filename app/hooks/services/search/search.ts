import axios from "axios";
import apiClient from "@/app/api/apiClient";

export function SearchHttp(){
    // const api = axios.create({
    //     baseURL: 'http://172.20.10.2:3000/users/',
    //     timeout: 3000
    // })

    return {
        searchUsers: async (data: string)=>{
            const response = await apiClient.get('/users/search/'+data);
            return response.data;
        }
    }
}