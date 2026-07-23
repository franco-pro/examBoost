import axios from "axios";
import apiClient from "@/app/api/apiClient";

export default function SubscriptionsHttp(){
    // const api = axios.create({
    //     baseURL : 'http://172.20.10.2:3000/user-competitions/',
    //     timeout: 3000
    // })
    const baseEndpoint = "/user-competitions/";

    return {
        createSubscription: async (data: {userID: number, competitionID: number, score: 0}) =>{
            try {

                const response = await apiClient.post(baseEndpoint+'suscribe', data)
                return {data: response.data, error: null};
            } catch (error: any) {

                return {data: null, error: error.response?.data?.message || 'Une erreur est survenue'};                
            }
          
        },

        getSubscription: async (userId: number)=>{
            try {
                const response = await apiClient.get(baseEndpoint+'user/'+userId)
                return {data: response.data, error: null};
            } catch (error: any) {
                return {data: null, error: error.response.data.message};                
            }
        }
    }
}