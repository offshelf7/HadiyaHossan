import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  // load translation using http -> see /public/locales
  .use(Backend)
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",
    supportedLngs: ["en", "es", "fr", "am", "om", "ti"],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ["path", "cookie", "navigator"],
      lookupFromPathIndex: 0,
      caches: ["cookie"],
    },
  });

export default i18n;
