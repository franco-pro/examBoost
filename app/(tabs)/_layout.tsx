import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { useMemo } from "react";
import { useNotifications } from "@/src/features/notifications/hooks";
import AppLayout from "../styles/AppLayout";
import LanguageSwitcher from "@/components/layouts/LanguageSwitch";

export default function RootLayout() {
  // TODO: remplacer par l'ID utilisateur réel quand l'auth sera prête
  const userID = 42;
  const pathname = usePathname();
  const isOnNotifications =
    pathname?.endsWith("/notifications") || pathname === "/notifications";

  // Poll uniquement hors de la page notifications
  const { data } = useNotifications(userID, {
    refetchInterval: isOnNotifications ? false : 1000,
  });

  const unreadCount = useMemo(
    () => data?.filter((n) => !n.read).length ?? 0,
    [data]
  );

  return (
    <AppLayout>
      {/* <LanguageSwitcher /> */}
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
        <Tabs.Screen name="packs" options={{ href: null }} />

        <Tabs.Screen name="profile" options={{ href: null }} />

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

        <Tabs.Screen
          name="notifications"
          options={{
            title: "Notifications",
            tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
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
