export default interface RoomClosedDto{
    roomId: string;
    roomName: string;
    competitionID: number,
    closedBy: string | null;
    creatorID: number | null;
    message: string;
    timestamp: Date,
}