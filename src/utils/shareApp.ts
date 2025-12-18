import { Platform, Share, Linking } from 'react-native';

const SHARE_TITLE = 'ExamBoost';
const SHARE_TEXT = "Découvre l'app ExamBoost";
const SHARE_URL = process.env.EXPO_PUBLIC_SHARE_URL || 'https://examboost.app';

export async function shareApp(): Promise<boolean> {
  try {
    if (Platform.OS === 'web') {
      // @ts-ignore Web Share API si dispo
      if (typeof navigator !== 'undefined' && navigator?.share) {
        try {
          // @ts-ignore
          await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: SHARE_URL });
          return true;
        } catch {}
      }
      // Fallback web: ouvrir la page
      await Linking.openURL(SHARE_URL);
      return true;
    }

    // Natif: API Share
    const result = await Share.share({
      title: SHARE_TITLE,
      message: `${SHARE_TEXT} ${SHARE_URL}`,
      url: SHARE_URL,
    });
    return result.action === Share.sharedAction || result.action === Share.dismissedAction;
  } catch {
    return false;
  }
}
