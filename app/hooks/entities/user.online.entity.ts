export interface UserOnline{
        id: number;
        userID: number;
        roomId: string;
        username: string;
        surname: string;
        imgUrl: string;
        score: number;
        isWinner: boolean;
        clientId: string;
        totalUsers: number;
        timestamp: number;

        totalTimeTaken: number;
}