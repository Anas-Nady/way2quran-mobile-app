import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import surahs from "./../constants/surahs";
import HeadingScreen from "../components/HeadingScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import GoBackButton from "../components/ui/GoBackButton";
import getName from "../helpers/getName";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { currentLanguage, flexDirection } from "../helpers/flexDirection";

export default function Surah() {
  const route = useRoute();
  const navigation = useNavigation();
  const scrollViewRef = useRef();
  const surahNumber = parseInt(route.params?.surahNumber);
  const surahInfo = surahs[surahNumber];

  const [progress, setProgress] = useState(new Animated.Value(0)); // Added state for progress

  const handleScroll = async (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollHeight = event.nativeEvent.layoutMeasurement.height;

    // Calculate progress
    const newProgress = currentOffsetY / (contentHeight - scrollHeight);

    // Animate progress
    Animated.timing(progress, {
      toValue: newProgress,
      duration: 100,
      useNativeDriver: false,
    }).start();

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
      <View
        className={`${flexDirection()} bg-gray-700`}
        style={{ height: 2, width: "100%" }}
      >
        <Animated.View
          className="bg-green-400"
          style={{
            height: "100%",
            width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
            // backgroundColor: "green",
          }}
        />
      </View>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        className="flex-1 w-full p-4 mx-auto bg-gray-800"
      >
        <GoBackButton />
        <HeadingScreen headingTxt={getName(surahInfo)} />

        {/* Surah Info */}
        <View className="flex-col flex-1 w-[90%] py-2 my-5 mx-auto border-b-2 border-gray-700">
          {surahInfo.verses.map((verse) => (
            <View
              key={verse.id}
              className="w-full py-3 my-2 border-b-2 border-gray-700"
            >
              <Text className="mb-1 text-2xl font-medium leading-normal text-gray-300 font-quran">
                {verse.textArabic}
                <Text
                  style={{ fontFamily: "Quran-verse" }}
                  className={`font-verses text-5xl`}
                >
                  {+verse.id}
                </Text>
              </Text>
              {currentLanguage === "en" && (
                <Text className="mb-1 text-2xl font-medium leading-normal text-gray-300 font-english">
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
                  : "flex-row-reverse border border-gray-500"
              } items-center justify-center px-2 py-2 rounded`}
            >
              <AntDesign
                name="arrowright"
                size={24}
                color={surahNumber === 1 ? "transparent" : "gray"}
              />
              <Text className="text-lg font-medium text-white">
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
                  : "flex-row-reverse border border-gray-500"
              } items-center justify-center px-2 py-2 rounded`}
            >
              <Text className="text-lg font-medium text-white">
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
