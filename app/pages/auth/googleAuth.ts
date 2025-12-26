import apiClient from "@/app/api/apiClient";
import axios from "axios";
import * as Google from "expo-auth-session/providers/google";
import * as webBrowser from "expo-web-browser";
import { useEffect, useState } from "react";

webBrowser.maybeCompleteAuthSession();
export default function GoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "317796613536-ltb3bdmld30tlt5bb4a5nhvnfh4ce070.apps.googleusercontent.com",
    androidClientId:
      "317796613536-c726umc964mudd41jj0gbrj3vcf3aqgf.apps.googleusercontent.com",
    iosClientId:
      "317796613536-gaeltgb1och5sag6fm8ave05b9d59k70.apps.googleusercontent.com",
  });
    
    useEffect(() => {
        async function processGoogleLogin() {
            if (response?.type === "success") {
                const { accessToken } = response.authentication!
                
                try {
                    //fetch user Info for google
                    const googleUserInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                        headers:{Authorization:`Bearer ${accessToken}`}
                    })

                    //send to backend
                    const backendResponse = await apiClient.post("/auth/google/login", googleUserInfo.data)
                    console.log("Login Ok backend:", backendResponse.data)
                } catch (error) {
                    console.log("Something wrong in auth google:", error)
                }
            }
        }
        processGoogleLogin()
    },[response])
    
    return {
        request,promptAsync
    }
}
