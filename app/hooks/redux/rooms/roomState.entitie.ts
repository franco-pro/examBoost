import { RoomCreatedDto } from "../../entities/roomCreated.dto";

export  interface RoomState {
    room: RoomCreatedDto | null;
    loading: boolean;
    error: string | null;
}
