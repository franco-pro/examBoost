import { Room } from "../../entities/rooms.entity";

export  interface RoomState {
    room: Room | null;
    loading: boolean;
    error: string | null;
}
