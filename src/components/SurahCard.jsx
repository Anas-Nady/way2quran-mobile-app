import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";
import getName from "../helpers/getName";
import { flexDirection } from "../helpers/flexDirection";
import { useContext } from "react";
import { ScreenDimensionsContext } from "../contexts/ScreenDimensionsProvider";

export default function SurahCard({ surah }) {
  const navigation = useNavigation();

  const { screenWidth: width } = useContext(ScreenDimensionsContext);

  return (
    <View
      style={{ width: width * 0.9 }}
      className="px-3 py-4 mx-auto mb-2 border border-gray-300 rounded surah-card dark:border-gray-600"
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Surah", {
            surahNumber: surah.number,
          })
        }
        className={`${flexDirection()} items-center gap-4`}
      >
        <View
          style={{
            transform: [{ rotate: "45deg" }],
          }}
          className="flex-row items-center justify-center bg-green-500 border w-9 h-9 dark:bg-green-600 border-slate-400 dark:border-gray-500 "
        >
          <Text
            style={{
              transform: [{ rotate: "-45deg" }],
            }}
            className="block font-medium text-center text-white dark:text-white"
          >
            {surah.number}
          </Text>
        </View>
        <Text className="text-lg font-semibold text-gray-900 surah-name dark:text-slate-50">
          {getName(surah)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
