import { useSelector } from "react-redux";
import { RootState } from "./hooks/redux/store";
import { useEffect, useState } from "react";
import { getItem } from "./utils/asyncStorage";
import { Redirect } from "expo-router";

export default function Index() {
    const { accessToken } = useSelector((state: RootState) => state.user)
    const [loading, setLoading] = useState(true)
    const [onboarded, setOnboarding] = useState(false)

    useEffect(() => {
        (async () => {
            const value = await getItem("onboarded")
            setOnboarding(true)
            setLoading(false)
        })()
    }, [])
    
    if (loading) return null
    
    if (!onboarded) {
        return <Redirect href={"./(onboarding)"}/>
    }

    if (!accessToken) {
        return <Redirect href="./(auth)/login"/>
    }

    return <Redirect href={"./(tabs)"}/>
}