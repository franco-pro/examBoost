export interface Pack{
    id: number;
    name:        string,
    price:       number,
    description: string,
    duration:    number,
    categorie:   "SUP"|"SECONDARY",
    type:   "CONTROLE CONTINU" 
    | "EXAMEN SEMESTRE"    
    | "TD"
    | "EXAMEN" 
    | "EXAMEN BLANC" 
    | "EVALUATION",
    durationDays: number,
    isActive:    boolean,
}