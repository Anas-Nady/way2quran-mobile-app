import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import getName from "../helpers/getName";
import { getCurrentLanguage } from "../services/i18next";
import { ScreenDimensionsContext } from "../contexts/ScreenDimensionsProvider";
import { useContext } from "react";

export default function QuranPDFCard({ quran }) {
  const { screenWidth: width } = useContext(ScreenDimensionsContext);

  const handleDownloadPDF = () => {
    Linking.openURL(quran.downloadLink);
  };

  const quranName = getName(quran);

  const cardWidth = width > 768 ? width * 0.4 : width * 0.9; // 0.45 for tablet, 0.9 for mobile

  return (
    <TouchableOpacity
      onPress={() => handleDownloadPDF()}
      style={{ width: cardWidth }}
      className="my-2"
    >
      <View className="flex-col border border-gray-600 quran-pdf">
        <View className="items-center justify-center flex-1 p-2 overflow-hidden">
          <Image
            source={{
              uri: quran.img,
            }}
            resizeMode="cover"
            style={{ width: "100%", height: 540 }}
          />
        </View>
        <Text className="py-2 text-xl font-semibold text-center text-white bg-gray-600 line-clamp-1">
          {quranName}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
