import { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
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
import getRecitationType from "./../helper/getRecitationType";

export default function Reciters() {
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
          pageSize: 50,
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

  return (
    <>
      <View className="flex-1 w-full bg-white dark:bg-gray-800">
        <GoBackButton />
        {state.loading ? (
          <Loading />
        ) : state.error ? (
          <Error message={state.error} />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1 mx-auto w-[90%]"
          >
            <HeadingScreen headingTxt={recitation?.arabicName || ""} />

            <View className="flex-row flex-wrap items-center justify-center py-7">
              {state.reciters?.length > 0 ? (
                state.reciters?.map((reciter) => (
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
                ))
              ) : (
                <NotFoundResults />
              )}
            </View>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </ScrollView>
        )}
      </View>
    </>
  );
}
