import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enUS from "../locales/en-US/translation.json"
import ptBR from "../locales/pt-BR/translation.json"
import ja from "../locales/ja/translation.json";

// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

i18n
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    lng: "en-US",
    fallbackLng: "en-US",
    ns: ["translation"],
    defaultNS: "translation",
    resources: {
      "en-US": {
        translation: enUS
      },
      "ja": {
        translation: ja
      },
      "pt-BR": {
        translation: ptBR
      }
    },
    react: {
      wait: true,
    },
  });

export default i18n;
