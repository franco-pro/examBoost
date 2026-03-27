import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import transactionEN from "./locales/En/Transaction.json";
import transactionFR from "./locales/Fr/Transaction.json";
import competitionEn from "./locales/En/Competition.json";
import competitionFr from "./locales/Fr/Competition.json";
import homeEN from "./locales/En/home.json";
import homeFr from "./locales/Fr/home.json";

const resources = {
  en: {
    transaction: transactionEN,
    competition: competitionEn,
    home: homeEN,
  },
  fr: {
    transaction: transactionFR,
    competition: competitionFr,
    home: homeFr,
  },
};

// Fonction async pour initialiser i18n avec la langue sauvegardée
i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: "fr",
  fallbackLng: "en",
  resources,
  ns: ["transaction", "competition", "home"],
  defaultNS: "home",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
