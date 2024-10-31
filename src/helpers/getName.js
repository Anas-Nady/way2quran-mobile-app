import { getCurrentLanguage } from "../services/i18next";

const currentLang = getCurrentLanguage();

const getName = function (obj) {
  if (!obj) return "";

  if (currentLang === "en") {
    return obj.englishName;
  } else if (currentLang === "ar") {
    return obj.arabicName;
  }
  return "default name";
};

export default getName;
