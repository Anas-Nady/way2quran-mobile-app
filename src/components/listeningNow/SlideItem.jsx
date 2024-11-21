import { View } from "react-native";
import ReciterCard from "./../reciter/ReciterCard";
import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { ScreenDimensionsContext } from "../../contexts/ScreenDimensionsProvider";
import { flexDirection } from "../../helpers/flexDirection";

const SlideItem = ({ item }) => {
  const { screenWidth: width } = useContext(ScreenDimensionsContext);
  const navigation = useNavigation();

  const itemWidth = width > 768 ? width / 3 : width;

  return (
    <View
      className={`${flexDirection()} items-center justify-center py-4`}
      style={{ width: itemWidth }}
    >
      <ReciterCard
        reciter={item}
        handleNavigateClick={() =>
          navigation.navigate("Reciter", {
            reciterSlug: item.slug,
            recitationSlug: "hafs-an-asim",
          })
        }
      />
    </View>
  );
};

export default React.memo(SlideItem, (prevProps, nextProps) => {
  return prevProps.item === nextProps.item;
});
