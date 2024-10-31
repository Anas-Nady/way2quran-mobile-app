import React, { useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import surahs from "./../constants/surahs";
import HeadingScreen from "../components/HeadingScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import GoBackButton from "../components/ui/GoBackButton";
import getName from "../helpers/getName";
import { getCurrentLanguage } from "../services/i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Surah() {
  const route = useRoute();
  const navigation = useNavigation();
  const scrollViewRef = useRef();
  const surahNumber = parseInt(route.params?.surahNumber);
  const surahInfo = surahs[surahNumber];

  const handleScroll = async (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;

    // Save the current scroll position to AsyncStorage
    try {
      await AsyncStorage.setItem(
        `scrollTo-${surahNumber}`,
        currentOffsetY.toString()
      );
    } catch (error) {
      console.error("Failed to save scroll position:", error);
    }
  };

  useEffect(() => {
    const getSavedScrollPosition = async () => {
      try {
        const savedScrollPosition = await AsyncStorage.getItem(
          `scrollTo-${surahNumber}`
        );
        if (savedScrollPosition !== null) {
          scrollViewRef.current.scrollTo({
            y: parseInt(savedScrollPosition),
            animated: true,
          });
        }
      } catch (error) {
        console.error("Error retrieving scroll position:", error);
      }
    };

    getSavedScrollPosition();
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
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1 w-full px-4 bg-white dark:bg-gray-800"
      >
        <HeadingScreen headingTxt={getName(surahInfo)} />

        {/* Surah Info */}
        <View className="flex-col flex-1 w-[90%] py-2 my-5 mx-auto border-b-2 border-gray-400 dark:border-gray-700">
          {surahInfo.verses.map((verse) => (
            <View
              key={verse.id}
              className="w-full py-3 my-2 border-b-2 border-gray-300 dark:border-gray-700"
            >
              <Text className="mb-1 text-2xl font-medium leading-normal text-gray-700 dark:text-gray-300 font-arabic">
                {verse.textArabic}{" "}
                <Text className={`font-verses text-5xl`}>{verse.id}</Text>
              </Text>
              {getCurrentLanguage() === "en" && (
                <Text className="mb-1 text-2xl font-medium leading-normal text-gray-700 dark:text-gray-300 font-english">
                  {verse.textEnglish}{" "}
                  <Text className={`font-verses text-5xl`}>{verse.id}</Text>
                </Text>
              )}
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
                {getName(surahs[surahNumber - 1]) || ""}
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
                {getName(surahs[surahNumber + 1]) || ""}
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
