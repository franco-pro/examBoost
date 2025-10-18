import { Stack } from 'expo-router';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { Provider } from 'react-redux';
import OnlineCompetitionRedux from './hooks/online-competition.redux';
const { store } = OnlineCompetitionRedux()

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GluestackUIProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </GluestackUIProvider>
    </Provider>
  )
}