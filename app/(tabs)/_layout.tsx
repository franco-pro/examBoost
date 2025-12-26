import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname, useRouter } from "expo-router";
import { useMemo } from "react";
import { useNotifications } from "@/app/features/notifications/hooks";
import AppLayout from "../styles/AppLayout";
import LanguageSwitcher from "@/components/layouts/LanguageSwitch";
import { Pressable, View } from "react-native";

export default function RootLayout() {
  // TODO: remplacer par l'ID utilisateur réel quand l'auth sera prête
  const userID = 42;
  const router = useRouter();
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
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingRight: 12 }}>
              <Pressable
                onPress={() => router.push('/(tabs)/notifications')}
                style={{ padding: 6 }}
                accessibilityRole="button"
                accessibilityLabel="Notifications"
              >
                <View style={{ position: 'relative' }}>
                  <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
                  {unreadCount > 0 ? (
                    <View
                      style={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        backgroundColor: '#ff894f',
                      }}
                    />
                  ) : null}
                </View>
              </Pressable>

              <Pressable
                onPress={() => router.push('/(tabs)/profile')}
                style={{ padding: 6 }}
                accessibilityRole="button"
                accessibilityLabel="Profil"
              >
                <Ionicons name="person-circle-outline" size={24} color="#FFFFFF" />
              </Pressable>
            </View>
          ),
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
            href: null,
          }}
        />
      </Tabs>
    </AppLayout>
  );
}
