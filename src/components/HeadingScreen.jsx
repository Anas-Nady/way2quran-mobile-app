import { Text, View } from "react-native";

const HeadingScreen = ({ headingTxt, extraStyles = "" }) => {
  return (
    <View className={`${extraStyles} w-full mx-auto my-3 `}>
      <Text className="text-[40px] font-bold text-center text-green-500">
        {headingTxt}
      </Text>
      <Text className="w-20 h-1 mx-auto mt-1 bg-gray-600 rounded"></Text>
    </View>
  );
};

export default HeadingScreen;
