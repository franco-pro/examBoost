import axios from "axios";

export default function SubscriptionsHttp(){
    const api = axios.create({
        baseURL : 'http://172.20.10.2:3000/user-competitions/',
        timeout: 3000
    })

    return {
        createSubscription: async (data: {userID: number, competitionID: number, score: 0}) =>{
            const response = await api.post('suscribe', data)
            return response.data;
        },

        getSubscription: async (userId: number)=>{
            const response = await api.get('user/'+userId)
            return response.data;
        }
    }
}