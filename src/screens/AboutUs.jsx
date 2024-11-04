import { View, Text, ScrollView } from "react-native";
import HeadingScreen from "./../components/HeadingScreen";
import GoBackButton from "../components/ui/GoBackButton";
import { useTranslate } from "../helpers/i18nHelper";

const AboutUsList = () => {
  const translate = useTranslate("AboutScreen");

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 w-full p-4 bg-gray-800"
    >
      <GoBackButton />
      <HeadingScreen headingTxt={translate("aboutTitle")} />

      <View className="">
        {Array.from({ length: 5 }, (_, index) => (
          <View
            key={index + 1}
            className="p-3 my-1.5 bg-gray-700 border border-gray-600 rounded"
          >
            <Text className="text-xl font-medium leading-normal text-green-500">
              {translate(`about_${index + 1}`)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default AboutUsList;
