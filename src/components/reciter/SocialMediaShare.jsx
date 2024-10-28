import { Modal, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Entypo, AntDesign, FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const SocialMediaShare = ({
  modalVisible = false,
  setModalVisible,
  pageURL,
}) => {
  const mediaShare = [
    {
      href: `https://www.facebook.com/sharer/sharer.php?u=${pageURL}`,
      icon: <Entypo name="facebook" size={30} color="#374151" />,
    },
    {
      href: `https://twitter.com/intent/tweet?url=${pageURL}`,
      icon: <AntDesign name="twitter" size={30} color="#374151" />,
    },
    {
      href: `https://wa.me/?text=${pageURL}`,
      icon: <FontAwesome5 name="whatsapp" size={30} color="#374151" />,
    },
    {
      href: `https://t.me/share/url?url=${pageURL}`,
      icon: <FontAwesome5 name="telegram" size={30} color="#374151" />,
    },
  ];

  return (
    <View className={`flex-1 justify-center items-center`} style={{ width }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className={`flex-1 justify-center items-center bg-gray-500`}>
          <View
            className={`bg-gray-100 rounded-lg p-6 w-4/5 items-center shadow-lg relative`}
          >
            <TouchableOpacity
              className="absolute p-2 bg-white border border-gray-600 rounded-full -top-2 -right-2"
              onPress={() => setModalVisible(false)}
            >
              <AntDesign name="close" size={24} color="red" />
            </TouchableOpacity>

            <Text className={`text-xl mb-6 mt-4`}>Share via</Text>

            <View className="flex-row-reverse items-center justify-center w-full gap-5 mb-4">
              {mediaShare.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    /* Handle share action */
                  }}
                >
                  {item.icon}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SocialMediaShare;
