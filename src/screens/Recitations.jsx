import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import recitations from "./../constants/recitations";
import { useNavigation } from "@react-navigation/native";
import { getCurrentLanguage } from "./../services/i18next";
import getName from "./../helper/getName";
import HeadingScreen from "./../components/HeadingScreen";
import GoBackButton from "../components/ui/GoBackButton";

export default function Recitations() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View className="flex-1 w-full bg-white dark:bg-gray-800">
      <ScrollView showsVerticalScrollIndicator={false}>
        <GoBackButton />
        <HeadingScreen headingTxt={t("frequentRecitations")} />
        <View className="flex-col items-center justify-center w-full gap-3 py-7 recitation-card">
          {recitations.slice(3).map((rec) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Reciters", { recitationSlug: rec.slug })
              }
              key={rec.slug}
              className="flex items-center w-[90%] justify-center p-3 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700"
            >
              <View className="overflow-hidden ">
                <Text className="text-xl font-semibold text-gray-700 dark:text-slate-50">
                  {getName(rec, getCurrentLanguage())}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
