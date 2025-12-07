import React, { createContext, ReactNode, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initI18n } from "@/lang/i18n";

interface LanguageContextProps {
  language: string;
  changeLanguage: (lang: string) => void;
}

export const LanguageContext = createContext<LanguageContextProps>({
  language: "fr",
  changeLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState("fr");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initI18n().then((_) => {
      setLanguage(i18n.language);
      setReady(true);
    });
  }, []);

  const changeLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem("lang", lang);
      setLanguage(lang);
    } catch (e) {
      console.log("Erreur lors du changement de langue :", e);
    }
  };

  if (!ready) return null; // on peut mettre un loader si besoin

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;