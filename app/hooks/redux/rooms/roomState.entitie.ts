import { Room } from "../../entities/rooms.entity";

export  interface RoomState {
    room: Room | null;
    roomLeaveed: string[];
    roomResult: Room | null;
    loading: boolean;
    socketWaiting: boolean;
    competitionFinished: boolean;
    competitionStop: boolean;
    timerOff: boolean;
    nextQuestion: boolean;
    message: string | null;
    error: string | null;
}
