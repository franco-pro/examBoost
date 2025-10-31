import { createSlice } from '@reduxjs/toolkit';
import { RoomState } from './roomState.entitie';
import { fetchRoomCreate } from './rooms.thunks';

   
    const initialState: RoomState = {
        room: null,
        roomLeaveed: [],
        roomResult: null,
        loading: false,
        error: null,
        socketWaiting: true,
        competitionFinished: false,
        competitionStop : false,
        timerOff: false,
        nextQuestion: false,
        message: null

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
                state.roomResult = null; 
                state.competitionFinished = false;
                state.competitionStop = false;
                state.timerOff = false;
                state.message = null;
            },

            addConnectedUsers(state, action){
                if(state.room){
                    //remove creator 
                    if(state.room.users.length == 0){
                        state.room.users = action.payload.filter((user: any) => user.userID !== state.room?.creatorID);
                    }else{
                        const data_withoutOwner = action.payload.filter((user: any) => user.userID !== state.room?.creatorID);
                        state.room.users.concat(data_withoutOwner);
                    }
                    
                }
            },

            passToNextQuestion(state){
                state.nextQuestion = state.nextQuestion ? false:true;
            },

            setSocketWaiting(state, action){
                state.socketWaiting = action.payload;
            },
            addConnetedUser(state, action){
                if(state.room){
                    const currentUserIndex = state.room.users.findIndex(user => user.userID == action.payload.userID);
                    if(currentUserIndex == -1){
                        //without creator
                        let isCreator = action.payload.userID === state.room.creatorID;
                        if(!isCreator){
                          state.room.users.push(action.payload);
                        }
                    }
                }
            },

            setUserDeconnected(state, action){
                if(state.room){
                    state.room.users.findIndex((user)=>{
                        user.userID === action.payload ? (user.isConnected = false) : null;
                    });

                }
            },

            rangking(state, action){
                if(state.room){
                    state.room.users = action.payload
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
                    state.room.questions.unshift(action.payload);   
                }
            },

            addAnswer(state, action){
                if(state.room){
                    const index = state.room.questions.findIndex(question => question.id == action.payload.questionID)
                    state.room.questions[index].answers.push(action.payload);
                }
            },

            reduiceQuestionNbr(state){
                if(state.room){
                    if(state.room.competitionInfo.questionsNbr != 0){
                        state.room.competitionInfo.questionsNbr--;
                    }
                }
            },

            setRoomQuestion(state, action){
                if(state.room){
                    state.room.questions = action.payload;
                    state.socketWaiting = false;
                }
            },

            setEndOfCompetition(state){
                state.roomResult = state.room;
                state.room = null
                state.loading = false
                state.error = null
                state.socketWaiting = false;
                state.competitionStop = false;
                state.competitionFinished = true;
                state.message = null;  
                state.timerOff = false; 
                state.nextQuestion = false;  
            },

            setTimeOff(state, action){
                state.timerOff = true;
            },

            userLeaveRoom(state){
               state.roomLeaveed.push(state.room ? state.room.roomId : 'null');

                state.room = null
                state.loading = false
                state.error = null
                state.socketWaiting = false;
                state.competitionFinished = false;
                state.competitionStop = false;
                state.message = null
                state.timerOff = false;  
                state.nextQuestion = false;  

            },

            clearRoom(state, action) {
                state.room = null
                state.loading = false
                state.error = null
                state.socketWaiting = false;
                state.competitionFinished = false;
                state.competitionStop = true;
                state.timerOff = false;   
                state.nextQuestion = false;  
                state.message = action.payload;

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
                    state.competitionFinished = false;
                    state.competitionStop = false;
                    state.message = null;

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
        setTimeOff,
        addQuestion,
        setSocketWaiting,
        setEndOfCompetition,
        userLeaveRoom,
        reduiceQuestionNbr,
        passToNextQuestion
    } = roomSlice.actions;