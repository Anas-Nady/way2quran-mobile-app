import { View, ScrollView } from "react-native";
import GoBackButton from "../components/ui/GoBackButton";
import HeadingScreen from "../components/HeadingScreen";
import { useTranslation } from "react-i18next";
import QuranPDFCard from "../components/QuranPDFCard";
import listQuranPdf from "./../constants/listQuranPdf";

export default function DownloadQuranPDF() {
  const { t } = useTranslation();

  return (
    <ScrollView
      className="flex-1 w-full p-4 bg-gray-800"
      showsVerticalScrollIndicator={false}
    >
      <GoBackButton />
      <View className="flex-col items-center justify-center mx-auto w-[90%]">
        <View className="flex-col flex-wrap items-center justify-center">
          <HeadingScreen headingTxt={t("downloadQuranPdf")} />
        </View>
        <View className="flex-col flex-wrap justify-between">
          {listQuranPdf.map((quran) => (
            <QuranPDFCard quran={quran} key={quran.slug} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
