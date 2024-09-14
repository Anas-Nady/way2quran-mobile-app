import { View, Dimensions } from "react-native";
import Slider from "./Slider";

const { width } = Dimensions.get("window");

export default function TrendingReciters() {
  return (
    <View className="p-3 bg-white dark:bg-gray-900" style={{ width }}>
      <Slider />
    </View>
  );
}
