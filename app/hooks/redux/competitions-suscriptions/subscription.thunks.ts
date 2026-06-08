import { createAsyncThunk } from "@reduxjs/toolkit";
import SubscriptionsHttp from "../../services/competitions/suscriptions";


const subscriptionsHttp = SubscriptionsHttp();

export const createSubscription = createAsyncThunk(
    'subscription/create',
    async (data: {userID: number, competitionID: number, score: 0, suscribeFromInvitation: boolean}, {rejectWithValue})=>{
        try {
            console.log('response checkkkker', data)

            const response = await subscriptionsHttp.createSubscription(data);
            return response;
        } catch (error: any) {
            console.log('error on creating subscription', error)

            return rejectWithValue({
                status: error.response?.status ?? 500,
                message: error.message ?? "Erreur lors du chargement..."
            })
        }
    }
)

export const getMyParticipations = createAsyncThunk(
    'subscription/get',
    async (userId: number, {rejectWithValue})=>{
        try {
            const response = await subscriptionsHttp.getSubscription(userId);
            return response;
        } catch (error: any) {
            console.log('error on creating getting compet subscription', error.message)

            return rejectWithValue({
                status: error.response?.status ?? 500,
                message: error.response?.data?.message ?? "Erreur lors du chargement..."
            })
        }
    }
)