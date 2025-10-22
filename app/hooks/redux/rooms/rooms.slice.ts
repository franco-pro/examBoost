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

            addConnectedUsers(state, action){
                if(state.room){
                    state.room.users.push(...action.payload);
                }
            },

            addConnetedUser(state, action){
                if(state.room){
                    //remove creator 
                    state.room.users.push(action.payload.filter((user: any) => user.userID !== state.room?.creatorID));
                }
            },

            setUserDeconnected(state, action){
                if(state.room){
                    state.room.users.findIndex((user)=>{
                        user.id === action.payload ? (user.isConnected = false) : null;
                    });
                }
            },

            rangking(state, action){
                if(state.room){
                    state.room.rangking = action.payload;
                }
            },

            addViewerr(state){
                if(state.room){
                    state.room.viewers += 1;
                }
            },

            removeViewer(state){
                if(state.room){
                    state.room.viewers -= 1;
                }
            },

            addQuestion(state, action){
                if(state.room){
                    state.room.questions.push(action.payload);   
                }
            },

            addAnswer(state, action){
                if(state.room){
                    const index = state.room.questions.findIndex(question => question.id == action.payload.questionID)
                    state.room.questions[index].answers.push(action.payload);
                }
            },

            setRoomQuestion(state, action){
                if(state.room){
                    state.room.questions = action.payload;
                }
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
    export const { 
        clearRoom, 
        setRoomId, 
        setRomm, 
        setRoomQuestion,
        addConnectedUsers,
        addConnetedUser,
        setUserDeconnected,
        rangking,
        addViewerr,
        removeViewer,
        addAnswer,
        addQuestion

    } = roomSlice.actions;