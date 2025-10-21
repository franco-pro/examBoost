export default interface RoomClosedDto{
    roomId: string;
    roomName: string;
    closedBy: string | null;
    creatorID: number | null;
    message: string;
    timestamp: Date,
}