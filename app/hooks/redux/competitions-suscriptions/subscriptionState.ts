import Competition from "../../services/competitions/competition.entity";

export default interface SubscriptionState {
    mySubscriptionList: Competition[];
    loading: boolean;
    actionDone: boolean;
    error: string | null;
    selectedSubscription: Competition | null;
}