import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

const AppTitle = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
      <View className="self-center -tracking-wider whitespace-nowrap dark:text-white">
        <Text className="text-3xl text-orange-500 dark:text-orange-500">
          {t("wayTo")}
          <Text className="font-semibold text-green-500 dark:text-green-500">
            {" "}
            {t("quran")}
          </Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AppTitle;
