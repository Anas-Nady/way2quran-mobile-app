import { getCurrentLanguage } from "../services/i18next";

export const flexDirection = () => {
  return getCurrentLanguage() === "ar" ? "flex-row-reverse" : "flex-row";
};

export const textDirection = () => {
  return getCurrentLanguage() === "ar" ? "text-right" : "text-left";
};
