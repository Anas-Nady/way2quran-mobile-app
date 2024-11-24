import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";
import getName from "../../helpers/getName";
import { flexDirection } from "../../helpers/flexDirection";
import React from "react";

const SurahCard = ({ surah }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Surah", {
          surahNumber: surah.number,
        })
      }
      className={`${flexDirection()} px-3 py-4 mx-auto w-[90%] mb-2 border border-gray-600 rounded surah-card`}
    >
      <View className={`${flexDirection()} items-center gap-4 `}>
        <View
          style={{
            transform: [{ rotate: "45deg" }],
          }}
          className="flex-row items-center justify-center bg-green-600 w-9 h-9 "
        >
          <Text
            style={{
              transform: [{ rotate: "-45deg" }],
            }}
            className="block font-medium text-center text-white"
          >
            {surah.number}
          </Text>
        </View>
        <Text className="text-lg font-semibold text-slate-200">
          {getName(surah)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(SurahCard);
