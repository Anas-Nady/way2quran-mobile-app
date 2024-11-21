import { View, Text, TouchableOpacity } from "react-native";
import ReciterImg from "./ReciterImg";
import getName from "./../../helpers/getName";

const ReciterCard = ({ reciter, handleNavigateClick }) => {
  if (!reciter) {
    return null;
  }

  const truncatedName =
    getName(reciter).length > 18
      ? `${getName(reciter).slice(0, 18)}...`
      : getName(reciter);

  return (
    <TouchableOpacity onPress={handleNavigateClick}>
      <View className="w-full">
        <View className="flex-col items-center pb-3">
          <ReciterImg uri={reciter.photo} />
        </View>
      </View>
      <Text
        numberOfLines={1}
        className="text-xl font-semibold text-center text-gray-100"
      >
        {truncatedName}
      </Text>
    </TouchableOpacity>
  );
};

export default ReciterCard;
