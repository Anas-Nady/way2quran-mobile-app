import { useContext, useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import recitations from "../constants/recitations";
import HeadingScreen from "../components/HeadingScreen";
import ReciterCard from "../components/reciter/ReciterCard";
import Loading from "../components/ui/Loading";
import GoBackButton from "../components/ui/GoBackButton";
import Pagination from "../components/ui/Pagination";
import NotFoundResults from "../components/ui/NotFoundResults";
import { getReciters } from "../services/api";
import Error from "../components/ui/Error";
import getRecitationType from "./../helpers/getRecitationType";
import getName from "../helpers/getName";
import { ScreenDimensionsContext } from "../contexts/ScreenDimensionsProvider";

export default function Reciters() {
  const { screenWidth: width } = useContext(ScreenDimensionsContext);

  const route = useRoute();
  const { recitationSlug } = route.params;
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [state, setState] = useState({
    reciters: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchReciters = async () => {
      setState({
        loading: true,
        error: null,
        reciters: [],
      });
      try {
        const res = await getReciters({
          recitationSlug,
          currentPage,
          pageSize: 30,
        });
        const data = await res.json();

        if (!res.ok) {
          // do something here
          return <Error message={data.message} />;
        }
        setTotalPages(data.pagination.pages); // Changed from data.pagination.page
        setState({ reciters: data.reciters, loading: false, error: null });
      } catch (error) {
        setState({ reciters: [], loading: false, error: error.message });
      }
    };

    fetchReciters();
  }, [recitationSlug, currentPage]);

  const recitation = recitations.find((rec) => rec.slug === recitationSlug);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderReciter = ({ item: reciter }) => (
    <ReciterCard
      key={reciter.slug}
      reciter={reciter}
      handleNavigateClick={() =>
        navigation.navigate("Reciter", {
          reciterSlug: reciter.slug,
          recitationSlug: getRecitationType(recitationSlug),
        })
      }
    />
  );

  const ListEmptyComponent = () => <NotFoundResults />;

  const ListHeaderComponent = () => (
    <View>
      <GoBackButton />
      <HeadingScreen headingTxt={getName(recitation)} />
    </View>
  );

  const ListFooterComponent = () => (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
  const numColumns = width > 600 ? 4 : 2;

  return (
    <View className="flex-1 w-full bg-gray-800">
      {state.loading ? (
        <Loading />
      ) : state.error ? (
        <Error message={state.error} />
      ) : (
        <FlatList
          nestedScrollEnabled={true}
          style={{ flexGrow: 1, backgroundColor: "#1a1a1a" }}
          data={state.reciters}
          renderItem={renderReciter}
          keyExtractor={(item) => item.slug}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: "#1f2937", // bg-gray-800
          }}
          numColumns={numColumns}
          key={numColumns}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 14,
            padding: 20,
          }}
        />
      )}
    </View>
  );
}
