import apiClient from "@/app/api/apiClient";


export function DocAdminHTTP(){
    const baseUrl = '/document/admin/summary/';

    return {
        getDocs: async (userId: number)=>{
            try {
                const docs = await apiClient.get(baseUrl, {params: {userId}});
                console.log('docs:', docs.data);
                return {data: docs.data, error: null};
                
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
            }
        }
    }
}