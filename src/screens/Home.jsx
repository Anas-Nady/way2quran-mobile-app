import Footer from "../components/Footer";
import Welcome from "../components/Welcome";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <View className="flex-1 w-full bg-gray-800">
        <Welcome />
        <Footer />
      </View>
    </View>
  );
}
