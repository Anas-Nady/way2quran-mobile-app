import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { flexDirection } from "../helpers/flexDirection";
import { useTranslate } from "../helpers/i18nHelper";

const Footer = () => {
  const translate = useTranslate("Footer");
  const navigation = useNavigation();

  const links = [
    { href: `AboutUs`, title: translate("aboutTitle") },
    { href: `ContactUs`, title: translate("contactTitle") },
  ];

  return (
    <View className=" w-full bg-gray-800 border-t-[2px] border-gray-600 py-5">
      <View
        className={`${flexDirection()} flex-wrap items-center justify-center gap-5 `}
      >
        {links.map((link) => (
          <TouchableOpacity
            key={link.href}
            onPress={() => navigation.navigate(link.href)}
          >
            <Text className="text-[19px] font-[600] text-secondary">
              {link.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Footer;
