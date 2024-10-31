import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslate } from "../helpers/i18nHelper.js";
import { flexDirection } from "../helpers/flexDirection.js";

export default function TabBar() {
  const navigation = useNavigation();
  const translate = useTranslate("TabBar");

  const tabsLinks = [
    { label: translate("home"), routeName: "Home", icon: "home" },
    {
      label: translate("playlist"),
      routeName: "Playlist",
      icon: "playlist-add",
    },
    {
      label: translate("favorites"),
      routeName: "Favorites",
      icon: "favorite",
    },
    {
      label: translate("mushaf"),
      routeName: "Surahs",
      icon: "menu-book",
    },
    {
      label: translate("prayerTimes"),
      routeName: "PrayerTimes",
      icon: "access-time",
    },
  ];

  return (
    <View className="w-[90%] bg-white dark:bg-gray-700 rounded-full mx-auto py-1 px-4">
      <View className={`${flexDirection()} items-center justify-between mx-1`}>
        {tabsLinks.map((tab, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => navigation.navigate(tab.routeName)}
          >
            <View className="flex-col items-center justify-center">
              <MaterialIcons name={tab.icon} size={24} color="#22c55e" />
              <Text className="font-semibold text-green-500 text-md">
                {tab.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
