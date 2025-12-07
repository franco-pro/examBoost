import axios from "axios"
import { getItem, setItem } from "../utils/asyncStorage";
import { RootState, store } from "../redux/store";
import { setCredentials } from "../redux/users/users.slice";

const apiClient = axios.create({
  baseURL: "http://192.168.1.189:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

//ajouter automatiquement les accessToken a toutes les requetes
apiClient.interceptors.request.use(async (config) => {
  const state: RootState = store.getState();
  const token = state.user.token
  console.log("Access Token dans apiclient:", token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  console.log("config:", config);
  return config
})

//refresh le token si expiré avec le refresh token
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

      try {
        const state: RootState = store.getState();
        const refresh_Token = state.user.refreshToken;
        console.log("refresh Token ApiClient:", refresh_Token);
        if (!refresh_Token) throw new Error("No refresh token found");
        const res = await apiClient.post("/auth/refresh", { refresh_Token });

        //stocke les nouveaux token
        store.dispatch(
          setCredentials({
            token: res.data.accessToken,
            refreshToken: res.data.refreshToken,
          })
        );

        //réessaye la requete avec le nouveau accessToken
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${res.data.accessToken}`;

        return apiClient.request(originalRequest);
      } catch (error) {
        console.log("refresh token invalide:", error);
        //se deconnecter
        // store.dispatch(setCredentials({token:null, refreshToken:null}))
      }
      return Promise.reject(error);
    }
  }
)
export default apiClient;
