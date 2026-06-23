import { Document } from "../../entities/document";


export interface DocumentState {
    loading: boolean;
    error: any | null;
    documentsList: Document[];
    isSendingSuspended: boolean;
}