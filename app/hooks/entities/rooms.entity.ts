import { Question } from "./question";
import { UserOnline } from "./user.online.entity";

export interface Room {
    roomId: string;
    roomName: string;
    roomTopic: string;
    competitionID: number;
    creatorID: number;
    users: UserOnline[];
    viewers: any;
    questions: Question[];
    rangking: UserOnline[];
    isManagedByIA: boolean;
    createdAt: Date;
    isActive: boolean;
    creatorInfo: {username: string, surname: string, imgUrl: string};
    competitionInfo: {winnerPrice: number, maxUsers: number}
  }
  