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

import { initI18n } from '@/lang/i18n';
import { useEffect, useState } from 'react';

const queryClient = new QueryClient();

export default function RootLayout() {
  const [ready, setReady] = useState(false)
  
  useEffect(() => {
    (async () => {
      await initI18n()
      setReady(true)
    })()
  }, [])
  if (!ready) return null
  return (
    <Provider store={store}>
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
    </Provider>
  );
}