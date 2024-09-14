import { View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTranslate } from "./../../helper/i18nHelper";

export default function TopReciterBadge() {
  const translate = useTranslate("ReciterScreen");

  return (
    <View className={`flex-row-reverse justify-center items-center gap-1 my-1`}>
      <AntDesign name="star" size={20} color="yellow" />
      <Text
        className={`text-lg font-semibold text-gray-800 dark:text-slate-50`}
      >
        {translate("topReciters")}
      </Text>
    </View>
  );
}
