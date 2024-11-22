import Footer from "../components/Footer";
import Welcome from "../components/Welcome";
import { ScrollView, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        nestedScrollEnabled
        className="flex-1 w-full bg-gray-800"
      >
        <Welcome />
        <Footer />
      </ScrollView>
    </View>
  );
}
