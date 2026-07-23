import { createAsyncThunk } from "@reduxjs/toolkit";
import { OthersHttp } from "../../services/others/others.http";
import { Others } from "../../services/others/others.entitie";

const OtherHttp = OthersHttp();

export const getAllOthers = createAsyncThunk(
    'others/getAll',
    async (_, {rejectWithValue})=>{
        try {
            const data = await OtherHttp.getAll();
            return  data
        } catch (error: any) {
            console.log('error on loading:', error.message);

            return rejectWithValue({
                status: error.response?.status ?? 500,
                message: error.response.data?.message ?? "Erreur lors du chargement..."
            })  
        }
    }
)

export const updateOther = createAsyncThunk(
    'others/update',
    async (newData: Others, {rejectWithValue})=> {
        try {
            const data = await OtherHttp.update(newData)
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

export const createOther = createAsyncThunk(
    'others/create',
    async (newData: Others, {rejectWithValue})=> {
        try {
            const data = await OtherHttp.create(newData)
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