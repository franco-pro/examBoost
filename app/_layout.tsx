import { Stack } from 'expo-router';
import { LanguageProvider } from './context/LanguageProvider';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import "../lang/i18n"
import '@/global.css';

export default function RootLayout(){
    return(
        <LanguageProvider>
        <GluestackUIProvider>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                </Stack>
        </GluestackUIProvider>
        </LanguageProvider>
    )
}