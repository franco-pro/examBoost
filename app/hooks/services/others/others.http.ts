import apiClient from "@/app/api/apiClient";
import { Others } from "./others.entitie";

export function OthersHttp(){
    const baseUrl = "/others";

    return {
        getAll: async ()=> {
            try {
                const response  = await apiClient.get(baseUrl);
                return {data: response.data, error: null}
            } catch (error: any) {
                console.log("Erreur lors du chargement", error);
                return {data: null, error: error.response.data.message};                

            }
        },
        create: async (data: any)=>{
            try {
                const response = await apiClient.post(baseUrl, data);
                return {data: response.data, error: null}
            } catch (error: any) {

                console.log("error on creation processing", error);
                return {data: null, error: error.response.data.message};                

            }
        },

        update: async (data: Others)=>{
            try {
                const response = await apiClient.patch(baseUrl+"/"+data.id, data);
                return {data: response.data, error: null}
            } catch (error: any) {
                console.log('error on updating', error);
                return {data: null, error: error.response.data.message};                

            }
        }
    }
}