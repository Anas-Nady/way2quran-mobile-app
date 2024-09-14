import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";

export default function SurahCard({ surah }) {
  const navigation = useNavigation();

  return (
    <View className="w-full px-3 py-4 mb-2 border border-gray-300 rounded surah-card dark:border-gray-700">
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Surah", { surahNumber: surah.number })
        }
        className="flex-row-reverse items-center gap-4"
      >
        <View className="flex-row-reverse items-center justify-center rotate-45 bg-green-500 border rounded-sm w-9 h-9 dark:bg-green-600 border-slate-400 dark:border-gray-500 ">
          <Text className="block font-medium text-center text-white -rotate-45 dark:text-white">
            {surah.number}
          </Text>
        </View>
        <Text className="text-lg font-semibold text-gray-900 surah-name dark:text-slate-50">
          {surah.arabicName}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
