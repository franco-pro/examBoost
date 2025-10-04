import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import AppLayout from "../styles/AppLayout";
import LanguageSwitcher from "@/components/layouts/LanguageSwitch";

export default function RootLayout() {
  return (
    <AppLayout>
      <LanguageSwitcher />
      <Tabs
        screenOptions={{
          animation: "none",
          tabBarActiveTintColor: "#181c5c",
          headerStyle: {
            backgroundColor: "#181c5c",
          },
          headerShadowVisible: false,
          tabBarInactiveTintColor: "#FFFFFF",
          headerTintColor: "#FFFFFF",
          tabBarStyle: {
            backgroundColor: "#ff894f",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
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
            title: "Mes Transactions",
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
            title: "Packs",
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
