import { queryKeys } from "@/app/lib/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfileHttp, ProfileDTO, updateProfileHttp } from "./api.http";
import { useDispatch } from "react-redux";
import { logout, updateProfile, updateProfileImg } from "@/app/hooks/redux/users/users.slice";
import apiClient from "@/app/api/apiClient";
import { uploadImage } from "./handleImage";
import { UseDispatch } from "react-redux";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { removeItem } from "@/app/utils/asyncStorage";

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

export function useUpdateProfileMutation(userID: string) {
  const qc = useQueryClient();
  const dispatch = useDispatch();
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: any) => {
      const result = await updateProfileHttp({ userID, data });
      // console.log("res dans hook profil:", result);
      return result;
    },
    onSuccess: async (res: any, vars) => {
      if (vars.levelChanged) {
        Alert.alert(
          "Niveau modifié",
          "Votre niveau a été mis à jour. Veuillez vous reconnecter afin de recharger vos contenus.",
          [
            {
              text: "OK",
              onPress: async () => {
                // Supprimer les données de session
                await removeItem("accessToken");
                await removeItem("refreshToken");
                // Vider Redux
                dispatch(logout());
                // Vider le cache React Query
                qc.clear();
                // Aller vers le login
                router.replace("/(auth)/login");
              },
            },
            {
              text: "Annuler",
              style: "cancel" 
            }
          ],
        );
      }
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
      // console.log("res dans profile hook: ",res?.data)
      qc.invalidateQueries({ queryKey: queryKeys.user(vars.userID) });
      dispatch(updateProfileImg(res?.data.url));
    },
  });
}
