import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CreateRoomDto } from './entities/createRoom.dto';
import { Room } from './entities/rooms.entity';
import RoomsHttp from './services/rooms-services/rooms';

export default function OnlineCompetitionRedux() {
    const roomsHttp = RoomsHttp()

    interface RoomState {
        room: Room | null;
        loading: boolean;
        error: string | null;
    }

    const initialState: RoomState = {
        room: null,
        loading: false,
        error: null,
    }

    const fetchRoomCreate = createAsyncThunk(
        'room/fetchCreate',
        async (payload: CreateRoomDto, { rejectWithValue }) => {
            try {
                const data = await roomsHttp.createRoom(payload)
                return data
            } catch (error: any) {

                return rejectWithValue({
                    status: error.response?.status ?? 500,
                    message: error.response?.data?.message ?? 'Erreur réseau',
                })
            }
        }
    )

    const roomSlice = createSlice({
        name: 'room',
        initialState,
        reducers: {
            setRoomId(state, action) {
                state.room ? (state.room.id = action.payload) : null
            },
            setRomm(state, action){
                state.room = action.payload;
            },

            setUpdateRoomUser(state, action){
                if(state.room){
                    state.room.users = action.payload;
                }
            },
            clearRoom(state) {
                state.room = null
                state.loading = false
                state.error = null
            },
        },
        extraReducers: (builder) => {
            builder
                .addCase(fetchRoomCreate.pending, (state) => {
                    state.loading = true
                    state.error = null
                })
                .addCase(fetchRoomCreate.fulfilled, (state, action) => {
                    state.loading = false
                    state.room = action.payload
                })
                .addCase(fetchRoomCreate.rejected, (state, action) => {
                    state.loading = false
                    state.error = action.payload as string
                })
        },
    })

    const store = configureStore({
        reducer: {
            room: roomSlice.reducer,
        },
    })

    return {
        store,
        actions: roomSlice.actions,
        fetchRoomCreate,
    }
}