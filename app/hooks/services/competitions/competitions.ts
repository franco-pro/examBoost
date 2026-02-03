import axios from "axios";
import Competition from "./competition.entity";
import apiClient from "@/app/api/apiClient";

export default function CompetitionHttp(){
    // const api = axios.create({
    //     baseURL: 'http://172.20.10.2:3000/competitions/',
    //     timeout: 3000
    // })

    const baseEndpoint = "/competitions/"

    return {
        getCompetitions: async ()=>{
            try {
                const response = await apiClient.get(baseEndpoint)
                return {data: response.data, error: null};
                    
            } catch (error: any) {
                return {data: null, error: error.response.data.message};                
            }
        },

        getMyCompetitio: async (userId: number)=>{
            try {
                const response = await apiClient.get(baseEndpoint+'user/'+userId)
                return {data: response.data, error: null};
            } catch (error: any) {
                return {data: null, error: error.response.data.message};                
                
            }
        },

        createCompetition: async (data: Competition)=>{
            try {
                const response = await apiClient.post(baseEndpoint, data);

                return {data: response.data, error: null};
            } catch (error: any) {
                return {data: null, error: error.response.data.message};                
                
            }
        },

        getOne: async (id: number)=> {
            try {
                const response = await apiClient.get(baseEndpoint+String(id));
                return {data: response.data, error: null};
                    
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
            }
        },

        delete: async (id: number) =>{
            try {
                 const response = await apiClient.delete(baseEndpoint+String(id))
                 return {data: response.data, error: null};
                
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
            }
        },

        update: async (id: number, data: Competition)=>{
            try {
                const response = await apiClient.patch(baseEndpoint+String(id), data);
                return {data: response.data, error: null};
                    
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
            }
        },

        getHomeBase: async (userId: number) =>{
            try{
                const response = apiClient.get(baseEndpoint+"home/"+userId)
                return {data: (await response).data, error: null}
            }catch (error: any) {
                return {data: null, error: error.response.data.message};                
            }
        }
    }
}