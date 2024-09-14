import { View, ScrollView } from "react-native";
import GoBackButton from "../components/ui/GoBackButton";
import HeadingScreen from "../components/HeadingScreen";
import { useTranslation } from "react-i18next";
import QuranPDFCard from "../components/QuranPDFCard";
import listQuranPdf from "./../constants/listQuranPdf";

export default function DownloadQuranPDF() {
  const { t } = useTranslation();

  return (
    <>
      <GoBackButton />
      <ScrollView className="flex-1 w-full bg-white dark:bg-gray-800">
        <View className="flex-col items-center justify-center mx-auto w-[90%]">
          <View className="flex-col flex-wrap items-center justify-center">
            <HeadingScreen headingTxt={t("downloadQuranPdf")} />
          </View>
          <View className="flex-row flex-wrap justify-between">
            {listQuranPdf.map((quran) => (
              <QuranPDFCard quran={quran} key={quran.slug} />
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
