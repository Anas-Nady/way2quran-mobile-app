import { View, Text, TextInput } from "react-native";

const TextAreaInput = ({ id, value, onChangeText, label }) => {
  return (
    <View className="w-full mb-5">
      <Text className="mb-2 text-lg font-medium text-center text-gray-200">
        {label}
      </Text>
      <TextInput
        id={id}
        name={id}
        multiline
        numberOfLines={4}
        value={value}
        onChangeText={onChangeText}
        className="w-full p-1 text-lg text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-lg"
      />
    </View>
  );
};

export default TextAreaInput;
