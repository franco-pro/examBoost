import { Answer } from "../../entities/answer";
import { Question } from "../../entities/question";
import { Room } from "../../entities/rooms.entity";
import { UserOnline } from "../../entities/user.online.entity";
import { addAnswer, addConnectedUsers, addConnetedUser, addQuestion, addViewerr, clearRoom, rangking, removeViewer, setRomm, setUserDeconnected } from "../../redux/rooms/rooms.slice";
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
    private dispatch : any;
    private room: any;

    // Singleton rooms instance
    constructor(dispatch: any, room: Room) {
        this.dispatch = dispatch;
        this.room = room;
        if (!QuestionAnswerManager.instance) {
            QuestionAnswerManager.instance = this;
        }
        return QuestionAnswerManager.instance;
    }

    getInstance(): QuestionAnswerManager {
        return QuestionAnswerManager.instance;
    }
    
    addRoom(room: Room){
        this.current_roomID = room.roomId;
        
        if(!this.rooms.has(room.roomId)){
            this.rooms.set(room.roomId, structuredClone({questions: room.questions, user: [], connectedUsers: room.users, viewers: room.viewers, statut: "ACTIF", createdAt: room.createdAt}));
        }

        this.dispatch(setRomm(room))
    }

    quitRoom(){
        this.current_roomID = null;
        this.dispatch(clearRoom())
    }

    getCurrentRoomID(): string | null{
        return this.current_roomID;
    }

    addConnectedUsers(roomId: string, users: UserOnline[]){
        const local_room = this.rooms.get(roomId);
        
        console.log('user', users);

        if(local_room){
            local_room.connectedUsers.push(...users);
        }
        if(this.room && this.room.roomId === roomId){
            this.dispatch(addConnectedUsers(users))
        }
        
    }

    closeRoom(roomId: string){
        const room = this.rooms.get(roomId)
        if(room){
            room.statut = "INACTIF"
        }
        this.dispatch(clearRoom())
    }

    addConnectedUser(roomId: string, user: UserOnline){
        const local_room = this.rooms.get(roomId);

        user.isConnected = true;
        if(local_room){
            local_room.connectedUsers.push(user);
        }

        if(this.room && this.room.roomId === roomId)
        {
            this.dispatch(addConnetedUser(user))
        }
    }

    removeConnectedUser(roomId: string, userId: number){
        const local_room = this.rooms.get(roomId);

        if(local_room){
            // room.connectedUsers = room.connectedUsers.filter(u => u.id !== userId);
            local_room.connectedUsers.findIndex((user)=>{
                user.id === userId ? (user.isConnected = false) : null;
            })
        }
        if(this.room && this.room.roomId === roomId){
            this.dispatch(setUserDeconnected(userId));
        }
        
    }

    addViewer(roomId: string){
        const local_room = this.rooms.get(roomId);

        if(local_room){
            local_room.viewers += 1;
        }
        if(this.room && this.room.roomId === roomId){
            this.dispatch(addViewerr());
        }
    }
    removeViewer(roomId: string){
        const local_room = this.rooms.get(roomId);

        if(local_room && local_room.viewers > 0){
            local_room.viewers -= 1;
        }

        if(this.room && this.room.roomId === roomId){
            this.dispatch(removeViewer());
        }
    }


    getRoom(roomId: string): RoomData | undefined{
        return this.rooms.get(roomId);
    }
    removeRoom(roomId: string){
        this.rooms.delete(roomId);
        this.dispatch(clearRoom());
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
        const local_room = this.rooms.get(roomId);
        let new_rangkingCopy : UserOnline[] = [];
         
        if(local_room){
            const new_rangking = Rangking(local_room.connectedUsers, rangkingWithIDs);
            new_rangkingCopy = new_rangking;
            local_room.connectedUsers = new_rangking;
        }

        if(this.room && this.room.roomId === roomId){
            this.dispatch(rangking(new_rangkingCopy));
        }
    }
    getUserScores(roomId: string){
        const local_room = this.rooms.get(roomId);
        if(local_room){
            return local_room.connectedUsers
        }
        return [];
    }

    clear(){
        this.rooms.clear();
    }

    addQuestion(roomId: string, question: Question){
        const local_room = this.rooms.get(roomId);

        if(local_room){
            local_room.questions.push(question);
        }

        if(this.room && this.room.roomId == roomId){
            this.dispatch(addQuestion(question));
        }
    }

    addAnswer(roomId: string, answer: Answer){
        const local_room = this.rooms.get(roomId);

    
        const question = local_room ? local_room.questions.find(question => question.id === answer.questionID): null;
        if (question) {
            question.answers.push(answer);
        };
        
        if(this.room && this.room.roomId == roomId){
            this.dispatch(addAnswer(answer))
        }
    }

    getOneQuestion(roomId: string, questionId: number): Question | undefined {
        const room = this.rooms.get(roomId);
        if (!room) return undefined;
        
        const index = room.questions.findIndex(q => q.id === questionId);
        if(index === -1) return undefined;

        return room.questions.find(question => question.id === questionId);
    
    }
}