import { queryKeys } from '@/app/lib/queryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DocumentRow } from '../documents/utils';
import type { User } from '../user/types';
import { fetchPackDocumentsHttp, fetchPacksHttp, getDocumentsAndCorrectionHttp, purchasePackHttp } from './api.http';
import type { Pack } from './types';

const toPackUi = (dto: any): Pack => {
  const access = dto?.access;
  return {
    id: String(dto.id),
    title: dto.name,
    description: dto.description,
    price: dto.price,
    durationDays: dto.durationDays,
    isActive: dto.isActive,
    isSubscribed: access?.isSubscribed && !access?.isExpired,
    updatedAt: dto.updated_at,
    createdAt: dto.created_at,
  };
};

export function usePacksQuery(userID?: number) {
  const qc = useQueryClient();
  return useQuery<Pack[]>({
    queryKey: userID ? queryKeys.packs(userID) : ['packs', 'none'],
    queryFn: async () => {
      if (!userID) throw new Error('userID manquant');
      const key = queryKeys.packs(userID);
      const prev = qc.getQueryData<Pack[]>(key);

      const dtos = await fetchPacksHttp({ userID });
      const next = dtos.map(toPackUi);

      // Preserve optimistic purchases: if a pack is already marked subscribed in cache,
      // don't let a slightly stale server response flip it back to false.
      if (!prev?.length) return next;
      const prevById = new Map(prev.map((p) => [p.id, p] as const));
      return next.map((p) => {
        const old = prevById.get(p.id);
        if (old?.isSubscribed) return { ...p, isSubscribed: true };
        return p;
      });
    },
    enabled: !!userID,
    // Mobile: avoid immediate refetch on focus/mount that can overwrite optimistic `isSubscribed: true`
    // right after a purchase when backend propagation is slightly delayed.
    staleTime: 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Auto-refresh so newly created packs in DB appear without user action.
    // We keep a moderate interval to avoid battery drain.
    refetchInterval: 20_000,
  });
}

export function usePurchasePackMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: purchasePackHttp,
    onSuccess: async (res, vars) => {
      const userID = Number((res as any)?.userID ?? vars.userID);
      const packID = Number((res as any)?.packID ?? vars.packID);

      // Update packs list immediately so going back shows the pack as paid without waiting for refetch.
      qc.setQueryData<Pack[]>(queryKeys.packs(userID), (prev) => {
        if (!prev) return prev;
        const idStr = String(packID);
        return prev.map((p) => (p.id === idStr ? { ...p, isSubscribed: true } : p));
      });

      // Update wallet immediately if the user query is already cached.
      qc.setQueryData<User>(queryKeys.user(userID), (prev) => {
        if (!prev) return prev;
        return { ...prev, wallet: res.wallet };
      });

      // Safety net: refresh user (wallet) from server.
      // NOTE: We intentionally do NOT invalidate `packs` immediately because the Packs screen
      // can still be mounted during navigation; an immediate refetch may overwrite the
      // optimistic "isSubscribed: true" with stale server data.
      await qc.invalidateQueries({ queryKey: queryKeys.user(userID) });
    },
  });
}

export function usePackDocumentsQuery(userID?: number) {
  return useQuery({
    queryKey: ['packDocuments', userID],
    queryFn: async ({ queryKey }) => {
      const [,id] = queryKey as [string,number]
      if (!userID ) throw new Error('Paramètres manquants');
      const docs = await fetchPackDocumentsHttp({ userID:id });
      const safeDatas = Array.isArray(docs) ? docs : [docs]
      const rows: DocumentRow[] =  safeDatas.map((d) => ({
        id: d.id,
        name: d.name,
        format: d.format,
        url: d.url,
        subject: d.subject,
        isValidated: d.isValidated ? 1 : 0,
        niveauID: d.niveauID,
        created_at: d.created_at,
        updated_at: d.updated_at,
        type: d.type,
      })) 

      return rows;
    },
    enabled: !!userID
  });
}

export function useDocumentAndCorrection(documentId?: number) {
  return useQuery({
    queryKey: ["documents", documentId],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey as [string, number];
      if (!documentId) throw new Error("Paramètres manquants");
      const docs = await getDocumentsAndCorrectionHttp({ documentId: id });
      // const safeDatas = Array.isArray(docs) ? docs : [docs];
// console.log("datas dans getdocument:", docs)
      return docs;
    },
    enabled: !!documentId,
  });
}
