import { Answer } from "../../entities/answer";
import { Question } from "../../entities/question";
import { UserOnline } from "../../entities/user.online.entity";
import Rangking from "./room.helper";

interface RoomData {
    questions: Question[];
    user: {userID: number, score: number, totalTimeTaken: number}[],
    connectedUsers: UserOnline[],
    viewers: number,
    statut: "ACTIF"|"INACTIF",
    createdAt: Date;
  }
export default class QuestionAnswerManager{
    private rooms = new Map<string, RoomData>();
    private static instance: QuestionAnswerManager;
    private current_roomID: string | null = null;

    // Singleton rooms instance
    constructor() {
        if (!QuestionAnswerManager.instance) {
            QuestionAnswerManager.instance = this;
        }
        return QuestionAnswerManager.instance;
    }

    getInstance(): QuestionAnswerManager {
        return QuestionAnswerManager.instance;
    }
    
    addRoom(roomId: string, questions: Question[]){
        this.current_roomID = roomId;

        if(!this.rooms.has(roomId)){
            this.rooms.set(roomId, {questions, user: [], connectedUsers: [],viewers: 0, statut: "ACTIF", createdAt: new Date()});
        }
    }

    quitRoom(){
        this.current_roomID = null;
    }

    getCurrentRoomID(): string | null{
        return this.current_roomID;
    }

    addConnectedUsers(roomId: string, user: UserOnline[]){
        const room = this.rooms.get(roomId);
        if(room){
            room.connectedUsers.push(...user);
        }
    }


    addConnectedUser(roomId: string, user: UserOnline){
        const room = this.rooms.get(roomId);
        if(room){
            room.connectedUsers.push(user);
        }
    }

    removeConnectedUser(roomId: string, userId: number){
        const room = this.rooms.get(roomId);
        if(room){
            room.connectedUsers = room.connectedUsers.filter(u => u.id !== userId);
        }
    }

    addViewer(roomId: string){
        const room = this.rooms.get(roomId);
        if(room){
            room.viewers += 1;
        }
    }
    removeViewer(roomId: string){
        const room = this.rooms.get(roomId);
        if(room && room.viewers > 0){
            room.viewers -= 1;
        }
    }


    getRoom(roomId: string): RoomData | undefined{
        return this.rooms.get(roomId);
    }
    removeRoom(roomId: string){
        this.rooms.delete(roomId);
    }
    // addUserScore(roomId: string, userID: number, score: number, totalTimeTaken: number){
    //     const room = this.rooms.get(roomId);
    //     if(room){
    //         const existingUser = room.user.find(u => u.userID === userID);
    //         if(existingUser){
    //             existingUser.score += score;
    //             existingUser.totalTimeTaken += totalTimeTaken;
    //         }else{
    //             room.user.push({userID, score, totalTimeTaken});
    //         }
    //     }
    // }

    rangking(roomId: string, rangkingWithIDs: {userID: number, score: number, totalTimeTaken: number}[]){
        const room = this.rooms.get(roomId);
        if(room){
            const new_rangking = Rangking(room.connectedUsers, rangkingWithIDs);
            room.connectedUsers = new_rangking;
        }
    }
    getUserScores(roomId: string){
        const room = this.rooms.get(roomId);
        if(room){
            return room.connectedUsers
        }
        return [];
    }

    clear(){
        this.rooms.clear();
    }

    addQuestion(roomId: string, question: Question){
        const room = this.rooms.get(roomId);
        if(room){
            room.questions.push(question);
        }
    }

    addAnswer(roomId: string, answer: Answer){
        const room = this.rooms.get(roomId);
        if (!room) return;
    
        const question = room.questions.find(question => question.id === answer.questionID);
        if (!question) return;
    
        question.answers.push(answer);
    }

    getOneQuestion(roomId: string, questionId: number): Question | undefined {
        const room = this.rooms.get(roomId);
        if (!room) return undefined;
        
        const index = room.questions.findIndex(q => q.id === questionId);
        if(index === -1) return undefined;

        return room.questions.find(question => question.id === questionId);
    
    }
}