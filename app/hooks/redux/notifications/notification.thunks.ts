import { createAsyncThunk } from "@reduxjs/toolkit";
import NotificationHttp from "./notification.http";


const Notification = NotificationHttp();

export const loadAllNotification = createAsyncThunk(
    'notification/loadAll',
    async (_, {rejectWithValue}) => {
        try {
            const data = await Notification.loadAllNotification();
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

export const getNotification = createAsyncThunk(
    'notification/getList',
    async (userId: number, {rejectWithValue}) => {
        try {
            const data = await Notification.getNotifications(userId);
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

export const setAsRead = createAsyncThunk(
    'notification/setAsRead',
    async (notificationId: number, {rejectWithValue}) => {
        try {
            const data = await Notification.markAsRead(notificationId);
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

export const deleteNotification = createAsyncThunk(
    'notification/delete',
    async (notificationId: number, {rejectWithValue}) => {
        try {
            const data = await Notification.deleteNotification(notificationId);
            return data;
        } catch (error: any) {
            console.log('error on deleting:', error.message);

            return rejectWithValue({
                status: error.response?.status ?? 500,
                message: error.response.data?.message ?? "Erreur lors du chargement..."
            })
        }
    }
)

export const deleteAllNotifications = createAsyncThunk(
    'notification/deleteAll',
    async (userId: number, {rejectWithValue}) => {
        try {
            const data = await Notification.deleteAll(userId);
            return data;
        } catch (error: any) {
            console.log('error on deleting all:', error.message);

            return rejectWithValue({
                status: error.response?.status ?? 500,
                message: error.response.data?.message ?? "Erreur lors du chargement..."
            })
        }
    }
)