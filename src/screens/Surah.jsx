import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { View, Animated, FlatList } from "react-native";
import surahs from "./../constants/surahs";
import HeadingScreen from "../components/HeadingScreen";
import { useRoute } from "@react-navigation/native";
import GoBackButton from "../components/ui/GoBackButton";
import getName from "../helpers/getName";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { flexDirection } from "../helpers/flexDirection";
import SurahText from "../components/Surah/SurahText";
import SurahNavigation from "../components/Surah/SurahNavigation";
import { VirtualizedList } from "react-native";

export default function Surah() {
  const route = useRoute();
  const scrollViewRef = useRef();
  const surahNumber = parseInt(route.params?.surahNumber);
  const surahInfo = surahs[surahNumber];

  const [progress, setProgress] = useState(new Animated.Value(0));

  const handleScroll = async (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollHeight = event.nativeEvent.layoutMeasurement.height;

    const newProgress = currentOffsetY / (contentHeight - scrollHeight);

    Animated.timing(progress, {
      toValue: newProgress,
      duration: 100,
      useNativeDriver: false,
    }).start();

    try {
      await AsyncStorage.setItem(
        `scrollTo-${surahNumber}`,
        currentOffsetY.toString()
      );
    } catch (error) {
      console.error("Failed to save scroll position:", error);
    }
  };

  useEffect(() => {
    const getSavedScrollPosition = async () => {
      try {
        const savedScrollPosition = await AsyncStorage.getItem(
          `scrollTo-${surahNumber}`
        );
        if (savedScrollPosition !== null) {
          scrollViewRef.current?.scrollTo({
            y: parseInt(savedScrollPosition),
            animated: true,
          });
        }
      } catch (error) {
        console.error("Error retrieving scroll position:", error);
      }
    };

    getSavedScrollPosition();
  }, [surahNumber]);

  const renderHeader = useMemo(() => {
    return (
      <View>
        <GoBackButton />
        <HeadingScreen headingTxt={getName(surahInfo)} />
      </View>
    );
  }, []);

  const renderItem = useCallback(({ item }) => <SurahText item={item} />, []);

  const renderFooter = useMemo(() => {
    return <SurahNavigation surahNumber={surahNumber} />;
  }, [surahNumber]);

  const getItemCount = (data) => data.length;

  const getItem = (data, index) => data[index];

  return (
    <>
      <View
        className={`${flexDirection()} bg-gray-700`}
        style={{ height: 2, width: "100%" }}
      >
        <Animated.View
          className="bg-green-400"
          style={{
            height: "100%",
            width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          }}
        />
      </View>
      <View className="flex-1 w-full bg-gray-800">
        <VirtualizedList
          style={{ flex: 1 }}
          data={surahInfo.verses}
          getItemCount={getItemCount}
          getItem={getItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          initialNumToRender={7}
          maxToRenderPerBatch={4}
          updateCellsBatchingPeriod={100}
          contentContainerStyle={{
            backgroundColor: "#1f2937",
            paddingBottom: 16,
            flexGrow: 1,
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      </View>
    </>
  );
}
