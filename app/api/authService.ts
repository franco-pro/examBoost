import apiClient from "./apiClient";

export interface registerProps {
  username: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  niveauID: number;
}
export interface loginProps {
  identifier: string;
  password: string;
}
export interface forgetPasswordProps {
  email: string;
}
export interface resetPasswordProps {
  codeToken: string;
  newPassword: string;
}
export const authService = {
  //connexion
  register: async (payload: registerProps) => {
    try {
      const response = await apiClient.post("/auth/register", payload);
      return response.data;
    } catch (err: any) {

      // renvoie une erreur exploitable par ton thunk
      throw (
        err?.response?.data || err || {
          message: "Une erreur est survenue lors de l'inscription",
        }
      );
    }
  },

  search: async(payload: {query: string, page: number, limit: number})=>{
      try {
          const response = await apiClient.get("/users/admin/search?data="+payload.query+"&page="+payload.page+"&limit="+payload.limit);
          return response.data;
      } catch (error: any) {
          console.log(" Erreur pendant search dans authService:", error);
          throw (
            error?.response?.data || error || {
              message: "Une erreur est survenue lors de la recherche",
            }
          );
      } 
  },

  deleteUser : async(id: number) => {
    try {
        const response = await apiClient.delete("/users/"+id);
        return response.data;
    } catch (error: any) {
        console.log(" Erreur pendant delete dans authService:", error);
        throw (
          error?.response?.data || error || {
            message: "Une erreur est survenue lors de la suppression",
          }
        );
    }
  },

  updateRole: async (data: {id: number, role: string}) => {
    try {
        const response = await apiClient.put("/users/"+data.id, {role: data.role});
        return response.data;
    }catch(error: any){
        console.log(" Erreur pendant updateRole dans authService:", error);
        throw (
          error?.response?.data || error || {
            message: "Une erreur est survenue lors de la mise à jour du rôle",
          }
        );
    }
  },

  login: async (payload: loginProps) => {
    const response = await apiClient.post("/auth/login", payload);
    return response.data;
  },
  forgetPassword: async (payload: forgetPasswordProps) => {
    const response = await apiClient.post("/auth/forgot-password", payload);
    return response.data;
  },
  resetPassword: async (payload: resetPasswordProps) => {
    const response = await apiClient.put("/auth/reset-password", payload);
    return response.data;
  },
  userDatas: async (token: string) => {
    if(!token){}
    const response = await apiClient.get("/home", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
