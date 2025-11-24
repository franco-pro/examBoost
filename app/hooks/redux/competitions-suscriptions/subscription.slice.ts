import { createSlice } from "@reduxjs/toolkit";
import { createSubscription, getMyParticipations } from "./subscription.thunks";
import SubscriptionState from "./subscriptionState";

const initialState : SubscriptionState = {
    selectedSubscription: null,
    mySubscriptionList: [],
    loading : false,
    error: null
}

const subscriptionSlice = createSlice({
    name: 'subscriptions',
    initialState,
    reducers: {
        setSuscribtionList(state, action){
            if(Array.isArray(action.payload)){
                state.mySubscriptionList = action.payload;
            }
        },

        setSelectedSubscription(state, action){
            if(action.payload){
                state.selectedSubscription = action.payload;
            }
        },

        addSusbcriptions(state, action){
            if(action.payload){
                state.mySubscriptionList.push(action.payload);
            }
        },

        setSelectedSubscriptionNULL(state){
            state.selectedSubscription = null
        },  

        clearSuscriptionState(state){
            state.mySubscriptionList = [];
            state.loading = false;
            state.error = null;
            state.selectedSubscription = null;
        }
    },

    extraReducers: (builder)=> {
            builder
                .addCase(getMyParticipations.pending, (state)=>{
                    state.loading = true;
                    state.error = null;
                })
                .addCase(getMyParticipations.fulfilled, (state, action)=>{
                    state.mySubscriptionList = action.payload;
                    state.loading = false;
                    state.error = null;
                })
                .addCase(getMyParticipations.rejected, (state, action)=>{
                    state.loading = false;
                    state.error = action.payload as string;
                })

                .addCase(createSubscription.pending, (state)=>{
                    state.loading =true;
                    state.error = null;
                })
                .addCase(createSubscription.fulfilled, (state, action)=>{
                    addSusbcriptions(action.payload)
                    state.loading =false;
                    state.error = null;
                })
                .addCase(createSubscription.rejected, (state, action)=>{
                    state.loading = false;
                    state.error = action.payload as string
                })
    }
})

export default subscriptionSlice.reducer;

export const {
    setSelectedSubscription,
    setSuscribtionList,
    addSusbcriptions,
    clearSuscriptionState,
    setSelectedSubscriptionNULL
} = subscriptionSlice.actions;