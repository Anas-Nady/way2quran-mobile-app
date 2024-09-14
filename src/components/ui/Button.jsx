import { TouchableOpacity, Text } from "react-native";

const Button = ({ onPress, text, disabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`px-5 py-2.5 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none ${
        disabled
          ? "bg-orange-300 dark:bg-orange-500"
          : "bg-orange-500 hover:bg-orange-600 focus:ring-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
      }`}
    >
      <Text className="text-base font-semibold text-white">{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
