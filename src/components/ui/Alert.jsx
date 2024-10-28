import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Alert = ({ message, type = "success", duration = 3000, onClose }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  }, []);

  const getIconName = () => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "alert-circle";
      default:
        return "information-circle";
    }
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
      }}
      className="absolute z-50 top-4 left-4 right-4"
    >
      <View className="flex-row-reverse items-center p-4 bg-gray-200 border border-gray-400 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-500">
        <Ionicons
          name={getIconName()}
          size={24}
          color="#22c55e"
          className="mr-3"
        />
        <Text className="flex-1 text-base font-semibold text-gray-800 dark:text-white">
          {message}
        </Text>
        <TouchableOpacity
          onPress={onClose}
          className="p-1 ml-5 border border-gray-400 rounded-full dark:border-gray-500"
        >
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default Alert;
