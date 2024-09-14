import { Pressable, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function GoBackButton() {
  const navigation = useNavigation();

  return (
    <Pressable
      className="flex-row-reverse px-5 pt-4 bg-white dark:bg-gray-800"
      onPress={() => navigation.goBack()}
    >
      <View className="p-1 bg-green-500 rounded-xl">
        <Entypo name="forward" size={30} color="white" />
      </View>
    </Pressable>
  );
}
