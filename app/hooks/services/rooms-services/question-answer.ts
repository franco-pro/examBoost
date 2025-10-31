import { Answer } from "../../entities/answer";
import { Question } from "../../entities/question";
import { Room } from "../../entities/rooms.entity";
import { UserOnline } from "../../entities/user.online.entity";
import { addAnswer, addConnectedUsers, addConnetedUser, addQuestion, addViewerr, clearRoom, passToNextQuestion, rangking, removeViewer, setEndOfCompetition, setRomm, setRoomQuestion, setSocketWaiting, setUserDeconnected, userLeaveRoom } from "../../redux/rooms/rooms.slice";
import Rangking from "./room.helper";

// interface RoomData {
//     questions: Question[];
//     user: {userID: number, score: number, totalTimeTaken: number}[],
//     connectedUsers: UserOnline[],
//     viewers: number,
//     statut: "ACTIF"|"INACTIF",
//     createdAt: Date;
//   }
export default class QuestionAnswerManager{
    // private rooms = new Map<string, RoomData>();
    private static instance: QuestionAnswerManager;
    private current_roomID: string | null = null;
    private dispatch : any;
    private room: Room | null = null;

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
        
        // if(!this.rooms.has(room.roomId)){
        //     this.rooms.set(room.roomId, {
        //         questions: [...room.questions],    
        //         user: [],
        //         connectedUsers: [...room.users],       
        //         viewers: room.viewers,
        //         statut: "ACTIF",
        //         createdAt: new Date(room.createdAt),
        //       });
        // }
        this.room = structuredClone(room);
        this.dispatch(setRomm(room));

        if(room.isManagedByIA){
            this.dispatch(setRoomQuestion(room.questions));
        }
    }

    quitRoom(){
        this.current_roomID = null;
        this.dispatch(userLeaveRoom())
    }

    getCurrentRoomID(): string | null{
        return this.current_roomID;
    }

    addConnectedUsers(roomId: string, users: UserOnline[]){
        // let local_room = this.rooms.get(roomId);
        
        // if(local_room){
        //     local_room.connectedUsers = users;
        // }
        if(this.room && this.room.roomId === roomId){
            this.dispatch(addConnectedUsers(users))
        }
        
    }

    closeRoom(roomId: string, message: string){
        // let room = this.rooms.get(roomId)
        // if(room){
        //     room.statut = "INACTIF"
        // }
        this.room = null;
        this.dispatch(clearRoom(message))
    }

    competitionEnded(){
        this.current_roomID = null;
        this.room = null;
        this.dispatch(setEndOfCompetition());
    }

    addConnectedUser(roomId: string, user: UserOnline){
        // let local_room = this.rooms.get(roomId);
        // let isCurrentUser = false;

        // if(local_room){
        //     //check if user already exists
        //     for(let existingUser of local_room?.connectedUsers){
        //         if(existingUser.userID === user.userID){
        //             isCurrentUser = true;
        //             break;
        //         }
        //     }
        //     if(!isCurrentUser){

        //         local_room.connectedUsers ? [...local_room.connectedUsers].push({...user}) : [...local_room.connectedUsers];

        //     }
        // }


        if(this.room && this.room.roomId === roomId)
        {
            this.dispatch(addConnetedUser(user))
        }
    }

    removeConnectedUser(roomId: string, userId: number){
        // const local_room = this.rooms.get(roomId);

        // if(local_room){
        //     // room.connectedUsers = room.connectedUsers.filter(u => u.id !== userId);
        //     local_room.connectedUsers.findIndex((user)=>{
        //         user.id === userId ? (user.isConnected = false) : null;
        //     })
        // }
        if (this.room) {
            this.room = {
              ...this.room,
              users: this.room.users.map(user =>
                user.userID === userId
                  ? { ...user, isConnected: false }
                  : user
              ),
            };
          }
          
        if(this.room && this.room.roomId === roomId){
            this.dispatch(setUserDeconnected(userId));
        }
        
    }

    addViewer(roomId: string){
        // const local_room = this.rooms.get(roomId);

        // if(local_room){
        //     local_room.viewers += 1;
        // }
        if(this.room && this.room.roomId === roomId){
            this.dispatch(addViewerr());
        }
    }
    removeViewer(roomId: string){
        // const local_room = this.rooms.get(roomId);

        // if(local_room && local_room.viewers > 0){
        //     local_room.viewers -= 1;
        // }
        
        if(this.room){
            if(this.room.viewers > 0){
                this.room.viewers -= 1;
            }
        }
        if(this.room && this.room.roomId === roomId){
            this.dispatch(removeViewer());
        }
    }


    getRoom(roomId: string): Room | null{
        return this.room;
    }
    removeRoom(roomId: string){
        // this.rooms.delete(roomId);
        this.room = null
        this.dispatch(userLeaveRoom());
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
        // const local_room = this.rooms.get(roomId);
        let new_rangkingCopy : UserOnline[] = [];
         
        if(this.room){
            const new_rangking = Rangking(this.room.users, rangkingWithIDs);
            new_rangkingCopy = new_rangking;
            this.room.rangking = new_rangking;
        }

        

        if(this.room && this.room.roomId === roomId){
            this.dispatch(rangking(new_rangkingCopy));
        }
    }
    getUserScores(roomId: string){
        // const local_room = this.rooms.get(roomId);
        if(this.room){
            return this.room.rangking;
        }
        return [];
    }

    clear(){
        this.current_roomID = null;
        this.room = null;
    }

    addQuestion(roomId: string, question: Question){
        // const local_room = this.rooms.get(roomId);

        // if(this.room){
        //     this.room.questions.push(question);
        // }
        if(this.room){
            this.room = {
                ...this.room,
                questions: [...(this.room.questions || []), {...question}]
            };
        }        
        
        if(this.room && this.room.roomId == roomId){
            this.dispatch(addQuestion(question));
            this.dispatch(setSocketWaiting(false));
        }
    }

    addAnswer(roomId: string, answer: Answer){
        // const local_room = this.rooms.get(roomId);

    
        // const question = local_room ? local_room.questions.find(question => question.id === answer.questionID): null;
        // if (question) {
        //     question.answers.push({...answer});

        //      question.answers ? [...question.answers].push({...answer}) : [...question.answers];
        // };

        if(this.room){
            //find question index

            let questionIndex = 0;
            if(answer && answer.questionID){
                const index = this.room.questions.findIndex(question => question.id === answer.questionID);
                questionIndex = index;
                console.log('current question', this.room);

                if(index !== -1){
                    if(this.room && this.room.questions[index]) {
                        const currentQuestion = this.room.questions[index];
                        
                        this.room.questions[index] = {
                            ...currentQuestion,
                            answers: [
                                ...(currentQuestion.answers || []), // S'assurer que answers existe
                                {...answer}
                            ]
                        };
                    }
                 }
                
             }
                
                if(this.room && this.room.roomId == roomId){
                    this.dispatch(addAnswer(this.room.questions[questionIndex].answers[ this.room.questions[questionIndex].answers.length -1]));
                    if(!this.room.isManagedByIA){
                        this.dispatch(setSocketWaiting(true));
                    }else{
                        this.dispatch(passToNextQuestion())
                    }
                    // this.dispatch(reduiceQuestionNbr())
                }
        }

            
    }

    getOneQuestion(roomId: string, questionId: number): Question | undefined {
        // const room = this.rooms.get(roomId);
        // if (!room) return undefined;
        
        const index = this.room ? this.room.questions.findIndex(q => q.id === questionId): undefined;
        if(index === -1) return undefined;

        return this.room ? this.room.questions.find(question => question.id === questionId): undefined;
    
    }
}