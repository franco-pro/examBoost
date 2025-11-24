import axios from "axios";
import Competition from "./competition.entity";


export default function CompetitionHttp(){
    const api = axios.create({
        baseURL: 'http://172.20.10.2:3000/competitions/',
        timeout: 3000
    })

    return {
        getCompetitions: async ()=>{
            const response = await api.get('')
            return response.data;
        },

        getMyCompetitio: async (userId: number)=>{
            const response = await api.get('user/'+userId)
            return response.data
        },

        createCompetition: async (data: Competition)=>{
            const response = await api.post('', data);
            return response.data;
        },

        getOne: async (id: number)=> {
            const response = await api.get(String(id));
            return response.data;
        },

        delete: async (id: number) =>{
            const response = await api.delete(String(id))
            return response.data;
        },

        update: async (id: number, data: Competition)=>{
            const response = await api.patch(String(id), data);
            return response.data;
        }
    }
}