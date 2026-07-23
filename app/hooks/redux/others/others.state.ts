import { Others } from "../../services/others/others.entitie";

export interface OthersState {
    othersList: Others[];
    loading: boolean;
    selectedOther: Others| null;
    error: string | null
}