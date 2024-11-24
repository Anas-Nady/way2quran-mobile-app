import { useContext } from "react";
import { View, FlatList } from "react-native";
import HeadingScreen from "../components/HeadingScreen";
import { useTranslation } from "react-i18next";
import GoBackButton from "../components/ui/GoBackButton";
import SurahsList from "../constants/surahsList";
import SurahCard from "../components/Surah/SurahCard";
import { ScreenDimensionsContext } from "../contexts/ScreenDimensionsProvider";

export default function Mushaf() {
  const { t } = useTranslation();
  const { screenWidth: width } = useContext(ScreenDimensionsContext);

  const renderHeader = () => {
    return (
      <View>
        <GoBackButton />
        <HeadingScreen headingTxt={t("mushaf")} />
      </View>
    );
  };

  const numColumns = width > 600 ? 2 : 1;
  return (
    <View className="flex-1 w-full bg-gray-800">
      <FlatList
        data={SurahsList}
        keyExtractor={(item) => item.slug}
        renderItem={({ item }) => <SurahCard surah={item} />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{
          gap: 8,
          paddingBottom: 16,
          backgroundColor: "#1f2937",
          flexGrow: 1,
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}
        key={numColumns}
        numColumns={numColumns}
      />
    </View>
  );
}
