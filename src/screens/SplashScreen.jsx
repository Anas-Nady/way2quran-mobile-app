import React from "react";
import { View, StyleSheet, Image } from "react-native";
import fullLogo from "./../assets/images/bg.png";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={fullLogo}
        style={{ width: 540, height: 640 }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});

export default SplashScreen;
