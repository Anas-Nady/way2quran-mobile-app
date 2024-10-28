import { useState, useMemo } from "react";
import { View, ScrollView } from "react-native";
import HeadingScreen from "../components/HeadingScreen";
import { useTranslation } from "react-i18next";
import GoBackButton from "../components/ui/GoBackButton";
import SurahsList from "../constants/surahsList";
import SearchInput from "../components/ui/SearchInput";
import SurahCard from "../components/SurahCard";

export default function Surahs() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSurahs = useMemo(() => {
    if (!searchQuery?.trim()) return SurahsList;

    const regexArabic = new RegExp(searchQuery.replace(/ا/g, "[اأإآ]"), "i");

    return SurahsList.filter((surah) => regexArabic.test(surah.arabicName));
  }, [searchQuery]);

  const handleTextDebounce = (text) => {
    setSearchQuery(text);
  };

  return (
    <View className="flex-1 w-full bg-white dark:bg-gray-800">
      <GoBackButton />
      <ScrollView>
        <View className="items-center justify-center flex-1 mx-auto w-[90%]">
          <HeadingScreen headingTxt={t("quranicSurahs")} />
          <SearchInput handleTextDebounce={handleTextDebounce} />
          <View className="flex-row-reverse flex-wrap items-center my-2">
            {filteredSurahs.map((surah) => (
              <SurahCard key={surah.slug} surah={surah} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
