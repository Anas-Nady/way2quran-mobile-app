import { Entypo, Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { TouchableOpacity } from "react-native";

const ToggleMode = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <TouchableOpacity onPress={toggleColorScheme}>
      {colorScheme === "dark" ? (
        <Entypo className="flex" name="light-up" size={30} color="white" />
      ) : (
        <Feather name="moon" size={30} color="#4b5563" />
      )}
    </TouchableOpacity>
  );
};

export default ToggleMode;
