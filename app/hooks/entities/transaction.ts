export interface Transaction{
    id: number,
    type:
        | 'DEPOSIT'
        | 'WITHDRAWAL'
        | 'PURCHASE_PACK'
        | 'CREATE_COMPETITION'
        | 'COMPETITION_FEES'
        |'COMPETITION_FEES_RECEIVED'
    amount: number,
    created_at: any,
    PID: any,
    status: any,
    method: any,
    user?: any
} 