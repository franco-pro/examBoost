import { UserOnline } from "./user.online.entity";

export interface Room {
    id: string;
    name: string;
    topic: string;
    competitionID: number;
    creatorID: number;
    users: UserOnline[];
    viewers: any;
    isManagedByIA: boolean;
    createdAt: Date;
    isActive: boolean;
  }
  