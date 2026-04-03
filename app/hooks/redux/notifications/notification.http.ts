import apiClient from "@/app/api/apiClient";


export default function NotificationHttp(){
        const baseEndpoint = "/notifications/"
    
        return {
            loadAllNotification: async ()=>{
                try {
                    const response = await apiClient.get(baseEndpoint)
                    return {data: response.data, error: null};
                        
                } catch (error: any) {
                    return {data: null, error: error.response.data.message};                
                }
            },
            getNotifications: async (userId: number)=>{
                try {
                    const response = await apiClient.get(baseEndpoint+'user/'+userId)
                    return {data: response.data, error: null};
                        
                } catch (error: any) {
                    return {data: null, error: error.response.data.message};                
                }
            },
    
            markAsRead: async (notificationId: number)=>{
                try {
                    const response = await apiClient.patch(baseEndpoint+'read/'+String(notificationId))
                    return {data: response.data, error: null};
                        
                } catch (error: any) {
                    return {data: null, error: error.response.data.message};                
                }
            },

            deleteAll: async (userId: number)=>{
                try {
                    const response = await apiClient.delete(baseEndpoint+'user/'+userId)
                    return {data: response.data, error: null};
                        
                } catch (error: any) {
                    return {data: null, error: error.response.data.message};                
                }
        },
        
            deleteNotification: async (notificationId: number) =>{
                try {
                     const response = await apiClient.delete(baseEndpoint+String(notificationId))
                     console.log(response);
                     return {data: response.data, error: null};
                    
                } catch (error: any) {
                    return {data: null, error: error.response.data.message};
                }
            },
        }
}