import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo for icons

const ToastMessage = ({
  success = false,
  error = false,
  message,
  duration = 8000,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        position: "absolute",
        top: 30,
        left: 20,
        right: 20,
        zIndex: 50,
      }}
    >
      <View className="flex-row items-center p-4 bg-white border border-gray-300 rounded-lg shadow dark:border-gray-600 dark:bg-gray-800">
        <View
          className={`items-center justify-center w-8 h-8 rounded-lg ${
            success
              ? "bg-green-100 dark:bg-green-800"
              : error
              ? "bg-red-100 dark:bg-red-800"
              : "bg-gray-100 dark:bg-gray-700"
          }`}
        >
          <Ionicons
            name={success ? "checkmark" : error ? "alert" : "information"}
            size={24}
            color={success ? "#10B981" : error ? "#EF4444" : "#6B7280"}
          />
        </View>
        <Text className="flex-1 ml-3 font-bold text-gray-900 text-md dark:text-white">
          {message}
        </Text>
        <TouchableOpacity
          onPress={() => setIsOpen(false)}
          className="ml-auto bg-white rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800"
        >
          <Ionicons name="close" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default ToastMessage;
