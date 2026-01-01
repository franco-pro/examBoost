export default interface Competition{
    id: number;
    name: string;
    description: string;
    topic: string;
    date: string; // ISO string
    registration_deadline: string; // ISO string
    entryFee: number;
    winnerPrice: number;
    isPublic: boolean;
    isManagedByIA: boolean;
    statut: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
    maxUsers: number;
    minUsers: number;
    questionsNbr: number
    roomID: string;
    type:
      "PAID_REGISTRATION_AS_WINNER_PRICE"
      | "FREE_REGISTRATION_WITH_WINNER_PRICE"
      | "PAID_REGISTRATION_WITH_WINNER_PRICE"
      | "TOTAL_FREE_NO_PRICE_TO_WIN";
    creatorID: number;
    language: 'ANGLAIS' | 'FRANCAIS';
    creatorData: {
      id: number;
      surname: string;
      username: string;
      email: string;
      phone: string;
    };
    created_at: string; // ISO string
    updated_at: string; // ISO string
    suscribers: {
      id: number;
      name: string;
    }[];
  }