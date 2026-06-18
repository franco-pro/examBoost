import LanguageSwitcher from "@/components/layouts/LanguageSwitch";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import AppLayout from "../styles/AppLayout";
import LogoHeaderComponent from "@/components/personalizedComponents/logoApplication";
import RightBtn from "@/components/personalizedComponents/rightBtn";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../hooks/redux/store";
import { useRouter } from "expo-router";

export default function RootLayout() {
  const navigation = useRouter();
  const { t } = useTranslation("competition");
  const {user, others} = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (!user) {
      navigation.replace("/login");
    }
  }, [user]);
  return (
    <AppLayout>
      {/* <LanguageSwitcher /> */}
      <Tabs
        screenOptions={{
          animation: "fade",
          tabBarActiveTintColor: "#ff894f",
          headerStyle: {
            backgroundColor: "#f9fafb",
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
        {user?.role === "ADMIN" && (
          <Tabs.Screen
            name="enseignant"
            options={{
              title: t("accueil.navigationBottom.teacher"),
              tabBarIcon: ({ focused, color }) => (
                <Ionicons
                  name={focused ? "book" : "book-outline"}
                  color={color}
                  size={24}
                />
              ),
            }}
          />
        )}

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
            tabBarBadge: (others.notification && Array.isArray(others.notification)) ? (others.notification.length > 0 ? others.notification.length : null): null,
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
