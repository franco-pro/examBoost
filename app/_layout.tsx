import { Stack } from 'expo-router';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { store } from '@/src/redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';

const queryClient = new QueryClient();

export default function RootLayout(){
    return(
        <Provider store={store}>
            <GluestackUIProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <QueryClientProvider client={queryClient}>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(tabs)" />
                        </Stack>
                    </QueryClientProvider>
                </GestureHandlerRootView>
            </GluestackUIProvider>
        </Provider>
    )
}