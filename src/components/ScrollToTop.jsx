import { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // You can use any icon library

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Handling scroll visibility using the onScroll event from ScrollView
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 600) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    console.log("scrollToTop now");
  };

  return (
    <>
      {isVisible && (
        <TouchableOpacity
          style={styles.scrollToTopButton}
          onPress={scrollToTop}
        >
          <Ionicons name="arrow-up" size={24} color="white" />
        </TouchableOpacity>
      )}
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16}></ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollToTopButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#374151", // dark:bg-gray-700 equivalent
    borderRadius: 50,
    padding: 10,
    zIndex: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3, // shadow for Android
  },
});

export default ScrollToTop;
