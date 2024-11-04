import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslate } from "../../helpers/i18nHelper";
import { flexDirection } from "../../helpers/flexDirection";

export default function Menu({ closeMenu }) {
  const navigation = useNavigation();
  const translate = useTranslate("Navbar");

  const handleNavigation = (route, params) => {
    navigation.navigate(route, params);
    closeMenu();
  };

  const menuLinks = [
    {
      label: translate("fullQuran"),
      routeName: "Reciters",
      params: { recitationSlug: "full-holy-quran" },
    },
    {
      label: translate("frequentRecitations"),
      routeName: "Recitations",
      params: {},
    },
    {
      label: translate("variousRecitations"),
      routeName: "Reciters",
      params: { recitationSlug: "various-recitations" },
    },
    {
      label: translate("downloadQuran"),
      routeName: "DownloadQuranPDF",
      params: {},
    },
  ];

  return (
    <View>
      {menuLinks.map((link, i) => (
        <TouchableOpacity
          onPress={() => handleNavigation(link.routeName, link.params)}
          className={`${flexDirection()} my-2`}
          key={i}
        >
          <Text className="text-lg font-bold text-gray-200">{link.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
