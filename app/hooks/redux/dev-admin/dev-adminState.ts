

export default interface DevAdminState {
        loading: boolean;
        error: any | null;
        competitions: {
            total: number;
            upcoming: number;
            ongoing: number;
            past: number;
            canceled: number;
            amountGenerated: number;
        };
        totalUsers: {
            total: number;
            active: number;
            inactive: number;
        };
        documents: {
            toApprove: number;
            approved: number;
            rejected: number;
            total: number;
        };
        accountWallet: {
            totalBalance: number;
            competition: number;
            packs: number;
            userWithdrawals: number;
            netBalance: number;
        }
}