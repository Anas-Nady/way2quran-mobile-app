import { View, TextInput, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { flexDirection, textDirection } from "../../helpers/flexDirection";

export default function SearchInput({ handleTextDebounce }) {
  const textInputRef = useRef(null);
  const { t } = useTranslation();

  return (
    <View
      className={`w-[90%] ${flexDirection()} items-center justify-between mx-auto my-3 border rounded-full border-gray-500`}
    >
      <TextInput
        ref={textInputRef}
        onChangeText={handleTextDebounce}
        placeholder={t("search")}
        placeholderTextColor={"lightgray"}
        className={`${textDirection()} pb-1 w-[70%] flex-1 mx-auto text-base px-5 font-semibold tracking-wider rounded-full text-white`}
      />

      <Pressable
        onPress={() => textInputRef.current.focus()}
        className="p-3 m-1 bg-gray-700 rounded-full"
      >
        <AntDesign name="search1" size={30} color={"white"} />
      </Pressable>
    </View>
  );
}
