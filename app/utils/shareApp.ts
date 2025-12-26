import { Platform, Share } from 'react-native';

export async function shareApp(): Promise<boolean> {
  try {
    const ANDROID_PACKAGE = 'com.examBoost.app';
    const IOS_APP_ID = '0000000000';

    const url = Platform.select({
      android: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`,
      ios: `https://apps.apple.com/app/id${IOS_APP_ID}`,
      default: 'https://example.com',
    });

    const message = `Télécharge ExamBoost : ${url}`;
    const res = await Share.share({ message, url });

    // Sur iOS, Share.share peut renvoyer undefined selon la plateforme
    return !!res;
  } catch {
    return false;
  }
}
