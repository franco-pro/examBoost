import axios from 'axios';
import { CreateRoomDto } from '../../entities/createRoom.dto';

export default function RoomsHttp() {
    const api = axios.create({
        baseURL: 'http://172.20.10.2:3000/rooms', // Replace with your API base URL
        timeout: 3000,
    });

    return {
        getRoomInfoById: async (id: string) => {
            const response = await api.get(`info/${id}`);
            return response.data;
        },

        getAllRoom: async () => {
            const response = await api.get('/list/');
            return response.data;
        },

        createRoom: async (roomData: CreateRoomDto) => {
            const response = await api.post('/create', roomData);
            return response.data;
        },

        closeRoom: async (id: string) => {
            const response = await api.post(`/close/${id}`);
            return response.data;
        }
    };
}
