import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import AppLayout from '../styles/AppLayout'
import LogoHeaderComponent from '@/components/personalizedComponents/logoApplication';
import RightBtn from '@/components/personalizedComponents/rightBtn';


export default function RootLayout(){
    return (
      <AppLayout>
        <Tabs
          screenOptions={{
            animation: "fade",
            tabBarActiveTintColor: "#ff894f",
            headerStyle: {
              backgroundColor: "#E8F5FA",
            },
            headerShadowVisible: true,
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