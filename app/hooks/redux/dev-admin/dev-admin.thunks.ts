import { createAsyncThunk } from "@reduxjs/toolkit";
import DevAdminHttp from "../../services/dev-admin/dev-admin.http";
import PacksHttp from "../../services/packs/pack..http";


const devAmdinHttp = DevAdminHttp();

export const getHomeData = createAsyncThunk(
    "devAdmin/getHomeData",
    async (userid: number, {rejectWithValue})=>{
        try {
            const data = await devAmdinHttp.getHomeData(userid);
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
