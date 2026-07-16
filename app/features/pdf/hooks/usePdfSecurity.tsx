import { useCallback, useEffect } from "react";
import * as ScreenCapture from "expo-screen-capture";
import { Alert } from "react-native";

export function usePdfSecurity() {
  /**
   * Active les protections
   */
  const enableSecurity = useCallback(async () => {
    try {
      await ScreenCapture.preventScreenCaptureAsync();
    } catch (e) {
      console.log("Erreur preventScreenCapture :", e);
    }
  }, []);

  /**
   * Désactive les protections
   */
  const disableSecurity = useCallback(async () => {
    try {
      await ScreenCapture.allowScreenCaptureAsync();
    } catch (e) {
      console.log("Erreur allowScreenCapture :", e);
    }
  }, []);

  /**
   * Capture détectée (iOS principalement)
   */
  useEffect(() => {
    const subscription = ScreenCapture.addScreenshotListener(() => {
      Alert.alert(
        "Capture détectée",
        "Les captures d'écran des documents ExamBoost sont interdites.",
      );
    });

    return () => {
      subscription.remove();
    };
  }, []);

  /**
   * Active automatiquement
   */
  useEffect(() => {
    enableSecurity();

    return () => {
      disableSecurity();
    };
  }, [enableSecurity, disableSecurity]);

  return {
    enableSecurity,
    disableSecurity,
  };
}
