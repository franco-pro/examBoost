import apiClient from "@/app/api/apiClient";

export default function PacksHttp(){

    const baseEndpoint = "/pack/"

    return {
        getAllPacks : async ()=>{
            try {
                const response = await apiClient.get(baseEndpoint)
                return {data: response.data, error: null};
                    
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
          }
        },

        create: async (param: any)=>{
            try {
                if(!param.name || !param.price || !param.duration || !param.durationDays) return;

                const data = {
                    ...param,
                    price: Number(param.price),
                    duration: Number(param.duration),
                    durationDays: Number(param.durationDays),
                }
                const response = await apiClient.post(baseEndpoint, data);
                return {data: response.data, error: null};
                    
            } catch (error: any) {
                console.log('FULL ERROR');
                console.log(error);
                console.log(error.response);
                console.log(error.request.data.message);
            
                return {
                    data: null,
                    error: error?.response?.data?.message || error.message
                };
            }
        },

        update: async (id: number, data: any)=>{
            try {
                const response = await apiClient.patch(`${baseEndpoint}${id}/`, data)
                return {data: response.data, error: null};
                    
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
            }
        }
    }
}