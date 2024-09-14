import { View, Text, ScrollView } from "react-native";
import HeadingScreen from "./../components/HeadingScreen";
import { Entypo } from "@expo/vector-icons";
import GoBackButton from "../components/ui/GoBackButton";
import { useTranslate } from "../helper/i18nHelper";

const AboutUsList = () => {
  const translate = useTranslate("AboutScreen");

  return (
    <ScrollView className="flex-col flex-1 w-full bg-white dark:bg-gray-800">
      <GoBackButton />
      <HeadingScreen headingTxt={translate("aboutTitle")} />

      <View className="flex flex-col py-9 gap-4 mx-auto w-[90%]">
        {Array.from({ length: 5 }, (_, index) => (
          <View
            key={index + 1}
            className="flex-row-reverse items-start justify-center p-3 bg-gray-700 rounded"
          >
            <Text className="text-xl font-medium leading-normal text-green-500 dark:text-green-500 text-start">
              {translate(`about_${index + 1}`)}
            </Text>
            {/* <View className="font-bold text-gray-800 dark:text-white">
              <Entypo name="pencil" size={24} color="#1f2937" />
            </View> */}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default AboutUsList;
