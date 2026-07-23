import { createAsyncThunk } from "@reduxjs/toolkit";
import NiveauHttp from "../../services/niveaux/niveaux";

const niveauwHttp = NiveauHttp();

export const getAllNiveaux = createAsyncThunk(
    'niveaux/getAll',
    async (_, {rejectWithValue}) => {
        try {
            const data = await niveauwHttp.getAllNiveaux();
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

export const updateNiveau = createAsyncThunk(
    'niveaux/update',
    async ({id, data}: {id: number, data: any}, {rejectWithValue}) => {
        try {
            const response = await niveauwHttp.update(id, data);
            return response;
        } catch (error: any) {
            console.log('error on updating:', error.message);

            return rejectWithValue({
                status: error.response?.status ?? 500,
                message: error.response.data?.message ?? "Erreur lors du chargement..."
            })
        }
    }
)

export const deleteNiveau = createAsyncThunk(
    'niveaux/delete',
    async (id: number, {rejectWithValue}) => {
        try {
            const response = await niveauwHttp.delete(id);
            return response;
        } catch (error: any) {
            console.log('error on deleting:', error.message);

            return rejectWithValue({
                status: error.response?.status ?? 500,
                message: error.response.data?.message ?? "Erreur lors du chargement..."
            })
        }
    }
)

export const createNiveau = createAsyncThunk(
    'niveaux/create',
    async (data: any, {rejectWithValue}) => {
        try {
            const response = await niveauwHttp.create(data);
            return response;
        } catch (error: any) {
            console.log('error on creating:', error.message);

            return rejectWithValue({
                status: error.response?.status ?? 500,
                message: error.response.data?.message ?? "Erreur lors du chargement..."
            })
        }
    }
)