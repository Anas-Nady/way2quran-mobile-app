import { View, Text, ScrollView } from "react-native";
import HeadingScreen from "./../components/HeadingScreen";
import { Entypo } from "@expo/vector-icons";
import GoBackButton from "../components/ui/GoBackButton";
import { useTranslate } from "../helper/i18nHelper";
import { useContext } from "react";
import { ScreenDimensionsContext } from "../contexts/ScreenDimensionsProvider";

const AboutUsList = () => {
  const translate = useTranslate("AboutScreen");
  const { screenWidth: width } = useContext(ScreenDimensionsContext);

  return (
    <ScrollView className="flex-col flex-1 w-full bg-white dark:bg-gray-800">
      <GoBackButton />
      <HeadingScreen headingTxt={translate("aboutTitle")} />

      <View
        className="flex flex-col gap-4 mx-auto py-9"
        style={{ width: width * 0.9 }}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <View key={index + 1} className="p-3 bg-gray-700 rounded">
            <Text className="text-xl font-medium leading-normal text-green-500 dark:text-green-500">
              {translate(`about_${index + 1}`)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default AboutUsList;
