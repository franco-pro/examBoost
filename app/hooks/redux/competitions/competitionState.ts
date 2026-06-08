import Competition from "../../services/competitions/competition.entity";
import { HomeBaseCompetition } from "../../services/competitions/competitionHome.entity";

export default interface CompetitionState {
    selectedCompetition: Competition | null;
    competitionList: Competition[];
    myCompetitionList: Competition[];
    searchResults: Competition[];
    pagination: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalItems: number;
    };
    loading: boolean;
    actionDone: boolean,
    error: any | null;
    homeBaseData: HomeBaseCompetition | null
}