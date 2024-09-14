import { View, Text, TextInput } from "react-native";

const TextAreaInput = ({ id, value, onChangeText, label }) => {
  return (
    <View className="w-full mb-5">
      <Text className="mb-2 text-lg font-medium text-center text-gray-900 dark:text-white">
        {label}
      </Text>
      <TextInput
        id={id}
        name={id}
        multiline
        numberOfLines={4}
        value={value}
        onChangeText={onChangeText}
        className="p-2.5 w-full text-lg text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
      />
    </View>
  );
};

export default TextAreaInput;
