import { toAbsoluteUrl } from '@/src/config/env';
import { getHttpErrorMessage, http } from '@/src/lib/http';

export type PackAccessDTO = {
  isSubscribed: boolean;
  expireAt: string | null;
  isExpired: boolean;
};

export type PackDTO = {
  id: number;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  isActive: boolean;
  created_at?: string;
  updated_at?: string;
  access?: PackAccessDTO;
};

export type PurchasePackResponse = {
  done: boolean;
  userID: number;
  packID: number;
  expireAt: string;
  wallet: number;
  transactionPID: string;
};

export type DocumentDTO = {
  id: number;
  name: string;
  format: string | null;
  url: string;
  subject: string;
  isValidated: boolean;
  niveauID: number;
  created_at: string;
  updated_at: string;
};

export const fetchPacksHttp = async (params: { userID: number }): Promise<PackDTO[]> => {
  try {
    const res = await http.get('/pack', { params: { userID: params.userID } });
    return (res.data?.data ?? []) as PackDTO[];
  } catch (e: any) {
    throw new Error(getHttpErrorMessage(e));
  }
};

export const purchasePackHttp = async (params: { userID: number; packID: number }): Promise<PurchasePackResponse> => {
  try {
    const res = await http.post(`/pack/${params.packID}/purchase`, { userID: params.userID });
    return res.data as PurchasePackResponse;
  } catch (e: any) {
    throw new Error(getHttpErrorMessage(e));
  }
};

export const fetchPackDocumentsHttp = async (params: { userID: number; packID: number }): Promise<DocumentDTO[]> => {
  try {
    const res = await http.get(`/pack/${params.packID}/documents`, { params: { userID: params.userID } });
    const docs = (res.data?.document ?? []) as DocumentDTO[];
    return docs.map((d) => ({ ...d, url: toAbsoluteUrl(d.url) }));
  } catch (e: any) {
    throw new Error(getHttpErrorMessage(e));
  }
};
