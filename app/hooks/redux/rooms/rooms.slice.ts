import { createSlice } from '@reduxjs/toolkit';
import { RoomState } from './roomState.entitie';
import { fetchRoomCreate } from './rooms.thunks';

   
    const initialState: RoomState = {
        room: null,
        roomLeaveed: [],
        roomResult: null,
        loading: false,
        error: null,
        errorType: null,
        socketWaiting: true,// ui loader... = waiting question
        waitingLaunching: false,
        waitingAnswerConfirmation: false,
        waitingJoining: false,
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
            setRoomNull(state) {
                state.roomResult = null;
                state.loading = false
                state.error = null
                state.socketWaiting = true;
                state.competitionFinished = false;
                state.competitionStop = false;
                state.message = null
                state.timerOff = false;  
                state.nextQuestion = false;  
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
                state.socketWaiting = false;
                state.nextQuestion = true;
            },
            
            resetNexQuestion(state){
                state.nextQuestion = false;
            },

            setSocketWaiting(state, action){
                state.socketWaiting = action.payload;
            },

            setWaitingAnswerConfirmation(state, action){
                state.waitingAnswerConfirmation = action.payload;
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

            setErrorType(state, action){
                state.errorType = action.payload;
            },

            rangking(state, action){
                if(state.room){
                    state.room.users = action.payload
                    state.room.rangking = action.payload;
                }
            },

            addViewerr(state, action){
                if(state.room){
                    state.room.spectators = action.payload;
                }
            },

            removeViewer(state){
                if(state.room){
                    state.room.spectators -= 1;
                }
            },

            addQuestion(state, action){
                if(state.room){
                    console.log('state before added Q', state.room.questions)
                    state.room.questions.unshift(action.payload);   
                    console.log('state after added Q', state.room.questions)

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

            setRoomsErrorNull(state){
                state.error = null;
            },

            setRoomsError(state, action){
                if(action.payload){
                    state.error = action.payload;
                }
            },

            setWaitingJoinin(state, action){
                state.waitingJoining = action.payload;
            },

            setRoomQuestion(state, action){
                if(state.room){
                    state.room.questions = action.payload;
                    state.socketWaiting = false;
                }
            },

            setEndOfCompetition(state){
                state.roomResult = null;
                
                if(state.room && !state.roomResult){
                    state.roomResult = state.room
                }
            
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

            setTimeOff(state){
                state.timerOff = true;
            },

            userLeaveRoom(state){
               state.roomLeaveed.push(state.room ? state.room.roomId : 'null');

                state.room = null
                state.loading = false
                state.error = null
                state.socketWaiting = false;
                state.waitingLaunching = false;
                state.competitionFinished = false;
                state.roomResult = null
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
                state.waitingLaunching = false;
                state.competitionFinished = false;
                state.competitionStop = true;
                state.timerOff = false;   
                state.nextQuestion = false;  
                state.roomResult = null;
                if(action.payload){
                    state.message = action.payload;
                }

                console.log('room clear')
            },

            resetRoomState: () => initialState,
        },
        extraReducers: (builder) => {
            builder
                .addCase(fetchRoomCreate.pending, (state) => {
                    state.waitingLaunching = true;
                    state.loading = true
                    state.error = null
                })
                .addCase(fetchRoomCreate.fulfilled, (state, action) => {
                    state.loading = false
                    state.waitingLaunching = false;
                    state.competitionFinished = false;
                    state.competitionStop = false;
                    state.message = null;

                    if(!action.payload.error){
                        state.room = action.payload.data;
                       
                    }else{
                        state.error = action.payload.error
                    }

                })
                .addCase(fetchRoomCreate.rejected, (state, action) => {
                    state.loading = false
                    state.waitingLaunching = false;
                    state.socketWaiting = false;
                    state.error = action.payload as string
                })
        },
    })

    export default roomSlice.reducer;
    export const { 
        clearRoom, 
        setRoomNull, 
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
        setWaitingAnswerConfirmation,
        addQuestion,
        setSocketWaiting,
        setEndOfCompetition,
        userLeaveRoom,
        reduiceQuestionNbr,
        passToNextQuestion,
        resetRoomState,
        setRoomsErrorNull,
        setRoomsError,
        setWaitingJoinin,
        setErrorType,
        resetNexQuestion
    } = roomSlice.actions;