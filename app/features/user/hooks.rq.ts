import { queryKeys } from '@/app/lib/queryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { changePasswordHttp, deleteUserHttp, deleteUserImageHttp, getUserByIdHttp, updateUserHttp, uploadUserImageHttp } from './api.http';
import type { User } from './types';

export function useUserQuery(userID?: number) {
  return useQuery({
    queryKey: userID ? queryKeys.user(userID) : ['user', 'none'],
    queryFn: () => {
      if (!userID) throw new Error('userID manquant');
      return getUserByIdHttp(userID);
    },
    enabled: !!userID,
  });
}

export function useUpdateUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateUserHttp,
    onSuccess: async (updated) => {
      qc.setQueryData<User>(queryKeys.user(updated.id), updated);
      await qc.invalidateQueries({ queryKey: queryKeys.user(updated.id) });
    },
  });
}

export function useUploadUserImageMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadUserImageHttp,
    onSuccess: (res, vars) => {
      const key = queryKeys.user(vars.userID);
      const prev = qc.getQueryData<User>(key);
      if (prev) qc.setQueryData<User>(key, { ...prev, imgUrl: res.imgUrl });
    },
  });
}

export function useDeleteUserImageMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUserImageHttp,
    onSuccess: (_res, vars) => {
      const key = queryKeys.user(vars.userID);
      const prev = qc.getQueryData<User>(key);
      if (prev) qc.setQueryData<User>(key, { ...prev, imgUrl: null });
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: changePasswordHttp,
  });
}

export function useDeleteUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUserHttp,
    onSuccess: async (res) => {
      await qc.invalidateQueries({ queryKey: queryKeys.user(res.userID) });
      await qc.invalidateQueries({ queryKey: queryKeys.users() });
    },
  });
}
