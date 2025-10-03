import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clearNotifications, deleteNotification, listNotifications, markRead } from './api.mock';
import type { Notification } from './types';

const queryKey = (userID?: number) => ['notifications', userID] as const;

export function useNotifications(userID?: number) {
  return useQuery<Notification[]>({
    queryKey: queryKey(userID),
    queryFn: () => listNotifications(userID),
  });
}

export function useDeleteNotification(userID?: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKey(userID) });
    },
  });
}

export function useClearNotifications(userID?: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => clearNotifications(),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKey(userID) });
    },
  });
}

export function useMarkRead(userID?: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) => markRead(id, read),
    onMutate: async ({ id, read }) => {
      await qc.cancelQueries({ queryKey: queryKey(userID) });
      const prev = qc.getQueryData<Notification[]>(queryKey(userID));
      if (prev) {
        qc.setQueryData<Notification[]>(queryKey(userID), (old) =>
          (old ?? []).map((n) => (n.id === id ? { ...n, read } : n))
        );
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKey(userID), ctx.prev);
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: queryKey(userID) });
    },
  });
}
