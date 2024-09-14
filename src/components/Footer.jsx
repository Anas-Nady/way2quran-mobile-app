import { View, Text, TouchableOpacity } from "react-native";
import AppTitle from "./AppTitle";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const links = [
    { href: `Surahs`, title: t("Footer.quranicSurahs") },
    { href: `AboutUs`, title: t("Footer.aboutTitle") },
    { href: `ContactUs`, title: t("Footer.contactTitle") },
  ];

  return (
    <View className="bg-white w-full dark:bg-gray-800 border-t-[2px] border-gray-300 dark:border-gray-600 py-5">
      <View className="">
        <View className="">
          <AppTitle />
        </View>
        <View className="flex-row-reverse flex-wrap items-center justify-center gap-5 pb-5 pt-7">
          {links.map((link) => (
            <TouchableOpacity
              key={link.href}
              onPress={() => navigation.navigate(link.href)}
            >
              <Text className="text-lg font-medium text-orange-500 dark:text-orange-500">
                {link.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View className="mx-auto">
        <Text className="font-medium text-gray-700 text-md dark:text-slate-300">
          {t("Footer.allRightsReserved")} © {currentYear}
        </Text>
      </View>
    </View>
  );
};

export default Footer;
