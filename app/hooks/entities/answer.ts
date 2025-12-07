export interface Answer {
    id: number;
    questionID: number;
    userID: number;
    username: string;  
    text: string;
    isCorrect: boolean;
    timeTaken: number 
  }