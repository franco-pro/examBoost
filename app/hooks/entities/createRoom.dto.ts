export interface CreateRoomDto {
    readonly name: string;

    readonly topic: string;
    
    readonly userID: number;

    readonly competitionID: number;

    readonly isManagedByIA: boolean;
}