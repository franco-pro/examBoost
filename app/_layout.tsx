import { Stack } from 'expo-router';
import { store } from './hooks/redux/store';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Provider } from 'react-redux';
import "../lang/i18n";
import { LanguageProvider } from './context/LanguageProvider';


export default function RootLayout() {
  const toastConfig = {
      success: (props: any) => (
        <BaseToast
          {...props}
          style={{ borderLeftColor: 'green' }}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          text1Style={{
            fontSize: 15,
            fontWeight: '400',
            flexWrap: "wrap",
          }}
          text2Style={{
            fontSize: 18,
            fontWeight: '400',
            flexWrap: "wrap",

          }}

          text1NumberOfLines={0}
          text2NumberOfLines={0}
        />
      ),
      error: (props: any) => (
        <ErrorToast
        {...props}
        style={{ maxWidth: "90%",  borderLeftColor: 'red'}}
        text1Style={{
          fontSize: 17,
          flexWrap: "wrap",
        }}
        text2Style={{
          fontSize: 18,
          color: "red",
          flexWrap: "wrap",
        }}
        text1NumberOfLines={1}
        text2NumberOfLines={10}
      />
      ),
      // Add more custom types as needed
    };
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

      <Toast config={toastConfig}/>
      
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