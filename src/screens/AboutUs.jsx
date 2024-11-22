import { View, Text, ScrollView } from "react-native";
import HeadingScreen from "./../components/HeadingScreen";
import GoBackButton from "../components/ui/GoBackButton";
import { useTranslate } from "../helpers/i18nHelper";
import { FontAwesome5 } from "@expo/vector-icons";
import { socialMedia } from "../constants/socialMedia";

const AboutUsList = () => {
  const translate = useTranslate("AboutScreen");

  return (
    <ScrollView
      className="flex-1 w-full bg-gray-800"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <GoBackButton />
      <HeadingScreen headingTxt={translate("aboutTitle")} />

      {Array.from({ length: 3 }, (_, index) => (
        <View
          key={index + 1}
          className="p-3 my-1.5 w-[90%] mx-auto bg-gray-700 border border-gray-600 rounded"
        >
          <Text className="text-xl font-medium leading-normal text-green-500">
            {translate(`about_${index + 1}`)}
          </Text>
        </View>
      ))}
      <View className="flex-row justify-between items-center p-4 w-[90%] mx-auto bg-gray-700 border border-gray-600">
        {socialMedia.map((item) => (
          <FontAwesome5 key={item.id} name={item.id} size={24} color="white" />
        ))}
      </View>
    </ScrollView>
  );
};

export default AboutUsList;
