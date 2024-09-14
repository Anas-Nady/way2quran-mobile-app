import { TouchableOpacity } from "react-native";
import { getCurrentLanguage, toggleLanguage } from "../../services/i18next";
import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

const SwitchLanguage = () => {
  const { colorScheme } = useColorScheme();

  return (
    <TouchableOpacity
      onPress={() =>
        toggleLanguage(getCurrentLanguage() === "ar" ? "en" : "ar")
      }
    >
      <FontAwesome
        name="language"
        size={30}
        color={colorScheme === "dark" ? "white" : "black"}
      />
    </TouchableOpacity>
  );
};

export default SwitchLanguage;
