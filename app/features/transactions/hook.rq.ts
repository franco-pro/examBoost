import { queryKeys } from "@/app/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getAllTransactionsByUser } from "./api.http";

export function useGetTransactionsByUuser(userID:number) {
    return useQuery({
      queryKey: userID ? queryKeys.transaction(userID) : ["transaction"],
      queryFn: async () => {
        const res = await getAllTransactionsByUser(userID);
        return res;
      },
      enabled: !!userID,
    });
}