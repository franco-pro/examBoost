import { Answer } from "../../entities/answer";
import { IncomingAnswer } from "../../entities/incoming-answer";
import { JoinRoomDto } from "../../entities/joinRoom.dto";
import { NewQuestionDto } from "../../entities/new-question.dto";
import { Question } from "../../entities/question";
import { RoomJoined } from "../../entities/roomJoined.dto";
import { UserOnline } from "../../entities/user.online.entity";
import QuestionAnswerManager from "../rooms-services/question-answer";
import { connectRoomsSocket, getSocket } from "./socket.init";

export function initializeRoomsGateway(token?: string) {
  const socket = connectRoomsSocket(token);

  const RoomsQuestionManager = new QuestionAnswerManager();

  socket.on("connect", () => {
    console.log("Connected to rooms gateway with ID:", socket.id);
  });

  socket.on("room-joined", (RoomInfo: RoomJoined) => {
    console.error("room joined, info:", RoomInfo);
    RoomsQuestionManager.addRoom(RoomInfo.roomId, RoomInfo.question);
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


  return socket;
}



export function EmitEvent(){
    const socket = getSocket();

    return {
        joinRoom: (data: JoinRoomDto) => {
            socket.emit("join", data);
        },
        sendQuestion: (question: Question) => {
            socket.emit("competition-question", question);
        },
        sendAnswer: (answer: Answer) => {
            socket.emit("question-answered", answer);
        },
        createRoom: (roomName: string) => {
            socket.emit("createRoom", { roomName });
        },
        closeRoom: (roomId: string) => {
            socket.emit("closeRoom", { roomId });
        }
    }
}
