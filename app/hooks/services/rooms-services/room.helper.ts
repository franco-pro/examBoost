import { UserOnline } from "../../entities/user.online.entity";

export default function Rangking(usersOnline: UserOnline[], rangkingByID: {userID: number, score: number, totalTimeTaken: number}[]) {
    const rankedUsers: UserOnline[] = [];

    rangkingByID.forEach((incomingRanking) => {
        const user = usersOnline.find((u) => u.userID === incomingRanking.userID);
        
        if (user) {
            user.totalTimeTaken = incomingRanking.totalTimeTaken;
            user.score = incomingRanking.score;
            rankedUsers.push(user);
        }
    });

    return rankedUsers;
}