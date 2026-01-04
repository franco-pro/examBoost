import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/hooks/redux/store'
import { getItem } from '@/app/utils/asyncStorage'
import { Stack } from 'expo-router'

export default function AppNavigator() {
    let [initialRouteName, setInitialRouteName] = useState<string>("pages/onboarding/index")
    let [showOnboarding, setShowOnboarded] = useState<null | boolean>(null);
  const { token } = useSelector((state: RootState) => state.user)
  console.log("token saved:",token)
    useEffect(() => {
        checkIfAlreadyOnboarding()
    }, []);

    useEffect(() => {
        if (token) {
            setInitialRouteName("pages/(tabs)")
        } else {
            setInitialRouteName("pages/auth/login")
        }
    }, [token]);

    const checkIfAlreadyOnboarding = async() => {
        let onboarded = await getItem("onboarded");
                console.log("datas in layout:", onboarded)
                if (onboarded==="true" && !token){
                    setShowOnboarded(false)
                    setInitialRouteName("pages/auth/login"); 
                } else if (token) {
                  setShowOnboarded(false)
                  setInitialRouteName("pages/(tabs)")
                 }
                else {
                    setInitialRouteName("pages/onboarding/index")
                    setShowOnboarded(true);
                }
    }

    if(showOnboarding === null) return null
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "#f4511e" },
        headerTintColor: "#000",
        headerTitle: "ONBOARDING",
      }}
      initialRouteName={initialRouteName}
    >
      <Stack.Screen name="./pages/onboarding/index" />
      <Stack.Screen name="./pages/auth/register" />
      <Stack.Screen name="./pages/auth/login" />
      <Stack.Screen name="./pages/(tabs)" options={{}} />
    </Stack>
  );
}