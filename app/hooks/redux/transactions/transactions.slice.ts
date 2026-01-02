import { createSlice } from "@reduxjs/toolkit";
import { TransactionState } from "./transaction.state";
import { getAllTransations } from "./transaction.thunks";


const initialState : TransactionState = {
    transactionList: [],
    error: null,
    loading: false
}

const transactionSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        addTransaction(state, action){
            if(action.payload){
                state.transactionList.push(action.payload);
            }
        }
    },
    extraReducers: (builder)=>{
        builder
            .addCase(getAllTransations.pending, (state)=>{
                state.loading = true;
                state.error = null
            })
            .addCase(getAllTransations.fulfilled, (state, action)=>{
                if(!action.payload.error){
                    state.transactionList = action.payload.data;
                }else{
                    state.error = action.payload.error
                }

                state.loading = false;
                state.error = null;
            })
            .addCase(getAllTransations.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string 
            })
    }
})

export default transactionSlice.reducer;

export const {
    addTransaction
} = transactionSlice.actions