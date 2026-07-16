import { queryKeys } from "@/app/lib/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DocumentRow } from "../documents/utils";
import type { User } from "../user/types";
import {
  fetchPackDocumentsHttp,
  getDocumentsAndCorrectionHttp,
  purchasePackHttp,
} from "./api.http";
import type { Pack } from "./types";
import apiClient from "@/app/api/apiClient";
import { packProps, packService } from "@/app/api/packService";
import { useDispatch } from "react-redux";
import { updateBalanceUser } from "@/app/hooks/redux/users/users.slice";

const toPackUi = (dto: Pack) => {
  return {
    id: dto.id,
    name: dto.name,
    type: dto.type,
    description: dto.description,
    categorie: dto.categorie,
    price: dto.price,
    durationDays: dto.durationDays,
    isActive: dto.isActive,
    isSubscribed: dto.isSubscribed,
    updatedAt: dto.updated_at,
    createdAt: dto.created_at,
    remainingDays: dto.remainingDays,
  };
};

export function usePackSubscription(userID: number,packID: number) {
  return useQuery({
    queryKey: ["pack-subscription", packID],
    queryFn: async () => {
      if (!packID) throw new Error("Pack ID Manquant.");
      const request = await apiClient.get(`user-pack/${userID}/${packID}`);
      return request.data;
    },
    enabled: !!packID,
  });
}

export function usePacksQuery(userID: number) {
  const qc = useQueryClient();
  return useQuery<packProps[]>({
    queryKey: userID ? queryKeys.packs(userID) : ["packs", "none"],
    queryFn: async () => {
      if (!userID) throw new Error("userID manquant");
      const key = queryKeys.packs(userID);
      const prev = qc.getQueryData<Pack[]>(key);

      const dtos = await packService.getAllPackByOneUser(userID);
      const next = dtos.map(toPackUi);

      // Preserve optimistic purchases: if a pack is already marked subscribed in cache,
      // don't let a slightly stale server response flip it back to false.
      if (!prev?.length) return next;
      const prevById = new Map(prev.map((p) => [p.id, p] as const));
      return next.map((p: any) => {
        const old = prevById.get(p.id);
        if (old?.isSubscribed) return { ...p, isSubscribed: true };
        return p;
      });
    },
    enabled: !!userID,
    // Mobile: avoid immediate refetch on focus/mount that can overwrite optimistic `isSubscribed: true`
    // right after a purchase when backend propagation is slightly delayed.
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Auto-refresh so newly created packs in DB appear without user action.
    // We keep a moderate interval to avoid battery drain.
    refetchInterval: false,
  });
}
export function usePackDocumentsQuery(userID?: number) {
  return useQuery({
    queryKey: ["packDocuments", userID],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey as [string, number];
      if (!userID) throw new Error("Paramètres manquants");
      const docs = await fetchPackDocumentsHttp({ userID: id });
      const safeDatas = Array.isArray(docs) ? docs : [docs];
      const rows: DocumentRow[] = safeDatas.map((d) => ({
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
      }));

      return rows;
    },
    enabled: !!userID,
  });
}
export function usePurchasePackMutation() {
  const qc = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: purchasePackHttp,
    onSuccess: async (res, vars) => {
      const userID = Number((res as any)?.userID ?? vars.userID);
      const packID = Number((res as any)?.packID ?? vars.packID);
      
      console.log(
        "userID dans hook rq pack:",
        userID,
        "packID  dans hook rq pack:",
        packID,
      );
      // Update packs list immediately so going back shows the pack as paid without waiting for refetch.
      qc.setQueryData<Pack[]>(queryKeys.packs(userID), (prev) => {
        if (!Array.isArray(prev)) return prev;
        return prev.map((p) =>
          (p.id) === packID ? { ...p, isSubscribed: true } : p,
        );
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

      dispatch(updateBalanceUser(res.wallet))
      await qc.invalidateQueries({ queryKey: queryKeys.user(userID) });
      await qc.invalidateQueries({ queryKey: queryKeys.packDocuments(userID) });
      await qc.invalidateQueries({ queryKey: queryKeys.packs(userID) });
      await qc.invalidateQueries({ queryKey: queryKeys.Documents(packID) });
      // const cache = qc.getQueryData(queryKeys.packs(userID));
      // console.log("QUERY KEY:", queryKeys.packs(userID!));
      // console.log("ALL QUERY",qc.getQueryCache().getAll());
      // console.log("wallet dans hook.rq: ", res)
      // console.log("CACHE PACKS:", cache);
    },
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
