import { createSlice } from "@reduxjs/toolkit";
import { createSubscription, getMyParticipations } from "./subscription.thunks";
import SubscriptionState from "./subscriptionState";

const initialState : SubscriptionState = {
    selectedSubscription: null,
    mySubscriptionList: [],
    actionDone: false,
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

        setActionDoneNULL(state){
            state.actionDone = false;
        },

        setSuscriptionErrorNULL(state){
            state.error = null;
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

        updateStatutSuscription(state, action){
            if(action.payload){
                //my  suscription list
                const myIndex = state.mySubscriptionList.findIndex((comp)=> comp.id == action.payload.competitionID)
                if(myIndex != -1){
                    state.mySubscriptionList[myIndex].statut = action.payload.statut as "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";;
                }

                if(state.selectedSubscription && state.selectedSubscription.id == action.payload.competitionID && action.payload.statut == "ONGOING"){ 
                    state.selectedSubscription.statut = action.payload.statut;
                }
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
                    if(!action.payload.error){
                        state.mySubscriptionList = action.payload.data; 
                    }else{
                        state.error = action.payload.error;
                    }
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
                    if(!action.payload.error){
                        state.actionDone = true;
 
                    }else{
                        state.error = action.payload.error;
                    }
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
    setSelectedSubscriptionNULL,
    setActionDoneNULL,
    setSuscriptionErrorNULL,
    updateStatutSuscription,
} = subscriptionSlice.actions;