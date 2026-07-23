import { createAsyncThunk } from "@reduxjs/toolkit";
import DocumentHttp from "../../services/document/document.http";



const docHttp = DocumentHttp();

export const getAllDocs = createAsyncThunk(
    'documents/getAll',
    async (_, {rejectWithValue}) => {
        try {
            const data = await docHttp.getDocs();
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

export const updateDoc = createAsyncThunk(
    'documents/update',
    async ({id, data}: {id: number, data: any}, {rejectWithValue}) => {
        try {
            const response = await docHttp.updateDoc(id, data);
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

export const deleteDoc = createAsyncThunk(
    'documents/delete',
    async (id: number, {rejectWithValue}) => {
        try {
            const response = await docHttp.delete(id);
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