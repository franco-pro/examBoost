import axios from "axios";
import { getItem, setItem } from "../utils/asyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";

export const BASE_URL = "http://192.168.1.101";
export const apiClient = axios.create({
  baseURL:`${BASE_URL}:3000`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

//ajouter automatiquement les accessToken a toutes les requetes
apiClient.interceptors.request.use(async (config) => {
  const token = await getItem("accessToken");
  const refreshToken = await getItem("refreshToken");
  const keys = await AsyncStorage.getAllKeys();
  console.log("all keys :", keys);
  // console.log("🚀 REQUEST:");
  // console.log("METHOD:", config.method);
  console.log("BASE URL:", config.baseURL);
  // console.log("URL:", config.url);
  console.log("FULL URL:", `${config.baseURL}${config.url}`);

  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
//refresh le acceess token si expiré avec le refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // 🔥 Ignorer les routes d'authentification
    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/register") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    //si token a une status 401 donc si le accessToken a expire , utiliser le refresh token pour refresh le accessToken
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("STATUS ERROR 👉", error.response?.status);
      try {
        console.log("enter refresh fonction")
        const refresh_Token = await getItem("refreshToken");
        console.log("refresh Token ApiClient:", refresh_Token);
        if (!refresh_Token) throw new Error("No refresh token found");
        const res = await apiClient.post("/auth/refresh", { refresh_Token });

        // stocke les nouveaux tokens (sans dépendre du Redux store pour éviter les cycles)
        await setItem("accessToken", res.data.accessToken);
        await setItem("refreshToken", res.data.refreshToken);
        
        console.log(
          "les keys dans refresh function :",
          res.data.accessToken,
          res.data.refreshToken,
        );

        //réessaye la requete avec le nouveau accessToken
        originalRequest.headers["Authorization"] =
          `Bearer ${res.data.accessToken}`;

        return apiClient.request(originalRequest);
      } catch (error) {
        console.log("refresh token invalide:", error);
        // await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
        //se deconnecter
        // store.dispatch(logout());
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
