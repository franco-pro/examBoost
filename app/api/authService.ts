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
  email?: string;
  phone?: string;
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
      console.log("✅ register data dans authservice:", response.data);
      return response.data;
    } catch (err: any) {
      console.log(
        "❌ Erreur dans authService register:",
        err?.response?.data || err.message
      );

      // renvoie une erreur exploitable par ton thunk
      throw (
        err?.response?.data || err || {
          message: "Une erreur est survenue lors de l'inscription",
        }
      );
    }
  },

  login: async (payload: loginProps) => {
    console.log("lien:", apiClient)
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
    const response = await apiClient.get("/home", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
