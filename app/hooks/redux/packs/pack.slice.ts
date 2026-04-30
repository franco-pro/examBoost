import { createSlice } from "@reduxjs/toolkit"
import { PackState } from "./pack.state";
import { createPack, getPacks, updatePack } from "./pack.thunks";


const initialState: PackState = {
    loading: false,
    error: null,
    packs: []
}

const packSlice = createSlice({
    name: "packs",
    initialState,
    reducers: {
        setPacks(state, action){
            state.packs = action.payload;
        },
        resetState(state){
            state.loading = false;
            state.error = null;
            state.packs = [];
        }
    },
    extraReducers: (builder)=>{
        builder
        .addCase(getPacks.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(getPacks.fulfilled, (state, action)=>{
            if(!action.payload.error){
                state.packs = action.payload.data;
            }else{
                state.error = action.payload.error
            }
    
            state.loading = false;
            state.error = null;
        })
        .addCase(getPacks.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload as string
        })
        
        .addCase(createPack.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(createPack.fulfilled, (state, action)=>{
            if(!action.payload.error){
                state.packs.unshift(action.payload.data);
            }else{
                state.error = action.payload.error
            }
    
            state.loading = false;
            state.error = null;
        })
        .addCase(createPack.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload as string
        })

        .addCase(updatePack.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(updatePack.fulfilled, (state, action)=>{
            if(!action.payload.error){
                const updatedPack = action.payload.data;
                const index = state.packs.findIndex(pack => pack.id === updatedPack.id);
                if(index !== -1){
                    state.packs[index] = updatedPack;
                }
            }else{
                state.error = action.payload.error
            }
    
            state.loading = false;
            state.error = null;
        })
        .addCase(updatePack.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload as string
        })
    }
})

export default packSlice.reducer;
export const {
    setPacks,
    resetState
} = packSlice.actions;