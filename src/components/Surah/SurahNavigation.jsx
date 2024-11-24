import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { flexDirection } from "../../helpers/flexDirection";
import getName from "../../helpers/getName";
import surahs from "../../constants/surahs";

const SurahNavigation = ({ surahNumber }) => {
  const navigation = useNavigation();
  const isFirstSurah = surahNumber === 1;
  const isLastSurah = surahNumber === 114;

  const renderButton = (type, targetSurah, disabled) => {
    const isPrevious = type === "previous";
    const arrowName = isPrevious ? "arrowright" : "arrowleft";
    const surahName =
      getName(surahs[targetSurah]) || (isPrevious ? "" : "Next Surah");

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(targetSurah)}
        disabled={disabled}
        className={`${flexDirection()} ${
          disabled ? "invisible" : "border border-gray-500"
        } items-center justify-center px-2 py-2 rounded`}
      >
        {isPrevious && (
          <AntDesign
            name={arrowName}
            size={22}
            color={disabled ? "transparent" : "gray"}
          />
        )}
        <Text className="text-lg font-medium text-slate-200">{surahName}</Text>
        {!isPrevious && (
          <AntDesign
            name={arrowName}
            size={22}
            color={disabled ? "transparent" : "gray"}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      className={`${flexDirection()} w-[90%] mx-auto items-center justify-between mt-3`}
    >
      {renderButton("previous", surahNumber - 1, isFirstSurah)}
      {renderButton("next", surahNumber + 1, isLastSurah)}
    </View>
  );
};

export default SurahNavigation;
