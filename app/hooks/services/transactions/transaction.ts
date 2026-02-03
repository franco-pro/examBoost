import axios from "axios";
import apiClient from "@/app/api/apiClient";

export default function TransactionsHttp(){
    // const api = axios.create({
    //     baseURL: 'http://172.20.10.2:3000/transactions',
    //     timeout: 3000
    // });
    const baseEndpoint = "/transactions/"
    return {
        getAllTransactions: async (userId: number)=> {
            try {
                const response = await apiClient.get(baseEndpoint+"user/"+ String(userId));
                return {data: response.data, error: null}
            } catch (error: any) {
                return {data: null, error: error.response.data.message};                
            }
        }
    }
}