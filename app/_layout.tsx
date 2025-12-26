import { Stack } from 'expo-router';
import { Provider } from 'react-redux';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from '@/components/personalizedComponents/appNavigator';
import { persistor, store } from '@/app/hooks/redux/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GluestackUIProvider>
          <AppNavigator />
        </GluestackUIProvider>
      </PersistGate>
    </Provider>
  );
}