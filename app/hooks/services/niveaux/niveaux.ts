import apiClient from "@/app/api/apiClient";

export default function NiveauHttp(){
    const baseEndpoint = "/niveaux/"

    return {
        getAllNiveaux: async ()=>{
            try {
                const response = await apiClient.get(baseEndpoint)
                return {data: response.data, error: null};
                    
            } catch (error: any) {
                return {data: null, error: error.response.data.message};                
            }
        },

        update: async (id: number, data: any)=>{
            try {
                const response = await apiClient.patch(baseEndpoint+String(id), data);
                console.log('response on updating:', response);
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

        create : async (data: any)=>{
            try {
                const response = await apiClient.post(baseEndpoint, data);
                return {data: response.data, error: null};
                    
            } catch (error: any) {
                return {data: null, error: error.response.data.message};                
            }
        }
    }
}