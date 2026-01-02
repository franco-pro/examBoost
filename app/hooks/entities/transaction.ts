export interface Transaction{
    id: number,
    type:
    | 'DEPOSIT'
    | 'WITHDRAWAL'
    | 'PURCHASE_PACK'
    | 'CREATE_COMPETITION'
    | 'COMPETITION_FEES',
    amount: number,
    created_at: any,
    PID: any
} 