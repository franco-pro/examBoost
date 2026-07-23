export interface Document {
  id: number;
  name: string;
  format: string;
  url: string;
  subject: string;
  isValidated: boolean;
  type: DocType;
  correctionId?: number;
  user?: {
    id: number;
    username: string;
    surname: string;
    imgUrl: string|null;
    wallet: number
  }
  niveauID: number;
  created_at: Date;
  updated_at: Date;
}


export type DocType =
| "CONTROLE CONTINU"
| "EXAMEN SEMESTRE"
| "TD"
| "EXAMEN"
| "EXAMEN BLANC"
| "EVALUATION"
| "CORRECTION";