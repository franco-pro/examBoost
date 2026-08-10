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
        role: "participant" | "owner" | "spectator";
        totalUsers: number;
        timestamp: number;
        isConnected: boolean;
        totalTimeTaken: number;
}

export default function UserOnlineEntityRoute() {
        return null;
}