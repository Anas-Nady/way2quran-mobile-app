import { getCurrentLanguage } from "../services/i18next";

export const currentLanguage = getCurrentLanguage();
export const isRTL = currentLanguage === "ar";

export const flexDirection = () => {
  return "flex-row";
};

export const textDirection = () => {
  return "text-left";
};
