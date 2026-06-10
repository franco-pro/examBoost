import { queryKeys } from "@/app/lib/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfileHttp, ProfileDTO, updateProfileHttp } from "./api.http";
import { useDispatch } from "react-redux";
import { updateProfile, updateProfileImg } from "@/app/hooks/redux/users/users.slice";
import apiClient from "@/app/api/apiClient";
import { uploadImage } from "./handleImage";
import { UseDispatch } from "react-redux";
import { Alert } from "react-native";

export function useGetProfile(userID: string) {
  return useQuery({
    queryKey: userID ? queryKeys.profile(userID) : ["profile"],
    queryFn: async () => {
      const res = await fetchProfileHttp({ userID });
      return res;
    },
    enabled: !!userID,
  });
}

export function useUpdateProfileMutation(userID: string, data: any) {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async () => {
      const result = await updateProfileHttp({ userID, data });
      // console.log("res dans hook profil:", result);
      return result;
    },
    onSuccess: async (res: any, vars) => {
      await qc.invalidateQueries({
        queryKey: queryKeys.profile(userID),
      });
      // console.log("res dans profile: ", res);
      dispatch(updateProfile(res.data));
    },
  });
}

export function useUploadProfileMutation() {
  const qc = useQueryClient();
const dispatch = useDispatch()
  return useMutation({
    mutationFn: uploadImage,
    onSuccess: (res, vars) => {
      // console.log("res: ",res?.data)
      qc.invalidateQueries({ queryKey: queryKeys.user(vars.userID) });
      dispatch(updateProfileImg(res?.data.url));
    },
  });
}
