import { toAbsoluteUrl } from '@/app/config/env';
import { getHttpErrorMessage, http } from '@/app/lib/http';
import apiClient from '@/app/api/apiClient';

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

export type SubscriptionPackResponse = {
  
  isSubscribed: boolean
  expired: boolean
  expireAt:Date
  remainingDays: number

}

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
  type: string;
  correctionId: string;
  document?: object;
  correction?: object;
};

export async function fetchPackDocumentsHttp(params: { userID: number }): Promise<DocumentDTO[]> {
  try {
    // const res = await http.get(`/document/user/${params.userID}`, { params: { userID: params.userID } });
    const res = await apiClient.get(`document/user/${params.userID}`)
    const docs = res.data as DocumentDTO[];
    const safeDocs = Array.isArray(docs)? docs : [docs]
    const result = safeDocs.map((d) => ({ ...d, url: (d.url) }));
    // console.log("result datas in api: ", result, "res dans api:",result);
    return result
  } catch (e: any) {
    throw new Error(getHttpErrorMessage(e));
  }
}
export async function getDocumentsAndCorrectionHttp(params: { documentId: number }): Promise<DocumentDTO[]> {
  try {
    // const res = await http.get(`/document/user/${params.userID}`, { params: { userID: params.userID } });
    const res = await apiClient.get(`document/${params.documentId}`)
    const docs = res.data as DocumentDTO[];
    const safeDocs = Array.isArray(docs)? docs : [docs]
    const result = safeDocs.map((d) => ({ ...d, url: (d.url) }));
    // console.log("result datas in api: ", result, "res dans api:", res.data);
    return result
  } catch (e: any) {
    throw new Error(getHttpErrorMessage(e));
  }
}

export async function fetchPacksHttp(params: { userID: number }): Promise<PackDTO[]> {
  try {
    const res = await http.get('/pack', { params: { userID: params.userID } });
    return (res.data?.data ?? []) as PackDTO[];
  } catch (e: any) {
    throw new Error(getHttpErrorMessage(e));
  }
}

export async function purchasePackHttp(params: { userID: number; packID: number }): Promise<PurchasePackResponse> {
  try {
    const res = await apiClient.post("user-pack", { userID: params.userID, packID: params.packID });
    console.log("res =", res);
    return res.data as PurchasePackResponse;
  } catch (e: any) {
    throw new Error(getHttpErrorMessage(e));
  }
}
