import { useState, useMemo, useContext } from "react";
import { View, ScrollView } from "react-native";
import HeadingScreen from "../components/HeadingScreen";
import { useTranslation } from "react-i18next";
import GoBackButton from "../components/ui/GoBackButton";
import SurahsList from "../constants/surahsList";
import SearchInput from "../components/ui/SearchInput";
import SurahCard from "../components/SurahCard";
import { flexDirection } from "../helpers/flexDirection";
import { ScreenDimensionsContext } from "../contexts/ScreenDimensionsProvider";

export default function Mushaf() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const { screenWidth: width } = useContext(ScreenDimensionsContext);

  const filteredSurahs = useMemo(() => {
    if (!searchQuery?.trim()) return SurahsList;

    const regexArabic = new RegExp(searchQuery.replace(/ا/g, "[اأإآ]"), "i");

    return SurahsList.filter(
      (surah) =>
        regexArabic.test(surah.arabicName) ||
        regexArabic.test(surah.englishName)
    );
  }, [searchQuery]);

  const handleTextDebounce = (text) => {
    setSearchQuery(text);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 w-full p-4 mx-auto bg-gray-800"
    >
      <GoBackButton />
      <HeadingScreen headingTxt={t("mushaf")} />
      <View className="items-center justify-center flex-1">
        <SearchInput handleTextDebounce={handleTextDebounce} />
        <View
          className={`${flexDirection()} flex-wrap items-center gap-2 my-1`}
        >
          {filteredSurahs.map((surah) => (
            <SurahCard key={surah.slug} surah={surah} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
