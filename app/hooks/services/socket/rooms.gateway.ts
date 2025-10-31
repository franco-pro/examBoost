import { Answer } from "../../entities/answer";
import { IncomingAnswer } from "../../entities/incoming-answer";
import { JoinRoomDto } from "../../entities/joinRoom.dto";
import { NewQuestionDto } from "../../entities/new-question.dto";
import { Question } from "../../entities/question";
import RoomClosedDto from "../../entities/room-closed.dto";
import { Room } from "../../entities/rooms.entity";
import { UserOnline } from "../../entities/user.online.entity";
import { setSocketWaiting } from "../../redux/rooms/rooms.slice";
import QuestionAnswerManager from "../rooms-services/question-answer";
import { connectRoomsSocket, getSocket } from "./socket.init";

export function initializeRoomsGateway(dispatch: any, room: Room) {
  const socket = connectRoomsSocket();

  const RoomsQuestionManager = new QuestionAnswerManager(dispatch, room);

  socket.on("connect", () => {
    console.log("Connected to rooms gateway with ID:", socket.id);
  });

  socket.on("room-joined", (RoomInfo: Room) => {
    RoomsQuestionManager.addRoom(RoomInfo);
    RoomsQuestionManager.addConnectedUsers(RoomInfo.roomId, RoomInfo.users);

  });

  socket.on("user-joined", (userInfo: UserOnline) => {

    RoomsQuestionManager.addConnectedUser(userInfo.roomId, userInfo);
  });

  socket.on("new-question", (data: NewQuestionDto) => {
    RoomsQuestionManager.addQuestion(data.roomId, data.question);
  });

  socket.on("n-question-answered", (answer: IncomingAnswer) => {
      RoomsQuestionManager.addAnswer(answer.roomId, answer.answer);
      RoomsQuestionManager.rangking(answer.roomId, answer.rangking);
  });

  socket.on("user-left", (data: {userID: number, totalUsers: number, roomId: number}) => {
    console.log('user left competition:', data);
      RoomsQuestionManager.removeConnectedUser(data.roomId.toString(), data.userID);
  })

  socket.on("competition-ended", (rangking: UserOnline[]) => {
    console.log('competition finished:', rangking);
    
  })

  socket.on("room-closed", (data: RoomClosedDto) => {
    console.log('room closed:', data.message);
    RoomsQuestionManager.closeRoom(data.roomId, data.message);
  })

  socket.on("error", (error: any) => {
    console.log("Socket error:", error.message);
    
  });


}



export function EmitEvent(dispatch: any, room: any){
    const socket = getSocket();
    const RoomsQuestionManager = new QuestionAnswerManager(dispatch, room);
    
    return {
        joinRoom: (data: JoinRoomDto) => {
            socket.emit("join", data);
        },
        sendQuestion: (question: Question) => {
          // setTimeout(() => {
          //   RoomsQuestionManager.addQuestion(room.id, question)
          // }, 50);
          socket.emit("competition-question", question);
        },
        sendAnswer: (answer: Answer) => {
          if(!room.isManagedByIA){
            setTimeout(() => {
              dispatch(setSocketWaiting(true));
            }, 50);
          }
            socket.emit("question-answered", answer);
            
        },
        createRoom: (roomName: string) => {
            socket.emit("createRoom", { roomName });
        },
        leaveCompetition: (userId: number)=>{
            socket.emit('leave-room')
            RoomsQuestionManager.removeConnectedUser(room.roomId, userId);
        },
        
        end: ()=>{
            socket.emit('end-competition')
        },

        ViewerLeave: ()=>{
          socket.emit('leave-room')
          RoomsQuestionManager.removeViewer(room.roomId);
      },
        closeCompetition: () => {
            socket.emit("close-Room");
            RoomsQuestionManager.quitRoom();
        }
    }
}
