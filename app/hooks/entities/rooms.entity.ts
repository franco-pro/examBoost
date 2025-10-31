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
    createdAt: any;
    isActive: boolean;
    totalTimes: number | null;
    finalHour: Date | null;
    instructions: {participant: string, owner: string, viewer: string} | null;
    creatorInfo: {username: string, surname: string, imgUrl: string};
    competitionInfo: {winnerPrice: number, maxUsers: number, questionsNbr: number},
    oldParticipantsID: number[]
  }
  