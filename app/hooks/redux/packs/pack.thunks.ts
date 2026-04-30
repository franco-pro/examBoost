import { createAsyncThunk } from "@reduxjs/toolkit";
import PacksHttp from "../../services/packs/pack..http";


const packsHttp = PacksHttp()


export const getPacks = createAsyncThunk(
    "devAdmin/getPacks",
    async (_, {rejectWithValue})=>{
        try {
            const data = await packsHttp.getAllPacks();
            return data;
        } catch (error: any) {
            console.log('error on loading:', error.message);

            return rejectWithValue({
                status: error.response?.status ?? 500,
                message: error.response.data?.message ?? "Erreur lors du chargement..."
            })
        }
    }
)

export const createPack = createAsyncThunk(
    "devAdmin/createPack",
    async (data: any, {rejectWithValue})=>{
        try {
            const response = await packsHttp.create(data);
            return response;
        } catch (error: any) {
            console.log('error on creating pack:', error.message);

            return rejectWithValue({
                status: error.response?.status ?? 500,
                message: error.response.data?.message ?? "Erreur lors du chargement..."
            })
        }
    }
)

export const updatePack = createAsyncThunk(
    "devAdmin/updatePack",
    async ({id, data}: {id: number, data: any}, {rejectWithValue})=>{
        try {
            const response = await packsHttp.update(id, data);
            return response;
        } catch (error: any) {
            console.log('error on updating pack:', error.message);

            return rejectWithValue({
                status: error.response?.status ?? 500,
                message: error.response.data?.message ?? "Erreur lors du chargement..."
            })
        }
    }
)