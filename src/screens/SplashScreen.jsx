import React from "react";
import { View, StyleSheet, Image } from "react-native";
import fullLogo from "./../assets/images/Splash_Screen2.png";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={fullLogo}
        style={{ width: 500, height: 500 }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});

export default SplashScreen;
