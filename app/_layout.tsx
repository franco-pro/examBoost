import { Stack } from 'expo-router';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Provider } from 'react-redux';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from '@/components/personalizedComponents/appNavigator';
import { persistor, store } from '@/app/hooks/redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageProvider } from './context/LanguageProvider';

const queryClient = new QueryClient();

// AsyncStorage.clear();
export default function RootLayout() {
  return (
    <Provider store={store}>
      <LanguageProvider>
       <PersistGate persistor={persistor}>
        <GluestackUIProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
              {/* <AppNavigator /> */}
              <Stack screenOptions={{ headerShown: false }} />
            </QueryClientProvider>
          </GestureHandlerRootView>
        </GluestackUIProvider>
      </PersistGate>
     </LanguageProvider>
    </Provider>
  );
}