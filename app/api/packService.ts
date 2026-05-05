import { useSelector } from "react-redux";
import apiClient from "./apiClient";
import { RootState } from "../hooks/redux/store";
import { store } from "../hooks/redux/store";

export interface packProps {
  id: number;
  name: string;
  price: number;
  description: string;
  duration: number;
  durationDays: number;
  createdAt: any;
  isActive: boolean;
  coverUrl: string;
  categorie: string;
  type: string;
  niveauID: number;
}

export const packService = {
  getAllPackByOneUser: async () => {
    const state = store.getState();
    const userID = state?.user?.user?.id;
    // console.log("userID:", userID)
    if (!userID) throw new Error("UserID Null");
    const response = await apiClient.get(`/pack/user/${userID}`);
    // console.log("response:", response)
    // console.log("datas in packservice:", response.data);
    return response.data;
  },
  allPacks: async () => {
    const response = await apiClient.get("/pack");
    console.log("all packs in packs services: ", (await response).data);
    return response.data;
  },
};
