import { Answer } from "./answer";

export interface IncomingAnswer{ 
    
    answer: Answer;
    roomId: string;
    userScrore: number;
    timestamp: number;
    clientId: number;
    rangking: {
        userID: number;
        score: number;
        totalTimeTaken: number;
    }[];
    usersScore: {
        id: number;
        userID: number;
        username: string;
        isWinner: boolean;
        score: number;
    }
}