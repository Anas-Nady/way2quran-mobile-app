import { View, TextInput, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "nativewind";
import { flexDirection } from "../../helpers/flexDirection";
import { getCurrentLanguage } from "../../services/i18next";

export default function SearchInput({ handleTextDebounce }) {
  const textInputRef = useRef(null);
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  return (
    <View
      className={`w-[90%] ${flexDirection()} items-center justify-between mx-auto my-3 border rounded-full border-gray-400 dark:border-gray-500`}
    >
      <TextInput
        ref={textInputRef}
        onChangeText={handleTextDebounce}
        placeholder={t("search")}
        placeholderTextColor={"lightgray"}
        className={`${
          getCurrentLanguage() === "ar" ? "text-right" : "text-left"
        } pb-1 w-[70%] mx-auto text-base px-1 font-semibold tracking-wider text-gray-900 rounded-full dark:text-white`}
      />

      <Pressable
        onPress={() => textInputRef.current.focus()}
        className="p-3 m-1 bg-gray-200 rounded-full dark:bg-gray-700"
      >
        <AntDesign
          name="search1"
          size={30}
          color={colorScheme === "dark" ? "white" : "#4b5563"}
        />
      </Pressable>
    </View>
  );
}
