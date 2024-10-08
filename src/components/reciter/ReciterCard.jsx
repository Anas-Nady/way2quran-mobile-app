import { View, Text, TouchableOpacity } from "react-native";
import ReciterImg from "./ReciterImg";

const ReciterCard = ({ reciter, handleNavigateClick }) => {
  if (!reciter) {
    return null;
  }

  return (
    <TouchableOpacity onPress={handleNavigateClick} className="my-4">
      <View className="w-full px-4">
        <View className="flex-col items-center pb-5">
          <ReciterImg uri={reciter.photo} />
        </View>
      </View>
      <Text className="my-1 text-2xl font-semibold text-center text-gray-900 dark:text-white">
        {reciter.arabicName}
      </Text>
    </TouchableOpacity>
  );
};

export default ReciterCard;
