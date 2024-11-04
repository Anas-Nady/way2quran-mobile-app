import { View, Text, TouchableOpacity } from "react-native";
import AppTitle from "./AppTitle";
import { useNavigation } from "@react-navigation/native";
import { flexDirection } from "../helpers/flexDirection";
import { useTranslate } from "../helpers/i18nHelper";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const translate = useTranslate("Footer");
  const navigation = useNavigation();

  const links = [
    { href: `AboutUs`, title: translate("aboutTitle") },
    { href: `ContactUs`, title: translate("contactTitle") },
  ];

  return (
    <View className=" w-full bg-gray-800 border-t-[2px] border-gray-600 py-5">
      <View>
        <AppTitle />
        <View
          className={`${flexDirection()} flex-wrap items-center justify-center gap-5 pb-5 pt-7`}
        >
          {links.map((link) => (
            <TouchableOpacity
              key={link.href}
              onPress={() => navigation.navigate(link.href)}
            >
              <Text className="text-xl font-medium text-orange-500">
                {link.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View className="mx-auto">
        <Text className="font-medium text-md text-slate-300">
          {translate("allRightsReserved")} © {currentYear}
        </Text>
      </View>
    </View>
  );
};

export default Footer;
