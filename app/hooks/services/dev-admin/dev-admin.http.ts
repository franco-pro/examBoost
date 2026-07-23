import apiClient from "@/app/api/apiClient";


export default function DevAdminHttp(){

    const baseEndpoint = "/dev/"

    return {
        getHomeData : async (userid: number)=>{
            try {
                const response = await apiClient.get(baseEndpoint+userid)
                return {data: response.data, error: null};
                    
            } catch (error: any) {
                return {data: null, error: error.response.data.message};                
            }
        }
    }
}