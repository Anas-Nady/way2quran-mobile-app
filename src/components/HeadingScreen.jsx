import { Text, View } from "react-native";

const HeadingScreen = ({ headingTxt, extraStyles = "" }) => {
  return (
    <View className={`${extraStyles} w-full whitespace-nowrap mx-auto`}>
      <Text className="pt-5 text-5xl font-bold text-center text-green-500 dark:text-green-500">
        {headingTxt}
      </Text>
      <Text className="w-32 h-1 mx-auto mt-1 bg-gray-300 rounded dark:bg-gray-600"></Text>
    </View>
  );
};

export default HeadingScreen;
