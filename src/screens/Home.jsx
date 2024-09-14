import { View, ScrollView } from "react-native";
import Welcome from "../components/Welcome";
import Footer from "../components/Footer";
import Slider from "../components/listeningNow/Slider";

export default function HomeScreen() {
  return (
    <View className="flex-1 w-full bg-slate-50 dark:bg-gray-800">
      <ScrollView className="flex-1" style={{ position: "relative" }}>
        <Welcome />
        <Slider />
        <Footer />
      </ScrollView>
    </View>
  );
}
