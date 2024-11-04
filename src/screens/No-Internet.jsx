import { useEffect } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useTranslate } from "./../helpers/i18nHelper.js";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function NoInternetScreen() {
  const { width } = useWindowDimensions();
  const translate = useTranslate("NoInternetScreen");
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        navigation.navigate("Home");
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const fontSize = width < 375 ? "text-xl" : "text-3xl";
  const iconSize = width < 375 ? 60 : 80;

  return (
    <View className="items-center justify-center flex-1 p-5 bg-gray-900">
      <View className="flex-col items-center py-6">
        <Ionicons
          name="cloud-offline"
          size={iconSize}
          className="my-5"
          color={"white"}
        />
        <Text
          className={`${fontSize} font-bold mb-2.5 text-center text-gray-200`}
        >
          {translate("title")}
        </Text>
        <Text className="mb-5 text-base text-center text-gray-400">
          {translate("message")}
        </Text>
      </View>
    </View>
  );
}
