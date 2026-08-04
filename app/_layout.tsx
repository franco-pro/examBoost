// import { Stack } from "expo-router";
// import "react-native-gesture-handler";
// import "react-native-reanimated";
// import { Provider } from "react-redux";

// import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
// import "@/global.css";
// import { PersistGate } from "redux-persist/integration/react";

// import { persistor, store } from "@/app/hooks/redux/store";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import "@/lang/i18n";
// import i18n from "@/lang/i18n";
// import { useEffect, useState } from "react";
// import Toast from "react-native-toast-message";
// import { toastConfig } from "./config/toast.config";

// const queryClient = new QueryClient();

// export default function RootLayout() {
//   const [appIsReady, setAppIsReady] = useState(false);

//   // useEffect(() => {
//   //   (async () => {
//   //     await initI18n()
//   //     setReady(true)
//   //   })()
//   // }, [])
//   // if (!ready) return null

//   useEffect(() => {
//     const loadLanguage = async () => {
//       const storedLang = await AsyncStorage.getItem("language");
//       if (storedLang) {
//         await i18n.changeLanguage(storedLang);
//       }
//     };
//     loadLanguage();
//   }, []);
//   return (
//     <Provider store={store}>
//       <PersistGate persistor={persistor}>
//         <GluestackUIProvider>
//           <GestureHandlerRootView style={{ flex: 1 }}>
//             <BottomSheetModalProvider>
//               <QueryClientProvider client={queryClient}>
//                 {/* <AppNavigator /> */}
//                 <Stack screenOptions={{ headerShown: false }} />
//               </QueryClientProvider>
//             </BottomSheetModalProvider>
//           </GestureHandlerRootView>
//         </GluestackUIProvider>
//       </PersistGate>
//       <Toast config={toastConfig} />
//     </Provider>
//   );
// }


import { Stack } from "expo-router";
import "react-native-gesture-handler";
import "react-native-reanimated";
import { Provider } from "react-redux";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "@/app/hooks/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import AsyncStorage from "@react-native-async-storage/async-storage";
import "@/lang/i18n";
import i18n from "@/lang/i18n";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { toastConfig } from "./config/toast.config";

// --- AJOUTS POUR LE SPLASH SCREEN ---
import * as SplashScreen from "expo-splash-screen";
import { View, Text, Image, StyleSheet, useColorScheme } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

// Empêche le Splash Screen natif de se masquer tout seul au démarrage
// SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const colorScheme = useColorScheme(); // Détecte automatiquement light ou dark

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // 1. Charge la langue depuis le stockage local
        const storedLang = await AsyncStorage.getItem("language");
        if (storedLang) {
          await i18n.changeLanguage(storedLang);
        }

        // 2. Ajoutez ici d'autres chargements nécessaires (fausses secondes d'attente si besoin)
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Indique que l'application est prête
        setAppIsReady(true);
        // Masque immédiatement le splash screen natif d'Expo
        await SplashScreen.hideAsync().catch(() => {});
      }
    };

    prepareApp();
  }, []);

  // Définition dynamique des couleurs selon le mode sombre ou clair
  const isDark = colorScheme === "dark";
  const backgroundColor = isDark ? "#000000" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#000000";

  // Choix du logo central selon le thème (basé sur votre app.json)
  const mainLogoSource = isDark
    ? require("../app/assets/icons/splash-icon-light.png")
    : require("../app/assets/icons/splash-icon-dark.png");

  // Rendu de l'écran Splash personnalisé tant que l'application n'est pas prête
  if (!appIsReady) {
    return (
      <Animated.View
        entering={FadeIn.duration(400)} // Apparition douce du contenu personnalisé
        exiting={FadeOut.duration(500)} // Disparition en fondu vers l'application
        style={[styles.container, { backgroundColor }]}
        // Déclenche l'affichage de l'application principale une fois le fondu de sortie terminé
        onLayout={() => {
          if (appIsReady) {
            setTimeout(() => setAnimationFinished(true), 500);
          }
        }}
      >
        {/* Conteneur logo principal */}
        <View style={styles.centerContainer}>
          <Image
            source={mainLogoSource}
            style={styles.mainLogo}
            resizeMode="contain"
          />
        </View>

        {/* Bloc de branding en bas */}
        <View style={styles.bottomContainer}>
          <Text style={[styles.smallText, { color: textColor }]}>
            from 
          </Text>
          {/* <Text style={[styles.brandingText, { color: textColor }]}>
            Genesys In
          </Text> */}
          <Image
            source={require("../assets/images/genesys.png")}
            style={styles.smallLogo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>
    );
  }

  // Rendu normal de l'application une fois le chargement terminé
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GluestackUIProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <QueryClientProvider client={queryClient}>
                <Stack screenOptions={{ headerShown: false }} />
              </QueryClientProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </GluestackUIProvider>
      </PersistGate>
      <Toast config={toastConfig} />
    </Provider>
  );
}

// Styles pour positionner les éléments
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20, // Ajuste la distance du logo par rapport au bord inférieur de l'écran
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  mainLogo: {
    width: 300,
    height: 300,
  },
  bottomContainer: {
    flexDirection: "column",
    alignItems: "center",
    // gap: 4, // Espace entre le texte "Genesys In" et le logo
  },
  brandingText: {
    fontSize: 18,
    fontWeight: "600",
  },
  smallText: {
    fontSize: 12,
    fontWeight: "300",
    // paddingTop: -500
  },
  smallLogo: {
    width: 48,
    height: 48,
  },
});
