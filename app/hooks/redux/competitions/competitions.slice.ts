import { createSlice } from "@reduxjs/toolkit";
import CompetitionState from "./competitionState";
import { createCompetition, deleteOne, getCompetitionList, getCompetitionListAdmin, getHomeBase, getMyCompetitions, getOne, searchCompetitions, update } from "./competitions.thunks";


const initialState : CompetitionState = {
    selectedCompetition : null,
    competitionList: [],
    myCompetitionList: [],
    searchResults: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        pageSize: 20,
        totalItems: 0
    },
    homeBaseData: null,
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

        updateHomeBaseData(state, action){
            if(action.payload){
                state.homeBaseData = action.payload
            }
        },

        addCompetition(state, action){
            if(action.payload){
                state.competitionList.unshift(action.payload);
            }  
        },

        setSearchResultsComp(state, action){
            if(Array.isArray(action.payload)){
                state.searchResults = action.payload
            }else{
                state.searchResults = [];
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
            if(action.payload.statut === "ONGOING" || action.payload.statut === "UPCOMING" || action.payload.statut === "COMPLETED" || action.payload.statut === "CANCELLED"){
                if (state.selectedCompetition) {
                    
                    state.selectedCompetition.statut = action.payload.statut;
                    if(action.payload.statut == "ONGOING" && action.payload.roomId){
                        state.selectedCompetition.roomID = action.payload.roomId; 
                    }
                }
            }
        },

        deleteOnList(state, action){
            const id = action.payload
            if(state.competitionList.length > 0 && id){
                state.competitionList = state.competitionList.filter((compet)=> compet.id != id)
            }
        },

        setCompetitioErrorNull(state){
            state.error = null;
        },

        updateStatut(state, action){
            if(action.payload){
                const index = state.competitionList.findIndex((comp)=> comp.id == action.payload.competitionID)
                if(index != -1){
                    state.competitionList[index].statut = action.payload.statut as "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
                    state.myCompetitionList[index].roomID = action.payload.roomId;
                }

                //my list
                const myIndex = state.myCompetitionList.findIndex((comp)=> comp.id == action.payload.competitionID)
                if(myIndex != -1){
                    state.myCompetitionList[myIndex].statut = action.payload.statut as "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
                    state.myCompetitionList[myIndex].roomID = action.payload.roomId;
                }

                if(state.selectedCompetition && state.selectedCompetition.id == action.payload.competitionID && action.payload.statut == "ONGOING"){ 
                    state.selectedCompetition.statut = action.payload.statut;
                    if(action.payload.roomId) {
                        state.selectedCompetition.roomID = action.payload.roomId;
                    }
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
        setErrorCompetitionNull(state){
            state.error = null;
        },

        updateHomeBase(state, action){
            if(action.payload){
                state.homeBaseData = action.payload;
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
            state.searchResults = [];
            state.selectedCompetition = null;
            state.error = null;
            state.loading = false;
            state.actionDone = false;
            state.myCompetitionList = [];
            state.pagination = {
                currentPage: 1,
                totalPages: 1,
                pageSize: 20,
                totalItems: 0
            }
        }
    },
    extraReducers: (builder)=>{
        builder
            .addCase(getCompetitionList.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(getCompetitionList.fulfilled, (state, action)=>{
                if(!action.payload.error){
                    state.competitionList = action.payload.data;
                    state.pagination = {
                                       totalItems: action.payload.pagination?.totalItems,
                                        currentPage: action.payload.pagination?.currentPage,
                                        totalPages: action.payload.pagination?.totalPages,
                                        pageSize: action.payload.pagination?.pageSize
                                    };
                    
                }else{
                    state.error = action.payload.error
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(getCompetitionList.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(getCompetitionListAdmin.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(getCompetitionListAdmin.fulfilled, (state, action)=>{
                if(!action.payload.error){
                    state.competitionList = action.payload.data;
                    state.pagination = {
                        totalItems: action.payload.pagination?.totalItems,
                         currentPage: action.payload.pagination?.currentPage,
                         totalPages: action.payload.pagination?.totalPages,
                         pageSize: action.payload.pagination?.pageSize
                     };

                }else{
                    state.error = action.payload.error
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(getCompetitionListAdmin.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })

            //createCompetition
            .addCase(createCompetition.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(createCompetition.fulfilled, (state, action)=>{
                
                if(!action.payload.error){
                    state.competitionList.push(action.payload.data);
                    state.myCompetitionList.push(action.payload.data);
                    state.actionDone = true;

                }else{
                    state.error = action.payload.error
                }
                state.loading = false;
                
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
                if(!action.payload.error){
                    state.selectedCompetition = action.payload.data;
                }else{
                    state.error = action.payload.error
                }
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
                if(!action.payload.error){
                    state.competitionList = state.competitionList.filter((comp)=> comp.id !== action.payload.data);
                    state.myCompetitionList = state.myCompetitionList.filter((comp)=> comp.id !== action.payload.data);
                }else{
                    state.error = action.payload.error
                }
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
                if(!action.payload.error){
                    state.myCompetitionList = action.payload.data;
                }else{
                    state.error = action.payload.error
                }
                state.loading = false;
                
                state.error = null;
            })
            .addCase(getMyCompetitions.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })
            //
            .addCase(getHomeBase.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(getHomeBase.fulfilled, (state, action)=>{
                if(!action.payload.error){
                    state.homeBaseData= action.payload.data;
                }else{
                    state.error = action.payload.error
                }
                state.loading = false;
                
                state.error = null;
            })
            .addCase(getHomeBase.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(searchCompetitions.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(searchCompetitions.fulfilled, (state, action)=>{
                if(!action.payload.error){
                    state.searchResults = action.payload.data;
                   
                }else{
                    state.error = action.payload.error
                }   
                state.loading = false;
                state.error = null;
            })

            .addCase(searchCompetitions.rejected, (state, action)=>{
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
    updateSelectedCompetition,
    setCompetitioErrorNull,
    setErrorCompetitionNull,
    updateHomeBaseData,
    updateHomeBase,
    setSearchResultsComp,
}  = competitionSlice.actions;