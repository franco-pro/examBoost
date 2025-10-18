import { Question } from "./question";
import { UserOnline } from "./user.online.entity";

export interface RoomJoined{
    roomId: string;
    roomName: string;
    roomTopic: string;
    isManagedByIA: boolean;
    competitionID: number;
    question : Question[];
    creatorID: number;
    users: UserOnline[];
    
    }
