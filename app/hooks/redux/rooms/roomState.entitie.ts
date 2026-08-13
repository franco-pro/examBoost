import { Room } from "../../entities/rooms.entity";

export  interface RoomState {
    room: Room | null;
    roomLeaveed: string[];
    roomResult: Room | null;
    loading: boolean;
    socketWaiting: boolean;
    waitingAnswerConfirmation: boolean;
    waitingLaunching: boolean;
    errorType: "USER_HAS_LEAVED_ROOM" | null,
    waitingJoining: boolean,
    competitionFinished: boolean;
    competitionStop: boolean;
    timerOff: boolean;
    nextQuestion: boolean;
    message: string | null;
    error: string | null;
}
