import { Question } from "./question";

export interface NewQuestionDto{
    roomId: string;
    username: string;
    question: Question;
    timestamp: number;
    clientId: number;
}