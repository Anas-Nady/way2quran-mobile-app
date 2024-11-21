import { Animated, Text, View, FlatList } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import SlideItem from "./SlideItem";
import Pagination from "./Pagination";
import { useTranslation } from "react-i18next";
import { getReciters } from "../../services/api";
import { ScreenDimensionsContext } from "../../contexts/ScreenDimensionsProvider";
import Error from "./../ui/Error";
import { ActivityIndicator } from "react-native";
import { VirtualizedList } from "react-native";

const Slider = () => {
  const { screenWidth: width } = useContext(ScreenDimensionsContext);

  const [index, setIndex] = useState(0);
  const [state, setState] = useState({
    loading: false,
    slides: [],
    error: null,
  });
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const { t } = useTranslation();

  const numItems = width > 768 ? 3 : 1;
  const itemWidth = width / numItems;

  useEffect(() => {
    const fetchReciters = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        const res = await getReciters({
          recitationSlug: "hafs-an-asim",
          isTopReciter: true,
          sortBy: "-totalVisitors",
          pageSize: 6,
        });

        if (!res.ok) {
          const data = await res.json();
          setState((prev) => ({ ...prev, error: data.message }));
          return;
        }
        const data = await res.json();

        setState((prev) => ({ ...prev, slides: data?.reciters }));
      } catch (error) {
        console.error(error);
        setState((prev) => ({ ...prev, error: error.message }));
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchReciters();
  }, []);

  useEffect(() => {
    if (state.slides.length === 0) return;

    const interval = setInterval(() => {
      // Move to the next slide
      setIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % state.slides.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [state.slides.length]);

  const handleOnScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const getItem = (data, index) => data[index];
  const getItemCount = (data) => data.length;

  const renderItem = ({ item }) => (
    <View style={{ width: itemWidth }}>
      <MemoizedSlideItem item={item} />
    </View>
  );

  return (
    <View className="py-5 mx-auto my-5" style={{ width }}>
      <Text className="px-2 mx-auto mb-4 text-4xl font-semibold text-green-500 border-b-4 border-gray-500 rounded-lg">
        {t("listeningNow")}
      </Text>

      {state.error ? (
        <Error message={state.error} />
      ) : state.loading ? (
        <ActivityIndicator size="large" color="#22c55e" />
      ) : (
        <VirtualizedList
          ref={flatListRef}
          data={state.slides}
          horizontal
          keyExtractor={(item) => item.slug}
          renderItem={renderItem}
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          onScroll={handleOnScroll}
          initialNumToRender={3}
          scrollEventThrottle={16}
          getItem={getItem}
          getItemCount={getItemCount}
        />
      )}
      <MemoizedPagination data={state.slides} scrollX={scrollX} />
    </View>
  );
};

export default Slider;

const MemoizedSlideItem = SlideItem;
const MemoizedPagination = Pagination;
