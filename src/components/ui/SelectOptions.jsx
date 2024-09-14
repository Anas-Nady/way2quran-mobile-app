import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SelectOptions = ({
  options,
  selectedValue,
  onSelect,
  placeholder = "Select an option",
  isVisible,
  onClose,
}) => {
  const renderOption = ({ item }) => (
    <TouchableOpacity
      className="p-4 border-b border-gray-200"
      onPress={() => {
        onSelect(item.value);
        onClose();
      }}
    >
      <Text className="text-lg text-gray-800 dark:text-white">
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="justify-end flex-1 bg-black bg-opacity-50">
        <View className="bg-white rounded-t-lg dark:bg-gray-800">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-xl font-semibold text-gray-800 dark:text-white">
              {placeholder}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={options}
            renderItem={renderOption}
            keyExtractor={(item) => item.value}
            className="max-h-80"
          />
        </View>
      </View>
    </Modal>
  );
};

export default SelectOptions;
