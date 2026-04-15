import { useSelector } from "react-redux";
import { RootState } from "./hooks/redux/store";
import { useEffect, useState } from "react";
import { getItem } from "./utils/asyncStorage";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "@/lang/i18n";

export default function Index() {
    const { accessToken } = useSelector((state: RootState) => state.user)
    const [loading, setLoading] = useState(true)
    const [onboarded, setOnboarding] = useState(false)
    const [lang, setLang] = useState('')
    

    useEffect(() => {
        (async () => {
            const currentLang = await AsyncStorage.getItem("lang");
            if (currentLang) {
                setLang(currentLang);
            } else {
            }
            
            const value = await getItem("onboarded")
            setOnboarding(true)
            setLoading(false)
        })()
    }, [])
    
    if (loading) return null

    if (!lang) {
        return <Redirect href={"./(choisenLang)"}/>
    }
    
    if (!onboarded) {
        return <Redirect href={"./(onboarding)"}/>
    }

    if (!accessToken) {
        return <Redirect href="./(auth)/login"/>
    }

    return <Redirect href={"./(tabs)"}/>
}