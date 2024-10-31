import { View, Text, TextInput } from "react-native";
import { getCurrentLanguage } from "../../services/i18next";

const Input = ({ labelText, id, type, value, onChangeText }) => {
  return (
    <View className="w-full mb-5">
      <Text className="mb-2 text-lg font-medium text-center text-gray-900 dark:text-gray-200">
        {labelText}
      </Text>
      <TextInput
        id={id}
        name={id}
        value={value}
        onChangeText={onChangeText}
        keyboardType={type === "email" ? "email-address" : "default"}
        className={`${
          getCurrentLanguage() === "ar" ? "text-right" : "text-left"
        } p-2.5 w-full text-lg text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
      />
    </View>
  );
};

export default Input;
