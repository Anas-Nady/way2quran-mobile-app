import { View, Text, Image, ImageBackground } from "react-native";
import bgImage from "./../assets/images/bg-img.png";
import { useContext } from "react";
import { ScreenDimensionsContext } from "../contexts/ScreenDimensionsProvider";
import { useTranslate } from "../helpers/i18nHelper";

export default function Welcome() {
  const translate = useTranslate("Welcome");
  const { screenWidth, screenHeight } = useContext(ScreenDimensionsContext);

  return (
    <>
      <ImageBackground
        source={bgImage}
        style={{ width: screenWidth, height: screenHeight - 82 }}
        resizeMode="cover"
        className="flex-1 bg-center py-9"
      >
        <View className="flex-col items-center justify-center flex-1 p-4">
          <Text className="text-3xl font-semibold leading-10 text-center text-gray-100 dark:text-slate-100">
            {translate("part1")}{" "}
            <Text className="text-green-500">{translate("part2")}</Text>
            {translate("part3")}
          </Text>
          <Image
            source={{
              uri: "https://storage.googleapis.com/way2quran_storage/imgs/full-logo.webp",
            }}
            style={{
              width: screenWidth * 0.8,
              height: screenHeight * 0.35,
            }}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>
    </>
  );
}
