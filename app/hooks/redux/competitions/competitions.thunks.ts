import { createAsyncThunk } from "@reduxjs/toolkit";
import Competition from "../../services/competitions/competition.entity";
import CompetitionHttp from "../../services/competitions/competitions";

const competitionHttp = CompetitionHttp();

export const  getCompetitionList = createAsyncThunk(
    'competition/getList',
    async (pagination: {page: number, limit: number}, {rejectWithValue}) => {
        try {
            // TODO : pagination and limit
            const data = await competitionHttp.getCompetitions(pagination.page, pagination.limit);
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

export const searchCompetitions = createAsyncThunk(
    'competition/search',
    async (param : {query: string, isAdmin: boolean}, {rejectWithValue}) => {
        try {
            const data = await competitionHttp.searchCompetition(param.query, param.isAdmin);
            return data;
        } catch (error: any) {
            console.log('error on searching:', error.message);

            return rejectWithValue({
                status: error.response?.status ?? 500,
                message: error.response.data?.message ?? "Erreur lors du chargement..."
            })
        }
    }
)

export const  getCompetitionListAdmin = createAsyncThunk(
    'competition/getListAdmin',
    async (pagination: {page: number, limit: number}, {rejectWithValue}) => {
        try {
            const data = await competitionHttp.getCompetitionAdmin(pagination.page, pagination.limit);
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

export const getHomeBase =  createAsyncThunk(
    'competition/getHome',
    async (id: number, {rejectWithValue}) => {
        try {
            const data = await competitionHttp.getHomeBase(id);
            return data;
        } catch (error: any) {
            return rejectWithValue({
                status: error.response?.status ?? 500,
                message: error.response.data?.message ?? "Erreur lors du chargement..."
            })
        }
    }
)

export const createCompetition = createAsyncThunk(
    'competition/create',
    async (payload: Competition, {rejectWithValue})=>{
        try {
            console.log('payload compertio', payload);

            const data = await competitionHttp.createCompetition(payload);
            console.log('response', data);

            return data;
        } catch (error: any) {
            console.log('error on creating:', error.message);

            return rejectWithValue({
                status: error.response?.status ?? 500,
                message: error.response.data?.message ?? "Erreur lors du chargement..."
            })
        }
    }
)

export const getOne = createAsyncThunk(
    'competition/getOne',
    async (id: number, {rejectWithValue})=>{
        try {
            const data = await competitionHttp.getOne(id);
            return data;
        } catch (error: any) {
            console.log('error on getting one:', error.message);

            return rejectWithValue({
                status: error.response?.status ?? 500,
                message: error.response.data?.message ?? "Erreur lors du chargement..."
            })
        }
    }
)

export const deleteOne = createAsyncThunk(
    'competition/delete',
    async (id: number, {rejectWithValue})=>{
        try {
            const data = await competitionHttp.delete(id);
            return data;
        } catch (error: any) {
            console.log('error on deleting one:', error.message);

            return rejectWithValue({
                status: error.response?.status ?? 500,
                message: error.response.data?.message ?? "Erreur lors du chargement..."
            })
        }
    }
)

export const update = createAsyncThunk(
    'competition/update',
    async (payload: Competition, {rejectWithValue})=>{
        try {
            const data = await competitionHttp.update(payload.id, payload);
            return data;
        } catch (error: any) {
            console.log('error on deleting one:', error.message);

            return rejectWithValue({
                status: error.response?.status ?? 500,
                message: error.response.data?.message ?? "Erreur lors du chargement..."
            })
        }
    }
)

export const getMyCompetitions = createAsyncThunk(
    'competition/getOwner',
    async (userId: number , {rejectWithValue})=>{
        try {
            const data = await competitionHttp.getMyCompetitio(userId);
            return data;
        } catch (error: any) {
            console.log('error on deleting one:', error.message);

            return rejectWithValue({
                status: error.response?.status ?? 500,
                message: error.response.data?.message ?? "Erreur lors du chargement..."
            })
        }
    }
)