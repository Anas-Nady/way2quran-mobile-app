import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslate } from "../../helper/i18nHelper";
import { AntDesign } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

export default function Menu({ closeMenu }) {
  const navigation = useNavigation();
  const translate = useTranslate("Navbar");
  const { colorScheme } = useColorScheme();

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
          className="flex-row-reverse my-2"
          key={i}
        >
          <Text className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {link.label}
          </Text>
        </TouchableOpacity>
      ))}
      {/* Search icon */}
      <TouchableOpacity
        onPress={() => handleNavigation("Search", {})}
        className="flex-row-reverse px-2 py-1 bg-white border border-gray-400 rounded dark:bg-gray-700 dark:border-gray-500"
      >
        <AntDesign
          name="search1"
          size={30}
          color={colorScheme === "dark" ? "white" : "#4b5563"}
        />
      </TouchableOpacity>
    </View>
  );
}
