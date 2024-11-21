import { View, Text, ScrollView } from "react-native";
import HeadingScreen from "./../components/HeadingScreen";
import GoBackButton from "../components/ui/GoBackButton";
import { useTranslate } from "../helpers/i18nHelper";

const AboutUsList = () => {
  const translate = useTranslate("AboutScreen");

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 w-full p-4 bg-gray-600"
      >
        <GoBackButton />
        <HeadingScreen headingTxt={translate("aboutTitle")} />

        <ScrollView style={{ flex: 1 }}>
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
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default AboutUsList;
