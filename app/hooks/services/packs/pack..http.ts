import apiClient from "@/app/api/apiClient";

export default function PacksHttp(){

    const baseEndpoint = "/packs/"

    return {
        getAllPacks : async ()=>{
            try {
                const response = await apiClient.get(baseEndpoint)
                return {data: response.data, error: null};
                    
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
          }
        },

        create: async (data: any)=>{
            try {
                const response = await apiClient.post(baseEndpoint, data)
                return {data: response.data, error: null};
                    
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
            }
        },

        update: async (id: number, data: any)=>{
            try {
                const response = await apiClient.put(`${baseEndpoint}${id}/`, data)
                return {data: response.data, error: null};
                    
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
            }
        }
    }
}