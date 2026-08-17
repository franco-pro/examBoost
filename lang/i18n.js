import i18n from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initReactI18next } from "react-i18next";
import transactionEN from "./locales/En/Transaction.json";
import transactionFR from "./locales/Fr/Transaction.json";
import competitionEn from "./locales/En/Competition.json";
import competitionFr from "./locales/Fr/Competition.json";
import notificationEN from "./locales/En/notification.json";
import notificationFR from "./locales/Fr/notification.json";
import onboardingFR from "./locales/Fr/onboarding.json";
import onboardingEN from "./locales/En/onboarding.json";
import homeEN from "./locales/En/home.json";
import homeFr from "./locales/Fr/home.json";
import settingFR from "./locales/Fr/Setting.json";
import settingEN from "./locales/En/Setting.json";
import depositEN from "./locales/En/deposit.json";
import depositFR from "./locales/Fr/deposit.json";
import examenFR from "./locales/Fr/Examen.json";
import examenEN from "./locales/En/Examen.json";
import registerEN from "./locales/En/register.json";
import registerFR from "./locales/Fr/register.json";
import loginFr from "./locales/Fr/login.json";
import loginEn from "./locales/En/login.json";
import teacherFr from "./locales/Fr/teacher.json"
import teacherEn from "./locales/En/teacher.json"
import subscribeFR from "./locales/Fr/subscribe.json"
import subscribeEN from "./locales/En/subscribe.json"

const resources = {
  en: {
    transaction: transactionEN,
    competition: competitionEn,
    home: homeEN,
    setting: settingEN,
    notification: notificationEN,
    deposit: depositEN,
    examen: examenEN,
    register: registerEN,
    onboarding: onboardingEN,
    login: loginEn,
    teacher: teacherEn,
    subscribe: subscribeEN
  },
  fr: {
    transaction: transactionFR,
    competition: competitionFr,
    home: homeFr,
    setting: settingFR,
    notification: notificationFR,
    deposit: depositFR,
    examen: examenFR,
    register: registerFR,
    onboarding: onboardingFR,
    login: loginFr,
    teacher: teacherFr,
    subscribe: subscribeFR
  },
};

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async (callback) => {
    try {
      const savedLanguage = await AsyncStorage.getItem("language");
      if (savedLanguage) {
        return callback(savedLanguage);
      }
      callback("fr");
    } catch (error) {
      callback("fr");
    }
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    lng: "fr",
    fallbackLng: "en",
    resources,
    ns: [
      "transaction",
      "competition",
      "home",
      "setting",
      "login",
      "register",
      "onboarding",
    ],
    defaultNS: "home",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
