import { createSlice } from '@reduxjs/toolkit';
import { RoomState } from './roomState.entitie';
import { fetchRoomCreate } from './rooms.thunks';

   
    const initialState: RoomState = {
        room: null,
        loading: false,
        error: null,
    }
   const roomSlice = createSlice({
        name: 'room',
        initialState,
        reducers: {
            setRoomId(state, action) {
                state.room ? (state.room.roomId = action.payload) : null
            },
            setRomm(state, action){
                state.room = action.payload;
            },

            clearRoom(state) {
                state.room = null
                state.loading = false
                state.error = null

                console.log('room clear')
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

    export default roomSlice.reducer;
    export const { clearRoom, setRoomId, setRomm } = roomSlice.actions;