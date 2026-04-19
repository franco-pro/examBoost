export enum Category {
    SECOND = "SECONDARY",
    SUP="SUP"
}

export default interface Niveau {
    id: number;
    name: string;
    categorie: Category;
    isExamClass: boolean;
    created_at: string;
    updated_at: string;
}