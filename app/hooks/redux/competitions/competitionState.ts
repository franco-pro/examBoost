import Competition from "../../services/competitions/competition.entity";

export default interface CompetitionState {
    selectedCompetition: Competition | null;
    competitionList: Competition[];
    myCompetitionList: Competition[];
    loading: boolean;
    actionDone: boolean,
    error: any | null;
}