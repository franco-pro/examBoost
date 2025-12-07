import axios from "axios";
import Competition from "./competition.entity";


export default function CompetitionHttp(){
    const api = axios.create({
        baseURL: 'http://172.20.10.2:3000/competitions/',
        timeout: 3000
    })

    return {
        getCompetitions: async ()=>{
            try {
                const response = await api.get('')
                return {data: response.data, error: null};
                    
            } catch (error: any) {
                return {data: null, error: error.response.data.message};                
            }
        },

        getMyCompetitio: async (userId: number)=>{
            try {
                const response = await api.get('user/'+userId)
                return {data: response.data, error: null};
            } catch (error: any) {
                return {data: null, error: error.response.data.message};                
                
            }
        },

        createCompetition: async (data: Competition)=>{
            try {
                const response = await api.post('', data);

                return {data: response.data, error: null};
            } catch (error: any) {
                return {data: null, error: error.response.data.message};                
                
            }
        },

        getOne: async (id: number)=> {
            try {
                const response = await api.get(String(id));
                return {data: response.data, error: null};
                    
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
            }
        },

        delete: async (id: number) =>{
            try {
                 const response = await api.delete(String(id))
                 return {data: response.data, error: null};
                
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
            }
        },

        update: async (id: number, data: Competition)=>{
            try {
                const response = await api.patch(String(id), data);
                return {data: response.data, error: null};
                    
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
            }
        },

        getHomeBase: async (userId: number) =>{
            try{
                const response = api.get("home/"+userId)
                return {data: (await response).data, error: null}
            }catch (error: any) {
                return {data: null, error: error.response.data.message};                
            }
        }
    }
}