import LanguageSwitcher from "@/components/layouts/LanguageSwitch";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import AppLayout from "../styles/AppLayout";
import LogoHeaderComponent from "@/components/personalizedComponents/logoApplication";
import RightBtn from "@/components/personalizedComponents/rightBtn";

export default function RootLayout() {
  const {t} = useTranslation("competition")
  return (
    <AppLayout>
      {/* <LanguageSwitcher /> */}
      <Tabs
        screenOptions={{
          animation: "fade",
          tabBarActiveTintColor: "#ff894f",
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerShadowVisible: false,
          tabBarInactiveTintColor: "#FFFFFF",
          headerTintColor: "#000",
          headerTransparent: false,
          tabBarStyle: {
            backgroundColor: "#181c5c",
          },
          headerTitleAlign: "left",
          headerTitle: () => <LogoHeaderComponent />,
          headerRight: () => <RightBtn />,
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

        <Tabs.Screen
          name="notifications"
          options={{
            title: "Notifications",
            tabBarBadge: 10,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "notifications" : "notifications-outline"}
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
