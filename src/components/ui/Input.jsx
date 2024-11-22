import { View, Text, TextInput } from "react-native";

const Input = ({ labelText, id, type, value, onChangeText }) => {
  return (
    <View className="w-full mb-5">
      <Text className="mb-2 text-lg font-medium text-center text-gray-200">
        {labelText}
      </Text>
      <TextInput
        id={id}
        name={id}
        value={value}
        onChangeText={onChangeText}
        keyboardType={type === "email" ? "email-address" : "default"}
        className={`text-right p-2.5 w-full text-lg  rounded-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-white`}
      />
    </View>
  );
};

export default Input;
