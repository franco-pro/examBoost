import { Question } from "./question";

export interface RoomCreatedDto{
    roomId: string;
    message: string;
    success: boolean;
    creatorID: number;
    question: Question[];
}