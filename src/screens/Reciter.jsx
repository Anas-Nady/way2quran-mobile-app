import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
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

const ReciterScreen = () => {
  const route = useRoute();
  const { recitationSlug, reciterSlug } = route.params || {};
  const translate = useTranslate("ReciterScreen");

  const [selectedRecitationSlug, setSelectedRecitationSlug] =
    useState(recitationSlug);
  const [recitations, setRecitations] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  const [alert, setAlert] = useState(null);

  const [state, setState] = useState({
    reciter: {},
    loading: true,
    error: null,
  });

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
          // do something here
          setState({ reciter: null, loading: false, error: data.message });
          return;
        }

        const data = await res.json();
        setState({ reciter: data.reciter, loading: false, error: null });
        setRecitations(data.reciter.recitations);
      } catch (error) {
        setState({ reciter: null, loading: false, error: error.message });
      }
    };

    fetchReciter();
    checkFavoriteStatus();
    checkPlaylistStatus();
  }, [reciterSlug, recitationSlug, selectedRecitationSlug]);

  const checkFavoriteStatus = async () => {
    const favoriteStatus = await isBookmarkExists("Favorites", reciterSlug);
    setIsFavourite(favoriteStatus);
  };

  const checkPlaylistStatus = async () => {
    const bookmarkKey = `${reciterSlug}_${selectedRecitationSlug}`;
    const playlistStatus = await isBookmarkExists("Playlist", bookmarkKey);
    setIsInPlaylist(playlistStatus);
  };

  const handleFavoriteToggle = async () => {
    if (isFavourite) {
      await removeBookmark("Favorites", reciterSlug);
      setAlert({
        message: translate("removedFromFavorites"),
        type: "success",
      });
    } else {
      const savedData = {
        type: "Favorites",
        arabicName: state.reciter.arabicName,
        englishName: state.reciter.englishName,
        photo: state.reciter.photo,
        reciterSlug,
        recitationSlug: selectedRecitationSlug,
      };
      await addBookmark("Favorites", reciterSlug, savedData);
      setAlert({
        message: translate("addedToFavorites"),
        type: "success",
      });
    }
    setIsFavourite((prev) => !prev);
  };

  const handleDownloadAll = () => {
    const downloadUrl = `${BASE_END_POINT}/reciters/download-recitation/${reciterSlug}/${selectedRecitationSlug}`;
    Linking.openURL(downloadUrl);
  };

  return (
    <View className="relative flex-1 bg-white dark:bg-slate-800">
      <View className="flex-row-reverse items-center justify-between">
        <GoBackButton />
        <TouchableOpacity onPress={handleFavoriteToggle} className="px-5 mt-4">
          <AntDesign
            name="heart"
            size={40}
            color={isFavourite ? "#22c55e" : "#9ca3af"}
          />
        </TouchableOpacity>
      </View>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <ScrollView style={{ position: "relative" }} className="flex-1 w-full">
        {state.loading ? (
          <Loading />
        ) : state.error ? (
          <Error message={state.error} />
        ) : (
          <View className="mx-auto w-[90%] flex-1">
            {/* Reciter Info */}
            <View className="flex-col items-center w-full">
              <ReciterImg uri={state.reciter?.photo} />
              <View className="my-2">
                <Text className="text-3xl font-semibold text-gray-700 dark:text-white">
                  {getName(state.reciter)}
                </Text>
                {state.reciter?.isTopReciter && <TopReciterBadge />}
                <View className="flex-row-reverse items-center justify-center gap-2 mt-2">
                  <Ionicons name="eye-outline" size={25} color="#6B7280" />
                  <Text className="mb-1 ml-1 text-lg font-semibold text-gray-700 dark:text-white">
                    {state.reciter?.totalViewers?.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Select Options */}
            <SelectOptions
              setRecitation={setSelectedRecitationSlug}
              recitations={state.reciter?.recitations}
              recitationName={getName(currentRecitation?.recitationInfo)}
            />

            {/* Download All Button */}
            <TouchableOpacity
              onPress={handleDownloadAll}
              className="flex-row-reverse items-center justify-center p-4 mt-4 bg-white border border-gray-400 rounded-md dark:bg-gray-700 dark:border-gray-500"
            >
              <Text className="ml-2 text-lg font-semibold text-center text-gray-800 dark:text-white">
                {translate("downloadAll")}
              </Text>
            </TouchableOpacity>

            {/* Surahs List  */}
            <View className="w-full">
              {currentRecitation?.audioFiles?.map((surah, i) => (
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
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ReciterScreen;
