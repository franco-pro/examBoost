// app/components/LanguageToggle.tsx
import React, { useContext } from "react";
import { Button, View } from "react-native";
import { LanguageContext } from "@/app/context/LanguageProvider";
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function LanguageToggle() {
  const { changeLanguage, language } = useContext(LanguageContext);

  // Fonction pour basculer entre FR et EN
  const toggleLanguage = async() => {
  
  try {
    changeLanguage(language === "fr" ? "en" : "fr");  // change la langue dans i18next
   await AsyncStorage.setItem('lang', language === "fr" ? "en" : "fr"); // stocke la langue choisie
  } catch (e) {
    console.log('Error changing language:', e);
  }
}

  return (
    <View style={{ padding: 10 }}>
      <Button
        title={language === "fr" ? "EN" : "FR"}
        onPress={toggleLanguage}
        color="blue"
      />
    </View>
  );
}
