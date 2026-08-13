import { createSlice } from "@reduxjs/toolkit";
import NiveauxState from "./niveauxState";
import { createNiveau, deleteNiveau, getAllNiveaux, updateNiveau } from "./niveaux.thunks";


const initialState :NiveauxState = {
    niveauxList: [],
    selectedNiveau: null,
    error: null,
    loading: false
}

const niveauxSlice = createSlice({
    name: "niveaux",
    initialState,
    reducers: {
        setNiveauxList(state, action){
            state.niveauxList = action.payload;
        },
        setSelectedNiveau(state, action){
            state.selectedNiveau = action.payload;
        },
        resetState(state){
            state.niveauxList = [];
            state.selectedNiveau = null;
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder)=>{
        builder
            .addCase(getAllNiveaux.pending, (state)=>{
                state.loading = true;
                state.error = null
            })
            .addCase(getAllNiveaux.fulfilled, (state, action)=>{
                if(!action.payload.error){
                    state.niveauxList = action.payload.data;
                }else{
                    state.error = action.payload.error
                }
        
                state.loading = false;
                state.error = null;
            })
            .addCase(getAllNiveaux.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string 
            })
            .addCase(updateNiveau.pending, (state)=>{
                state.loading = true;
                state.error = null
            })
            .addCase(updateNiveau.fulfilled, (state, action)=>{
                if(!action.payload.error){
                    const updatedNiveau = {...action.payload.data};

                    const index = state.niveauxList.findIndex(niveau => niveau.id === updatedNiveau.id);
                    if(index !== -1){
                        state.niveauxList[index] = updatedNiveau;
                    }
                }else{
                    state.error = action.payload.error
                }
        
                state.loading = false;
                state.error = null;
            })
            .addCase(updateNiveau.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string
             })

             .addCase(deleteNiveau.pending, (state)=>{
                state.loading = true;
                state.error = null
             })
             .addCase(deleteNiveau.fulfilled, (state, action)=>{
                if(!action.payload.error){
                    const deletedNiveauId = action.payload.data.id;
                    state.niveauxList = state.niveauxList.filter(niveau => niveau.id !== deletedNiveauId);
                }else{
                    state.error = action.payload.error
                }
        
                state.loading = false;
                state.error = null;
             })

             .addCase(createNiveau.pending, (state)=>{
                state.loading = true;
                state.error = null
             })
             .addCase(createNiveau.fulfilled, (state, action)=>{
                if(!action.payload.error){
                    state.niveauxList.unshift(action.payload.data);
                }else{
                    state.error = action.payload.error
                }
        
                state.loading = false;
                state.error = null;
             })
             .addCase(createNiveau.rejected, (state, action)=>{                state.loading = false;
                state.error = action.payload as string
                state.loading = false;
             })
            
    }
});

export default niveauxSlice.reducer;
export const {
    setNiveauxList,
    setSelectedNiveau,
    resetState
} = niveauxSlice.actions;