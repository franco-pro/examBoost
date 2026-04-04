import apiClient from "./apiClient";

export interface packProps {
  id: number;
  name: string;
  price: number;
  description: string;
  duration: number;
  durationDays: number;
  createdAt: any;
  isActive: boolean;
}

export const packService = {
    getAllPackByOneUser: async (userID:number) => {
        const response = await apiClient.get(`/user-pack/user/${userID}`)
        console.log("datas in packservice:", response.data)
        return response.data
    },
    allPacks: async () => {
        const response = await apiClient.get("/pack")
        console.log("all packs in packs services: ", (await response).data)
        return  response.data
    }
}