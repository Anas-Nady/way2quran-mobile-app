import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import recitations from "./../constants/recitations";
import { useNavigation } from "@react-navigation/native";
import getName from "./../helpers/getName";
import HeadingScreen from "./../components/HeadingScreen";
import GoBackButton from "../components/ui/GoBackButton";

export default function Recitations() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const renderItem = ({ item: rec }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Reciters", { recitationSlug: rec.slug })
      }
      key={rec.slug}
      className="flex-row items-center justify-center w-[95%] mx-auto p-3 bg-gray-800 border border-gray-700 rounded-lg"
    >
      <View className="overflow-hidden ">
        <Text className="text-lg font-semibold text-slate-50">
          {getName(rec)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => {
    return (
      <View>
        <GoBackButton />
        <HeadingScreen headingTxt={t("frequentRecitations")} />
      </View>
    );
  };

  return (
    <View className="flex-1 w-full bg-gray-800">
      <FlatList
        data={recitations.slice(3)}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        keyExtractor={(item) => item.slug}
        contentContainerStyle={{
          flexGrow: 1,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
