import apiClient from "@/app/api/apiClient";


export default function DevAdminHttp(){

    const baseEndpoint = "/dev-admin/"

    return {
        getHomeData : async ()=>{
            try {
                const response = await apiClient.get(baseEndpoint+'home')
                return {data: response.data, error: null};
                    
            } catch (error: any) {
                return {data: null, error: error.response.data.message};                
            }
        }
    }
}