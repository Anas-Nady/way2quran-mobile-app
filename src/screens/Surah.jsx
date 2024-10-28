import React, { useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import surahs from "./../constants/surahs";
import HeadingScreen from "../components/HeadingScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import GoBackButton from "../components/ui/GoBackButton";

export default function Surah() {
  const route = useRoute();
  const navigation = useNavigation();
  const scrollViewRef = useRef();
  const surahNumber = parseInt(route.params?.surahNumber);
  const surahInfo = surahs[surahNumber];

  useEffect(() => {
    // Scroll to top when the component mounts or updates
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [surahNumber]);

  const navigateToSurah = (number) => {
    if (number >= 1 && number <= 114) {
      navigation.navigate("Surah", { surahNumber: number });
    }
  };

  return (
    <>
      <GoBackButton />
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 w-full px-4 bg-white dark:bg-gray-800"
      >
        <HeadingScreen headingTxt={surahInfo?.arabicName} />

        {/* Surah Info */}
        <View className="flex-col flex-1 w-[90%] py-7 mx-auto border-b-2 border-gray-400 dark:border-gray-700">
          {surahInfo.verses.map((verse) => (
            <View
              key={verse.id}
              className="w-full pt-5 my-2 border-b-2 border-gray-300 dark:border-gray-700"
            >
              <Text className="mb-1 text-2xl font-medium leading-normal text-gray-700 dark:text-gray-200 font-arabic">
                {verse.textArabic}{" "}
                <Text className={`font-verses text-5xl`}>{verse.id}</Text>
              </Text>
            </View>
          ))}

          {/* Navigation Buttons */}
          <View className="flex-row-reverse items-center justify-between my-5">
            {/* Previous Surah */}
            <TouchableOpacity
              onPress={() => navigateToSurah(surahNumber - 1)}
              disabled={surahNumber === 1}
              className={`${
                surahNumber === 1
                  ? "invisible"
                  : "flex-row-reverse border border-gray-300 dark:border-gray-500"
              } items-center justify-center px-2 py-2 rounded`}
            >
              <AntDesign
                name="arrowright"
                size={24}
                color={surahNumber === 1 ? "transparent" : "gray"}
              />
              <Text className="text-lg font-medium text-gray-800 dark:text-white">
                {surahs[surahNumber - 1]?.arabicName || ""}
              </Text>
            </TouchableOpacity>

            {/* Next Surah */}
            <TouchableOpacity
              onPress={() => navigateToSurah(surahNumber + 1)}
              disabled={surahNumber === 114}
              className={`${
                surahNumber === 114
                  ? "invisible"
                  : "flex-row-reverse border border-gray-300 dark:border-gray-500"
              } items-center justify-center px-2 py-2 rounded`}
            >
              <Text className="text-lg font-medium text-gray-800 dark:text-white">
                {surahs[surahNumber + 1]?.arabicName || ""}
              </Text>
              <AntDesign
                name="arrowleft"
                size={24}
                color={surahNumber === 114 ? "transparent" : "gray"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
