import { createSlice } from "@reduxjs/toolkit";
import { OthersState } from "./others.state";
import { createOther, getAllOthers, updateOther } from "./others.thunks";


const initialState : OthersState = {
    loading : false,
    othersList: [],
    selectedOther: null,
    error: null
}

const othersSlice = createSlice(
    {
        name: "others",
        initialState,
        reducers: {
            setOthersList: (state, action)=>{
                if(Array.isArray(action.payload) && action.payload.length != 0){
                    state.othersList = action.payload
                }
            },

            setSelectedOther: (state, action)=>{
                state.selectedOther = action.payload
            }
        },
        extraReducers: (builder) =>{
            builder
                .addCase(getAllOthers.pending, (state)=>{
                    state.loading = true;
                    state.error = null;
                })
                .addCase(getAllOthers.fulfilled, (state, action)=>{
                    state.loading = false;
                    if(!action.payload.error && action.payload.data){
                        state.othersList = action.payload.data
                    }else{
                        state.error = action.payload.error
                    }
                    state.error = null;
                })
                .addCase(getAllOthers.rejected, (state, action)=>{
                    state.loading = false;
                    state.error = action.payload as string                    
                })
                .addCase(createOther.pending, (state)=>{
                    state.loading = true;
                    state.error = null;
                })
                .addCase(createOther.fulfilled, (state, action)=>{
                    state.loading = false;
                    if(!action.payload.error && action.payload.data){
                        state.othersList.unshift(action.payload.data)
                    }else{
                        state.error = action.payload.error
                    }
                    state.error = null;
                })
                .addCase(createOther.rejected, (state, action)=>{
                    state.loading = false;
                    state.error = action.payload as string                    
                })

                .addCase(updateOther.pending, (state)=>{
                    state.loading = true;
                    state.error = null;
                })
                .addCase(updateOther.fulfilled, (state, action)=>{
                    state.loading = false;
                    console.log("action payload", action.payload)
                    if(!action.payload.error){
                        const updatedata= {...action.payload.data}

                        const index = state.othersList.findIndex(other => other.id ===updatedata.id )
                        if(index != -1){
                            state.othersList[index] = updatedata;
                        }
                    }else{
                        state.error = action.payload.error
                    }
                    state.error = null;
                })
                .addCase(updateOther.rejected, (state, action)=>{
                    state.loading = false;
                    state.error = action.payload as string                    
                })
        },
    }
)

export default othersSlice.reducer;
export const {
    setSelectedOther,
    setOthersList
} = othersSlice.actions;