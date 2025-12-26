import axios from "axios";


export function SearchHttp(){
    const api = axios.create({
        baseURL: 'http://172.20.10.2:3000/users/',
        timeout: 3000
    })

    return {
        searchUsers: async (data: string)=>{
            const response = await api.get('search/'+data);
            return response.data;
        }
    }
}