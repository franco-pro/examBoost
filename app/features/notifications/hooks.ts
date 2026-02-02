import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listNotifications, markRead } from './api.http';
import { connectNotificationsSocket } from './socket';
import type { Notification } from './types';

const queryKey = (userID?: number) => ['notifications', userID] as const;

export function useNotifications(
  userID?: number,
  options?: {
    refetchInterval?: number | false;
  }

) {
  return useQuery<Notification[]>({
    queryKey: queryKey(userID),
    queryFn: () => listNotifications(userID),
    // Rafraîchit en arrière-plan pour tenir à jour le badge 
    refetchInterval: options?.refetchInterval ?? 1, // 1s par défaut
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
}

export function useDeleteNotification(userID?: number) {
  const qc = useQueryClient();
  return useMutation({
    // Backend doesn't support DELETE; we do local-only delete for UX
    mutationFn: async (id: string) => id,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKey(userID) });
      const prev = qc.getQueryData<Notification[]>(queryKey(userID));

      qc.setQueryData<Notification[]>(queryKey(userID), (old) =>
        (old ?? []).filter((n) => n.id !== id)
      );

      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKey(userID), ctx.prev);
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: queryKey(userID) });
    },
  });
}

export function useNotificationsRealtime(userID?: number) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!userID) return;

    const socket = connectNotificationsSocket(userID);
    if (!socket) return;

    const invalidate = () => {
      void qc.invalidateQueries({ queryKey: queryKey(userID) });
    };

    socket.on('new-notification', invalidate);
    socket.on('admin-notif', invalidate);
    socket.on('invitation-response', invalidate);

    return () => {
      socket.off('new-notification', invalidate);
      socket.off('admin-notif', invalidate);
      socket.off('invitation-response', invalidate);
      socket.disconnect();
    };
  }, [qc, userID]);
}

export function useMarkRead(userID?: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => markRead(id),
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: queryKey(userID) });
      const prev = qc.getQueryData<Notification[]>(queryKey(userID));

      qc.setQueryData<Notification[]>(queryKey(userID), (old) =>
        (old ?? []).map((n) => (n.id === id ? { ...n, read: true } : n))
      );

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
