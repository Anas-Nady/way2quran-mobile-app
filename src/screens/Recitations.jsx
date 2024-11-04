import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import recitations from "./../constants/recitations";
import { useNavigation } from "@react-navigation/native";
import getName from "./../helpers/getName";
import HeadingScreen from "./../components/HeadingScreen";
import GoBackButton from "../components/ui/GoBackButton";

export default function Recitations() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 w-full p-4 mx-auto bg-gray-800"
    >
      <GoBackButton />
      <HeadingScreen headingTxt={t("frequentRecitations")} />
      <View className="flex-col items-center justify-center w-full gap-3 py-7 recitation-card">
        {recitations.slice(3).map((rec) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Reciters", { recitationSlug: rec.slug })
            }
            key={rec.slug}
            className="flex-row items-center w-[90%] justify-center p-3 border rounded-lg bg-gray-800 border-gray-700"
          >
            <View className="overflow-hidden ">
              <Text className="text-xl font-semibold text-slate-50">
                {getName(rec)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
