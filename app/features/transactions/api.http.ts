import apiClient from "@/app/api/apiClient";

 export async function  getAllTransactionsByUser(userId: number) {
        try {
          const response = await apiClient.get(
            `transactions/user/${userId}`,
          );
          return { data: response.data, error: null };
        } catch (error: any) {
          return { data: null, error: error.response.data.message };
        }
      }