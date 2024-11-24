import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

const AppTitle = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
      <View>
        <Text className="pt-1 mt-2.5 text-2xl text-secondary font-notoKufi">
          {t("wayTo")}
          <Text className="text-green-500"> {t("quran")}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AppTitle;
