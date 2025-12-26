import axios from "axios";

export default function TransactionsHttp(){
    const api = axios.create({
        baseURL: 'http://172.20.10.2:3000/rooms',
        timeout: 3000
    });

    return {
        getAllTransactions: async (userId: number)=> {
            try {
                const response = await api.get(String(userId));
                return {data: response.data, error: null}
            } catch (error: any) {
                return {data: null, error: error.response.data.message};                
            }
        }
    }
}