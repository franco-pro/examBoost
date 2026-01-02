import { Transaction } from "../../entities/transaction";

export interface TransactionState{
    transactionList: Transaction[],
    error: string | null,
    loading: boolean 
}