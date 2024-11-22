import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { flexDirection } from "../helpers/flexDirection";
import { useTranslate } from "../helpers/i18nHelper";
import { useContext } from "react";
import { ScreenDimensionsContext } from "../contexts/ScreenDimensionsProvider";

const Footer = () => {
  const translate = useTranslate("Footer");
  const navigation = useNavigation();
  const { screenWidth, screenHeight } = useContext(ScreenDimensionsContext);

  const links = [
    { href: `AboutUs`, title: translate("aboutTitle") },
    { href: `ContactUs`, title: translate("contactTitle") },
  ];

  return (
    <View
      style={{
        width: screenWidth,
        height: screenHeight * 0.1 - 130,
        flex: 1,
        justifyContent: "flex-start",
      }}
      className=" w-full bg-gray-800 border-t-[2px] border-gray-600 py-3"
    >
      <View
        className={`${flexDirection()} flex-wrap items-center justify-center`}
      >
        {links.map((link) => (
          <TouchableOpacity
            key={link.href}
            onPress={() => navigation.navigate(link.href)}
          >
            <Text className="text-[19px] mx-3 font-[600] text-secondary">
              {link.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Footer;
