import LanguageSwitcher from "@/components/layouts/LanguageSwitch";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import AppLayout from "../styles/AppLayout";

export default function RootLayout() {
  const {t} = useTranslation("competition")
  return (
    <AppLayout>
      <LanguageSwitcher />
      <Tabs
        screenOptions={{
          animation: "none",
          tabBarActiveTintColor: "#ff894f",
          headerStyle: {
            backgroundColor: "#181c5c",
          },
          headerShadowVisible: false,
          tabBarInactiveTintColor: "#FFFFFF",
          headerTintColor: "#FFFFFF",
          tabBarStyle: {
            backgroundColor: "#181c5c",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("accueil.navigationBottom.home"),
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home-sharp" : "home-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="transaction"
          options={{
            title: t("accueil.navigationBottom.transactions"),
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "swap-horizontal" : "swap-horizontal-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="pack"
          options={{
            title: t("accueil.navigationBottom.packs"),
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "briefcase" : "briefcase-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="competition"
          options={{
            title: "Competitions",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "trophy" : "trophy-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
      </Tabs>
    </AppLayout>
  );
}
