import { Stack } from 'expo-router';
import {Provider, useSelector} from "react-redux"

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { useEffect, useState } from 'react';
import { getItem } from './utils/asyncStorage';
import { store,persistor, RootState } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from '@/components/personalizedComponents/appNavigator';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GluestackUIProvider>
          <AppNavigator/>
        </GluestackUIProvider>
      </PersistGate>
    </Provider>
  );
}