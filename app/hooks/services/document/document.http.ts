import apiClient from "@/app/api/apiClient"


export default function DocumentHttp(){
    const baseUrl = '/documents/';

    return {
        getDocs: async ()=>{
            try {
                const docs = await apiClient.get(baseUrl);

                return {data: docs.data, error: null};
                
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
            }
        },
        
        updateDoc: async (id: number, data: any)=>{
            try {
                const response = await apiClient.patch(baseUrl+String(id), data);
                return {data: response ? {id: id, ...data}:{id: id, ...data}, error: null};
                    
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
            }
        },

        delete: async (id: number)=>{
            try {
                const response = await apiClient.delete(baseUrl+String(id));
                return {data: response.data ? id:id, error: null};
                    
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
            }
        }
    }
}