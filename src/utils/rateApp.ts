import { Platform, Linking } from 'react-native';

// Configurez ces URLs via .env si possible
const APP_STORE_URL_IOS = process.env.EXPO_PUBLIC_APP_STORE_URL || '';
const PLAY_STORE_URL_ANDROID = process.env.EXPO_PUBLIC_PLAY_STORE_URL || '';
const WEB_STORE_URL = process.env.EXPO_PUBLIC_WEB_STORE_URL || '';

// Version sans dépendance à expo-store-review pour éviter les erreurs Metro sur web
export async function rateApp(): Promise<boolean> {
  const url = Platform.select({
    ios: APP_STORE_URL_IOS || WEB_STORE_URL,
    android: PLAY_STORE_URL_ANDROID || WEB_STORE_URL,
    default: WEB_STORE_URL || PLAY_STORE_URL_ANDROID || APP_STORE_URL_IOS,
  });

  if (!url) return false;
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}
