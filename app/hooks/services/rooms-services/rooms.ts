import axios from 'axios';
import { CreateRoomDto } from '../../entities/createRoom.dto';

export default function RoomsHttp() {
    const api = axios.create({
        baseURL: 'http://172.20.10.2:3000/rooms', // Replace with your API base URL
        timeout: 3000,
    });

    return {
        getRoomInfoById: async (id: string) => {
            try {
                const response = await api.get(`info/${id}`);
                
                return {data: response.data, error: null};
            } catch (error: any) {
                return {data: null, error: error.response.data.message};                
            }
          
        },

        getResult: async (roomID: string) =>{
            try {
                const response = await api.get(`backup/${roomID}`);
                
                return {data: response.data, error: null};
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
            }
        },

        getAllRoom: async () => {
            try {
                const response = await api.get('/list/');
                return {data: response.data, error: null};
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
            }
           
        },

        createRoom: async (roomData: CreateRoomDto) => {
            try {
                const response = await api.post('/create', roomData);
                 return {data: response.data, error: null};
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
            }
            
        },

        closeRoom: async (id: string) => {
            try {
                const response = await api.post(`/close/${id}`);
                 return {data: response.data, error: null};
            } catch (error: any) {
                return {data: null, error: error.response.data.message};
            }
        }
    };
}
