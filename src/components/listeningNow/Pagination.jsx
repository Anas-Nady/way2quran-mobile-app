import React from "react";
import { StyleSheet, Animated, View, Dimensions, FlatList } from "react-native";

const { width } = Dimensions.get("screen");

const Pagination = ({ data, scrollX }) => {
  const renderItem = ({ index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const dotWidth = scrollX.interpolate({
      inputRange,
      outputRange: [12, 30, 12],
      extrapolate: "clamp",
    });

    const backgroundColor = scrollX.interpolate({
      inputRange,
      outputRange: ["#ccc", "#22c55e", "#ccc"],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[styles.dot, { width: dotWidth, backgroundColor }]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        horizontal
        contentContainerStyle={styles.flatListContent}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0, // Adjusts the position relative to the screen
    width: "100%",
    alignItems: "center", // Centers the FlatList container horizontally
  },
  flatListContent: {
    justifyContent: "center", // Centers the dots within the FlatList
  },
  dot: {
    height: 12,
    borderRadius: 6,
    marginHorizontal: 3,
    backgroundColor: "#e5e7eb",
  },
});
