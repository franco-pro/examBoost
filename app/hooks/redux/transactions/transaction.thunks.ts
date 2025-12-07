import { createAsyncThunk } from "@reduxjs/toolkit";
import TransactionsHttp from "../../services/transactions/transaction";

const transactionHttp = TransactionsHttp();

export const getAllTransations = createAsyncThunk(
    'competition/getTransactions',
    async (id: number, {rejectWithValue}) => {
        try {
            const data = await transactionHttp.getAllTransactions(id);
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