import { UserOnline } from "../../entities/user.online.entity";

export default function Rangking(usersOnline: UserOnline[], rangkingByID: {userID: number, score: number, totalTimeTaken: number}[]) {
    let rankedUsers: UserOnline[] = [];

    rangkingByID.forEach((incomingRanking) => {
        let user = usersOnline.find((u) => u.userID === incomingRanking.userID);
        
        if (user) {
            user = {
                ...user,
                score: incomingRanking.score,
                totalTimeTaken: incomingRanking.totalTimeTaken
            }
            rankedUsers.push(user);
        }
    });

    if(rankedUsers.length != 0){
      rankedUsers[0].isWinner = true;
    }
    return rankedUsers;
}