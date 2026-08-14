import { useEffect, useState } from "react";
import { getItem } from "./utils/asyncStorage";
import { Redirect } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "./hooks/redux/store";
import i18n from "@/lang/i18n";

export default function Index() {
    const [accessToken, setAccesToken] = useState("")
    const [loading, setLoading] = useState(true)
    const [onboarded, setOnboarding] = useState('')
    const [lang, setLang] = useState('')
    const {isAuthenticated} = useSelector((s:RootState)=> s.user)
    

    useEffect(() => {
        (async () => {
            const token = await getItem("accessToken")
            const currentLang = await getItem("language");
            const isOnboarded = await getItem("onboarded");
            // console.log("value onboarded:", isOnboarded)
            if (token) {
                setAccesToken(token);
            } else {
                console.log("la sauvegarde du token n'a pas pris :", token)
            }
            if (currentLang) {
                setLang(currentLang);
            } else {
                console.log("la sauvegarde de la langue n'a pas pris :", currentLang)
            }
            if (isOnboarded) {
                setOnboarding(isOnboarded);
            } else {
                console.log("la sauvegarde de ONBOARD n'a pas pris :", isOnboarded)
                console.log("langue:", i18n.language, "langue dans asyn:", await getItem("language"))
            }
            
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

    if (!isAuthenticated) {
        return <Redirect href="./(auth)/login"/>
    }

    return <Redirect href={"./(tabs)"}/>
}