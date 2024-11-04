import { Pressable, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { flexDirection } from "../../helpers/flexDirection";

export default function GoBackButton() {
  const navigation = useNavigation();

  return (
    <Pressable
      className={`${flexDirection()} bg-gray-800`}
      onPress={() => navigation.goBack()}
    >
      <View className="p-1 bg-green-500 rounded-xl">
        <Entypo name="forward" size={30} color="white" />
      </View>
    </Pressable>
  );
}
