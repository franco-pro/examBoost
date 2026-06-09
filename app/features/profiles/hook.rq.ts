import { queryKeys } from "@/app/lib/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfileHttp, ProfileDTO, updateProfileHttp } from "./api.http";
import { useDispatch } from "react-redux";
import { updateProfile } from "@/app/hooks/redux/users/users.slice";

export function useGetProfile(userID: string) {
    return useQuery({
        queryKey: userID ? queryKeys.profile(userID) : ['profile'],
        queryFn: async () => {
            const res = await fetchProfileHttp({ userID })
            return res
        },
        enabled: !!userID
    })
}

export function useUpdateProfileMutation(userID: string) {
    const qc = useQueryClient()
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: async (data:ProfileDTO) => {
            const result = await updateProfileHttp({ userID, data })
            return result
        },
        onSuccess: async (_, vars) => {
            await qc.invalidateQueries({
                queryKey: queryKeys.profile(userID)
            })

            dispatch(updateProfile(updateProfile))
        }
    })
}