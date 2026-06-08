import { useEffect, useState } from "react";
import { getItem } from "./utils/asyncStorage";
import { Redirect } from "expo-router";

export default function Index() {
    const [accessToken, setAccesToken] = useState("")
    const [loading, setLoading] = useState(true)
    const [onboarded, setOnboarding] = useState('')
    const [lang, setLang] = useState('')
    

    useEffect(() => {
        (async () => {
            const token = await getItem("accessToken")
            const currentLang = await getItem("language");
            const isOnboarded = await getItem("onboarded");
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

    if (!accessToken) {
        return <Redirect href="./(auth)/login"/>
    }

    return <Redirect href={"./(tabs)"}/>
}