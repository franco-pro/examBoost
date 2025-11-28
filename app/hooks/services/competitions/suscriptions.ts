import axios from "axios";

export default function SubscriptionsHttp(){
    const api = axios.create({
        baseURL : 'http://172.20.10.2:3000/user-competitions/',
        timeout: 3000
    })

    return {
        createSubscription: async (data: {userID: number, competitionID: number, score: 0}) =>{
            try {
                const response = await api.post('suscribe', data)
                return {data: response.data, error: null};
            } catch (error: any) {
                return {data: null, error: error.response.data.message};                
            }
          
        },

        getSubscription: async (userId: number)=>{
            try {
                const response = await api.get('user/'+userId)
                return {data: response.data, error: null};
            } catch (error: any) {
                return {data: null, error: error.response.data.message};                
            }
        }
    }
}