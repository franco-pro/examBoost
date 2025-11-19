import { Stack } from 'expo-router';
import { store } from './hooks/redux/store';

import { LanguageProvider } from './context/LanguageProvider';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../lang/i18n"
import '@/global.css';
import { Provider } from 'react-redux';
import { SafeAreaView } from 'react-native';


export default function RootLayout() {
  return (
    <Provider store={store}>
        <LanguageProvider>
        <GestureHandlerRootView>

      <GluestackUIProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </GluestackUIProvider>
        </GestureHandlerRootView>

      </LanguageProvider>

    </Provider>
  )

// export default function RootLayout(){
//     return(
//             <SafeAreaView className="flex-1 bg-gray-50">
//         <GluestackUIProvider>
//                 <Stack screenOptions={{ headerShown: false }}>
//                     <Stack.Screen name="(tabs)" />
//                 </Stack>
//         </GluestackUIProvider>
//         </SafeAreaView>
//     )
}