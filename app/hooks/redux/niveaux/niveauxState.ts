import Niveau from "../../services/niveaux/niveau.entity";

export default interface NiveauxState {
    niveauxList: Niveau[],
    selectedNiveau: Niveau | null,
    error: string | null,
    loading: boolean
}