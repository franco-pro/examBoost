import { createAsyncThunk } from '@reduxjs/toolkit';
import { CreateRoomDto } from '../../entities/createRoom.dto';
import RoomsHttp from '../../services/rooms-services/rooms';

const roomsHttp = RoomsHttp();

export const fetchRoomCreate = createAsyncThunk(
  'room/fetchCreate',
  async (payload: CreateRoomDto, { rejectWithValue }) => {
    try {
      const data = await roomsHttp.createRoom(payload);
      return data;
    } catch (error: any) {
        console.log('error:', error)
      return rejectWithValue({
        status: error.response?.status ?? 500,
        message: error.response?.data?.message ?? 'Erreur réseau',
      });
    }
  }
);