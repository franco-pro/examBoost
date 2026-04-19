import { createSlice } from "@reduxjs/toolkit"
import DevAdminState from "./dev-adminState"
import { getHomeData } from "./dev-admin.thunks"


const initialState : DevAdminState = {
    loading: false,
    error: null,
    competitions: {
        total: 0,
        upcoming: 0,
        ongoing: 0,
        past: 0,
        canceled: 0,
        amountGenerated: 0
    },
    totalUsers: {
        total: 0,
        active: 0,
        inactive: 0
    },
    documents: {
        toApprove: 0,
        approved: 0,
        rejected: 0,
        total: 0
    },
    accountWallet: {
        totalBalance: 0,
        competition: 0,
        packs: 0,
        userWithdrawals: 0,
        netBalance: 0
    }
}

const devAdminSlice = createSlice(
    {
        name: "devAdmin",
        initialState,
        reducers: {
            resetState: (state)=>{
                state.loading = false;
                state.error = null;
                state.competitions = {
                    total: 0,
                    upcoming: 0,
                    ongoing: 0,
                    past: 0,
                    canceled: 0,
                    amountGenerated: 0
                };
                state.totalUsers = {
                    total: 0,
                    active: 0,
                    inactive: 0
                };
                state.documents = {
                    toApprove: 0,
                    approved: 0,
                    rejected: 0,
                    total: 0
                };
                state.accountWallet = {
                    totalBalance: 0,
                    competition: 0,
                    packs: 0,
                    userWithdrawals: 0,
                    netBalance: 0
                }
            },
            setCompetitionInfo: (state, action)=>{
                if(action.payload){
                    state.competitions = action.payload
                }
            },
            setDocumentsInfo: (state, action)=>{
                if(action.payload){
                    state.documents = action.payload
                }
            },
            setTotalUsersInfo: (state, action)=>{
                if(action.payload){
                    state.totalUsers = action.payload
                }
            },
            setAccountWalletInfo: (state, action)=>{
                if(action.payload){
                    state.accountWallet = action.payload
                }
            }
        },
        
        extraReducers: (builder)=>{
            builder
                .addCase(getHomeData.pending, (state)=>{
                    state.loading = true;
                    state.error = null
                })
                .addCase(getHomeData.fulfilled, (state, action)=>{
                    if(!action.payload.error && action.payload.data){
                        if(action.payload.data.competitions) state.competitions = action.payload.data.competitions;
                        if(action.payload.data.totalUsers) state.totalUsers = action.payload.data.totalUsers;
                        if(action.payload.data.documents) state.documents = action.payload.data.documents;
                        if(action.payload.data.accountWallet) state.accountWallet = action.payload.data.accountWallet;
                    }else{
                        state.error = action.payload.error
                    }
                    state.loading = false;
                    state.error = null;
                })
                .addCase(getHomeData.rejected, (state, action)=>{
                    state.loading = false;
                    state.error = action.payload as string 
                })
        }
    }
)

export default devAdminSlice.reducer;
export const {
    resetState,
    setCompetitionInfo,
    setDocumentsInfo,
    setTotalUsersInfo,
    setAccountWalletInfo
} = devAdminSlice.actions;
    