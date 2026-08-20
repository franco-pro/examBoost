import axios from "axios";
import { getItem, setItem } from "../utils/asyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateTokens } from "../hooks/redux/users/users.slice";
import { useDispatch } from "react-redux";
import { store } from "../hooks/redux/store";

export const BASE_URL = "http://192.168.1.101:3000";
export const socketUrl = "https://www.examboost.org";
export const apiClient = axios.create({
  baseURL:`${BASE_URL}`,
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
  console.log("token :", token);
  // console.log("all keys :", keys);
  // console.log("🚀 REQUEST:");
  // console.log("METHOD:", config.method);
  // console.log("BASE URL:", config.baseURL);
  // console.log("URL:", config.url);
  // console.log("FULL URL:", `${config.baseURL}${config.url}`);

  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
//Gerer la file d'attente de token
let isRefreshing = false;
let failedQueue:any = [];
const processQueue = (error:any, token = null) => {
  failedQueue.forEach((prom:any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
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
      // CAS 1 : Si un rafraîchissement est DÉJÀ en cours pour une autre requête
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return apiClient.request(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      console.log("STATUS ERROR 👉", error.response?.status);
      try {
        console.log("enter refresh fonction");
        const refresh_Token = await getItem("refreshToken");
        console.log("refresh Token ApiClient:", refresh_Token);
        if (!refresh_Token) throw new Error("No refresh token found");
        const res = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_Token,
        });
const { accessToken, refreshToken } = res.data;
        // stocke les nouveaux tokens (sans dépendre du Redux store pour éviter les cycles)
        await setItem("accessToken", accessToken);
        await setItem("refreshToken", refreshToken);

        store.dispatch(
          updateTokens({
            accessToken: accessToken,
            refreshToken: refreshToken,
          }),
        );

        // Libère toutes les requêtes qui attendaient patiemment dans la file
        processQueue(null, accessToken);
        isRefreshing = false;

        console.log(
          "les keys dans refresh function :",
          accessToken,
          refreshToken,
          "res:",
          res,
        );

        //réessaye la requete avec le nouveau accessToken
        originalRequest.headers["Authorization"] =
          `Bearer ${accessToken}`;

        return apiClient.request(originalRequest);
      } catch (refreshError) {
        console.log("refresh token invalide:", refreshError);
         processQueue(refreshError, null);
         isRefreshing = false;
        // await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
        //se deconnecter
        // store.dispatch(logout());
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
