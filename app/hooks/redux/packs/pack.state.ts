import { Pack } from "@/app/dev-admin/pages/packs-niveaux/pack.entity";

export interface PackState{
    loading: boolean;
    error: any | null;
    packs: Pack[];
}