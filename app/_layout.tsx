import { Stack } from 'expo-router';
import { LanguageProvider } from './context/LanguageProvider';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../lang/i18n"
import '@/global.css';
import { SafeAreaView } from 'react-native';

export default function RootLayout(){
    return(
        <LanguageProvider>
            <SafeAreaView className="flex-1 bg-gray-50">
            <GestureHandlerRootView>
        <GluestackUIProvider>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                </Stack>
        </GluestackUIProvider>
        </GestureHandlerRootView>
        </SafeAreaView>
        </LanguageProvider>
    )
}