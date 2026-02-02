import { Linking, Platform } from 'react-native';

export async function rateApp(): Promise<boolean> {
  try {
    // TODO: remplacer par les vrais IDs store si disponibles
    const ANDROID_PACKAGE = 'com.examBoost.app';
    const IOS_APP_ID = '0000000000';

    const url = Platform.select({
      android: `market://details?id=${ANDROID_PACKAGE}`,
      ios: `itms-apps://apps.apple.com/app/id${IOS_APP_ID}?action=write-review`,
      default: undefined,
    });

    if (!url) return false;

    const can = await Linking.canOpenURL(url);
    if (!can) {
      // Fallback Android vers https
      if (Platform.OS === 'android') {
        const httpsUrl = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;
        await Linking.openURL(httpsUrl);
        return true;
      }
      return false;
    }

    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}
