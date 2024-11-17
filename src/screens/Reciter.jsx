import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import ReciterImg from "../components/reciter/ReciterImg";
import TopReciterBadge from "../components/reciter/TopReciterBadge";
import GoBackButton from "../components/ui/GoBackButton";
import SurahCard from "../components/reciter/SurahCard";
import { BASE_END_POINT, getReciter } from "../services/api";
import Error from "../components/ui/Error";
import Loading from "../components/ui/Loading";
import {
  addBookmark,
  removeBookmark,
  isBookmarkExists,
} from "../helpers/bookmarkHandlers";
import SelectOptions from "../components/reciter/SelectOptions";
import Alert from "../components/ui/Alert";
import { useTranslate } from "./../helpers/i18nHelper.js";
import getName from "../helpers/getName.js";
import { flexDirection } from "../helpers/flexDirection.js";

const ReciterScreen = () => {
  const route = useRoute();
  const { recitationSlug, reciterSlug } = route.params || {};
  const translate = useTranslate("ReciterScreen");
  const [state, setState] = useState({
    reciter: {},
    loading: true,
    error: null,
  });

  const [selectedRecitationSlug, setSelectedRecitationSlug] =
    useState(recitationSlug);
  const [recitations, setRecitations] = useState([]);
  const [favouriteState, setFavouriteState] = useState({
    isFavourite: false,
    loading: true,
  });

  const [alert, setAlert] = useState(null);
  const [isChangingRecitation, setIsChangingRecitation] = useState(false);

  const currentRecitation = recitations?.find(
    (rec) => rec.recitationInfo.slug === selectedRecitationSlug
  );

  useEffect(() => {
    const fetchReciter = async () => {
      setState({
        reciter: {},
        loading: true,
        error: null,
      });
      try {
        const res = await getReciter(reciterSlug);

        if (!res.ok) {
          const data = await res.json();
          setState({ reciter: null, loading: false, error: data.message });
          return;
        }

        const data = await res.json();
        const reciterData = data.reciter || {};
        const recitationsData = reciterData.recitations || [];

        setState({ reciter: reciterData, loading: false, error: null });
        setRecitations(recitationsData);

        if (!selectedRecitationSlug && recitationsData.length > 0) {
          setSelectedRecitationSlug(recitationsData[0]?.recitationInfo?.slug);
        }
      } catch (error) {
        setState({ reciter: null, loading: false, error: error.message });
      }
    };

    fetchReciter();
    checkFavoriteStatus();
  }, [reciterSlug, recitationSlug]);

  const checkFavoriteStatus = async () => {
    const favoriteStatus = await isBookmarkExists("Favorites", reciterSlug);
    setFavouriteState((prev) => ({
      ...prev,
      isFavourite: favoriteStatus,
      loading: false,
    }));
  };

  const handleFavoriteToggle = async () => {
    if (favouriteState.isFavourite) {
      try {
        await removeBookmark("Favorites", reciterSlug);
        setAlert({
          message: translate("removedFromFavorites"),
          type: "success",
        });
      } catch (error) {
        setAlert({
          message: error?.message || "An error occurred. Please try again.",
          type: "error",
        });
      }
    } else {
      const savedData = {
        type: "Favorites",
        arabicName: state.reciter.arabicName,
        englishName: state.reciter.englishName,
        photo: state.reciter.photo,
        reciterSlug,
        recitationSlug: selectedRecitationSlug,
      };
      try {
        await addBookmark("Favorites", reciterSlug, savedData);
        setAlert({
          message: translate("addedToFavorites"),
          type: "success",
        });
      } catch (error) {
        setAlert({
          message: error?.message || "An error occurred. Please try again.",
          type: "error",
        });
      }
    }
    setFavouriteState((prev) => ({
      ...prev,
      isFavourite: !prev.isFavourite,
      loading: false,
    }));
  };

  const handleDownloadAll = () => {
    const downloadUrl = `${BASE_END_POINT}/reciters/download-recitation/${reciterSlug}/${selectedRecitationSlug}`;
    Linking.openURL(downloadUrl);
  };

  const handleRecitationChange = (newRecitationSlug) => {
    setIsChangingRecitation(true);
    setSelectedRecitationSlug(newRecitationSlug);

    // Simulate loading time
    setTimeout(() => {
      setIsChangingRecitation(false);
    }, 100);
  };

  return (
    <ScrollView
      style={{ position: "relative" }}
      className="flex-1 w-full p-4 mx-auto bg-slate-800"
      showsVerticalScrollIndicator={false}
    >
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      {state.loading ? (
        <Loading />
      ) : state.error ? (
        <Error message={state.error} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className={`${flexDirection()} items-center justify-between`}>
            <GoBackButton />
            <TouchableOpacity
              disabled={favouriteState.loading}
              onPress={handleFavoriteToggle}
            >
              <AntDesign
                name="heart"
                size={40}
                color={favouriteState.isFavourite ? "#22c55e" : "#9ca3af"}
              />
            </TouchableOpacity>
          </View>
          <View className="reciter">
            {/* Reciter Info */}
            <View className="flex-col items-center w-full">
              <ReciterImg uri={state.reciter?.photo} />
              <View className="my-2">
                <Text className="text-3xl font-semibold text-white">
                  {getName(state.reciter)}
                </Text>
                {state.reciter?.isTopReciter && <TopReciterBadge />}
                <View
                  className={`${flexDirection()} items-center justify-center gap-2 mt-2`}
                >
                  <Ionicons name="eye-outline" size={25} color="#6B7280" />
                  <Text className="mb-1 ml-1 text-lg font-semibold text-white">
                    {state.reciter?.totalViewers?.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Select Options */}
            {state.reciter?.recitations?.length > 1 ? (
              <SelectOptions
                setRecitation={handleRecitationChange}
                recitations={state.reciter?.recitations}
                recitationName={getName(currentRecitation?.recitationInfo)}
              />
            ) : (
              <Text className="w-full p-2 mx-auto text-2xl font-semibold text-center text-gray-100 border border-gray-600 rounded">
                {getName(currentRecitation?.recitationInfo)}
              </Text>
            )}
            {/* Download All Button */}
            <TouchableOpacity
              onPress={handleDownloadAll}
              className="flex-row-reverse items-center justify-center p-4 mt-4 bg-gray-700 border border-gray-500 rounded-md"
            >
              <Text className="ml-2 text-lg font-semibold text-center text-white">
                {translate("downloadAll")}
              </Text>
            </TouchableOpacity>

            {/* Surahs List  */}
            <View className="w-full">
              {isChangingRecitation ? (
                <View className="flex items-center justify-center py-10">
                  <ActivityIndicator size="large" color="#22c55e" />
                </View>
              ) : (
                currentRecitation?.audioFiles?.map((surah, i) => (
                  <SurahCard
                    key={surah?.surahInfo?.slug}
                    surah={surah}
                    surahIndex={i}
                    recitation={currentRecitation}
                    reciter={{
                      photo: state.reciter?.photo,
                      arabicName: state.reciter.arabicName,
                      englishName: state.reciter.englishName,
                      slug: state.reciter?.slug,
                    }}
                  />
                ))
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </ScrollView>
  );
};

export default ReciterScreen;
