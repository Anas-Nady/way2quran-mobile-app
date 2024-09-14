import { View } from "react-native";
import * as Progress from "react-native-progress";

export default function Loading() {
  return (
    <View className="flex-row items-center justify-center w-full h-[70%] bg-white dark:bg-gray-800 flex-1">
      <Progress.CircleSnail thickness={8} size={120} color={"#22c55e"} />
    </View>
  );
}
