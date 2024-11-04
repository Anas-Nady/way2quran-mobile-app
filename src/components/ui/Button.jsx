import { TouchableOpacity, Text } from "react-native";

const Button = ({ onPress, text, disabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`${
        disabled ? "bg-gray-700" : "bg-green-500"
      } px-5 py-2.5 text-sm font-medium text-center text-white rounded-lg`}
    >
      <Text className="text-base font-semibold text-white">{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
