import { createSlice } from "@reduxjs/toolkit";
import CompetitionState from "./competitionState";
import { createCompetition, deleteOne, getCompetitionList, getMyCompetitions, getOne, update } from "./competitions.thunks";


const initialState : CompetitionState = {
    selectedCompetition : null,
    competitionList: [],
    myCompetitionList: [],
    loading: false,
    actionDone: false,
    error: null
}

const competitionSlice = createSlice({
    name: 'competitions',
    initialState,
    reducers: {
        setList(state, action){
            if(Array.isArray(action.payload)){
                state.competitionList = action.payload
            }else{
                console.log('Is not Array')
            }
        },

        addCompetition(state, action){
            if(action.payload){
                state.competitionList.unshift(action.payload);
            }  
        },

        setMyCompetitionList(state, action){
            if(Array.isArray(action.payload)){
                state.myCompetitionList = action.payload
            }else{
                console.log('is Not array', action.payload)
            }
        },
        
        setSelectedCompetition(state, action){
            if(action.payload){
                state.selectedCompetition = action.payload
            }
        },

        setSelectedCompetitionNull(state){
            state.selectedCompetition = null;
        },

        updateSelectedCompetition(state, action){
            if(action.payload === "ONGOING" || action.payload === "UPCOMING" || action.payload === "COMPLETED" || action.payload === "CANCELLED"){
                if (state.selectedCompetition) {
                    state.selectedCompetition.statut = action.payload;
                }
            }
        },

        deleteOnList(state, action){
            const id = action.payload
            if(state.competitionList.length > 0 && id){
                state.competitionList = state.competitionList.filter((compet)=> compet.id != id)
            }
        },

        updateStatut(state, action){
            if(action.payload){
                const index = state.competitionList.findIndex((comp)=> comp.id == action.payload.competitionID)
                if(index != -1){
                    state.competitionList[index].statut = action.payload.statut as "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";;
                }

                //my list
                const myIndex = state.myCompetitionList.findIndex((comp)=> comp.id == action.payload.competitionID)
                if(myIndex != -1){
                    state.myCompetitionList[myIndex].statut = action.payload.statut as "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";;
                }

                if(state.selectedCompetition && state.selectedCompetition.id == action.payload.competitionID && action.payload.statut == "ONGOING"){ 
                    state.selectedCompetition.statut = action.payload.statut;
                }
            }
        },

        updateSuscribers(state, action){
            if(action.payload){
                const index = state.competitionList.findIndex((comp)=> comp.id === action.payload.competitionID)
                if(index != -1){
                    state.competitionList[index].suscribers.push(action.payload.newSuscriber);
                }

                //mylist
                const myIndex = state.myCompetitionList.findIndex((comp)=> comp.id === action.payload.competitionID)
                if(myIndex != -1){
                    state.myCompetitionList[myIndex].suscribers.push(action.payload.newSuscriber);
                }
            }
        },

        updateOne(state, action){
            console.log('action payloa', action.payload)
            if(action.payload){
                const indexInTotalList = state.competitionList.findIndex((competition)=> competition.id === action.payload.id)
                const indexInMyList = state.myCompetitionList.findIndex((competition)=> competition.id === action.payload.id)
                
                if(indexInMyList != -1){
                    state.competitionList[indexInTotalList] = action.payload;
                }else {
                    // console.log('index to update not found:', action.payload, state.competitionList);
                }

                if(indexInMyList != -1){
                    state.myCompetitionList[indexInMyList] = action.payload;
                }else{
                    console.log('index to update not found:', action.payload);

                }
            }
        },

        resetActionDone(state){
            state.actionDone = false;
        },

        clearData(state){
            state.competitionList = [];
            state.selectedCompetition = null;
            state.error = null;
            state.loading = false;
            state.actionDone = false;
            state.myCompetitionList = [];
        }
    },
    extraReducers: (builder)=>{
        builder
            .addCase(getCompetitionList.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(getCompetitionList.fulfilled, (state, action)=>{
                state.competitionList = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getCompetitionList.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })

            //createCompetition
            .addCase(createCompetition.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(createCompetition.fulfilled, (state, action)=>{
                state.myCompetitionList.push(action.payload)
                state.competitionList.push(action.payload)
                state.loading = false;
                state.actionDone = true;
                state.error = null;
            })
            .addCase(createCompetition.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })
            //getOne
            .addCase(getOne.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(getOne.fulfilled, (state, action)=>{
                state.selectedCompetition = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getOne.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })
            //deleteOne
            .addCase(deleteOne.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOne.fulfilled, (state, action)=>{
                state.competitionList = state.competitionList.filter((comp)=> comp.id !== action.payload);
                state.myCompetitionList = state.myCompetitionList.filter((comp)=> comp.id !== action.payload);

                state.loading = false;
                state.error = null;
            })
            .addCase(deleteOne.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })
            //update
            .addCase(update.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(update.fulfilled, (state, action)=>{
                
                state.actionDone = true;

                state.loading = false;
                state.error = null;
            })
            .addCase(update.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })
            //getMyList
            .addCase(getMyCompetitions.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyCompetitions.fulfilled, (state, action)=>{
                state.myCompetitionList = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getMyCompetitions.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })
    }
})

export default competitionSlice.reducer;

export const {
    setList,
    deleteOnList,
    updateOne,
    clearData,
    setMyCompetitionList,
    setSelectedCompetition,
    setSelectedCompetitionNull,
    addCompetition,
    resetActionDone,
    updateSuscribers,
    updateStatut,
    updateSelectedCompetition
}  = competitionSlice.actions;