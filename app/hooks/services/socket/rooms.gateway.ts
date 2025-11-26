import { Answer } from "../../entities/answer";
import { CompetitionStartEnd } from "../../entities/competitionStartEnd";
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

export function initializeRoomsGateway(dispatch: any, room: Room, userID: number) {
  const socket = connectRoomsSocket();
  
  const RoomsQuestionManager = new QuestionAnswerManager(dispatch, room);
  
  socket.off("room-joined");
  socket.off("user-joined");
  socket.off("new-question");
  socket.off("user-left");
  socket.off("error");
  socket.off("competition-ended");
  socket.off("room-closed");
  socket.off("n-question-answered");
  socket.off("spectator-room-joined");
  socket.off("spectator-joined");
  socket.off("competition-started");
  socket.off("spectator-leaved");


  socket.on("connect", () => {
    console.log("Connected to rooms gateway with ID:", socket.id);
  });

  socket.on("room-joined", (RoomInfo: Room) => {
    RoomsQuestionManager.addRoom(RoomInfo, userID);
    RoomsQuestionManager.addConnectedUsers(RoomInfo.roomId, RoomInfo.users);

  });

  socket.on("user-joined", (userInfo: UserOnline) => {

    RoomsQuestionManager.addConnectedUser(userInfo.roomId, userInfo);
  });

  socket.on("spectator-joined", (data: {roomId: string, totalSpectator: number, userID: number}) => {
    if(userID != data.userID){
        RoomsQuestionManager.addViewer(data.roomId);
    }
  })

  socket.on("spectator-room-joined", (data: Room) => {
    RoomsQuestionManager.addRoom(data, userID);
    RoomsQuestionManager.addConnectedUsers(data.roomId, data.users);
  })

  socket.on("new-question", (data: NewQuestionDto) => {
    console.log('question received', data);
    RoomsQuestionManager.addQuestion(data.roomId, data.question);
  });

  socket.on("n-question-answered", (answer: IncomingAnswer) => {
      RoomsQuestionManager.addAnswer(answer.roomId, answer.answer);
      RoomsQuestionManager.rangking(answer.roomId, answer.rangking);
  });

  socket.on("user-left", (data: {userID: number, totalUsers: number, roomId: number}) => {
      RoomsQuestionManager.removeConnectedUser(data.roomId.toString(), data.userID);
  })

  socket.on("spectator-leaved", (data: {spectatot: number, roomId: string}) => {
      RoomsQuestionManager.removeViewer(data.roomId);
  })


  socket.on("competition-ended", (data: CompetitionStartEnd) => {
    console.log('competition finished:', data);
    RoomsQuestionManager.competitionEnded(data.competitionID, data.statut);
  })

  socket.on("competition-started", (data: CompetitionStartEnd) => {
    console.log('competition started:', data);
    RoomsQuestionManager.competitionStart(data.competitionID, data.statut);
  })

  socket.on("room-closed", (data: RoomClosedDto) => {
    console.log('room closed:', data.message);
    RoomsQuestionManager.closeRoom(data.competitionID, data.message);
  })

  socket.on("error", (error: any) => {
    console.log("Socket error:", error.message);
    
  });

  socket.onAny((event, ...args) => {
    console.log(">>> ANY EVENT RECU:", event, args);
  });

}

export function EmitEvent(dispatch: any, room: any){
    const socket = getSocket();
    const RoomsQuestionManager = new QuestionAnswerManager(dispatch, room);
    
    return {
        joinRoom: (data: JoinRoomDto) => {
            socket.emit("join", data);
        },
        
        joinAsSpectator(data: {userId: number, username: string}){
            socket.emit('spectator-room-joined', {userId: data.userId, username: data.username, roomId: room.roomId})  
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

        setLocalCompetitionEnded: ()=>{
          RoomsQuestionManager.competitionEnded();
        },

        ViewerLeave: ()=>{
          socket.emit('leave-as-spectator')
          RoomsQuestionManager.removeViewer(room.roomId);
        },

        localRoomClear: ()=>{
          RoomsQuestionManager.clear()
        },
        closeCompetition: () => {
            socket.emit("close-Room");
            RoomsQuestionManager.quitRoom();
        }
    }
}
