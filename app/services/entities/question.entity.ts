import Answer from "./answer.entity";

export default interface Question {
    id: number;
    text: string;
    choices: string[];
    correctAnswer: string;
    timeToAnswer: number;
    points: number;
    explanation?: string;
    answers: Answer[];
}