import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import SocialMediaShare from "./SocialMediaShare";
import { useNavigation } from "@react-navigation/native";
import { useColorScheme } from "nativewind";
import { Audio } from "expo-av";
import {
  pauseAudio,
  playAudio,
  playNextAudio,
  resumeAudio,
} from "../../helpers/audioPlayerHelper";
import { useAudioPlayer } from "../../contexts/AudioPlayerContext";
import {
  isBookmarkExists,
  addBookmark,
  getBookmarkData,
} from "../../helpers/bookmarkHandlers";
import Alert from "../ui/Alert";
import { useTranslate } from "../../helpers/i18nHelper";
import getName from "./../../helpers/getName.js";
import { flexDirection } from "../../helpers/flexDirection.js";
import { getCurrentLanguage } from "../../services/i18next.js";

const SurahCard = ({ surah, surahIndex, reciter, recitation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [alert, setAlert] = useState(null);
  const translate = useTranslate("SurahCard");

  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();

  const { playerState, setPlayerState } = useAudioPlayer();

  // download audio file
  const handleDownload = () => {
    Linking.openURL(surah?.downloadUrl);
  };

  const iconColor = colorScheme === "dark" ? "#fff" : "#4B5563";

  const togglePlayback = async (surah) => {
    // if there is no audio play -> create one for the first time.
    if (playerState.soundObject === null) {
      const playback = await new Audio.Sound();
      const status = await playAudio(playback, surah.url);

      return setPlayerState({
        ...playerState,
        playbackObject: playback,
        currentAudio: surah,
        soundObject: status,
        isPlaying: true,
        isModalVisible: true,
        isAutoPlayEnabled: false, // handle this feature
        surahIndex,
        reciter,
        recitation,
      });
    }

    // pause
    if (
      playerState.soundObject.isLoaded &&
      playerState.soundObject.isPlaying &&
      playerState.currentAudio?.surahNumber === surah.surahNumber
    ) {
      const status = await pauseAudio(playerState.playbackObject);
      return setPlayerState({
        ...playerState,
        soundObject: status,
        isPlaying: false,
      });
    }

    // resume
    if (
      playerState.soundObject.isLoaded &&
      !playerState.soundObject.isPlaying &&
      playerState.currentAudio?.surahNumber === surah.surahNumber
    ) {
      const status = await resumeAudio(playerState.playbackObject);
      return setPlayerState({
        ...playerState,
        soundObject: status,
        isPlaying: true,
        isModalVisible: true,
      });
    }

    // switching to another Surah
    if (
      playerState.soundObject.isLoaded &&
      playerState.currentAudio?.surahNumber !== surah.surahNumber
    ) {
      const status = await playNextAudio(playerState.playbackObject, surah.url);
      return setPlayerState({
        ...playerState,
        currentAudio: surah,
        soundObject: status,
        isPlaying: true,
        isModalVisible: true,
        isAutoPlayEnabled: false, // handle this feature
        surahIndex,
        reciter,
        recitation,
      });
    }
  };

  const isCurrentlyPlaying = () => {
    return (
      playerState.isPlaying &&
      playerState.reciter?.slug === reciter?.slug &&
      playerState.recitation?.recitationInfo?.slug ===
        recitation?.recitationInfo?.slug &&
      playerState.currentAudio?.surahNumber === surah?.surahNumber
    );
  };

  useEffect(() => {
    checkBookmarkStatus();
  }, []);

  const checkBookmarkStatus = async () => {
    const bookmarkKey = `${reciter.slug}_${recitation.recitationInfo.slug}`;
    const bookmarkExists = await isBookmarkExists("Playlist", bookmarkKey);
    if (bookmarkExists) {
      const bookmarkData = await getBookmarkData("Playlist", bookmarkKey);
      setIsBookmarked(
        bookmarkData.surahs.some((s) => s.surahNumber === surah.surahNumber)
      );
    } else {
      setIsBookmarked(false);
    }
  };

  const toggleBookmark = async () => {
    const bookmarkKey = `${reciter.slug}_${recitation.recitationInfo.slug}`;
    const bookmarkExists = await isBookmarkExists("Playlist", bookmarkKey);

    if (bookmarkExists) {
      const bookmarkData = await getBookmarkData("Playlist", bookmarkKey);
      let updatedSurahs;
      if (
        bookmarkData.surahs.some((s) => s.surahNumber === surah.surahNumber)
      ) {
        updatedSurahs = bookmarkData.surahs.filter(
          (s) => s.surahNumber !== surah.surahNumber
        );
        setAlert({
          message: translate("removedFromPlaylist"),
          type: "success",
        });
      } else {
        updatedSurahs = [
          ...bookmarkData.surahs,
          {
            surahNumber: surah.surahNumber,
            surahInfo: surah.surahInfo,
            url: surah.url,
          },
        ];
        setAlert({ message: translate("addedToPlaylist"), type: "success" });
      }
      await addBookmark("Playlist", bookmarkKey, {
        ...bookmarkData,
        surahs: updatedSurahs,
      });
    } else {
      const newBookmarkData = {
        reciter: {
          slug: reciter.slug,
          arabicName: reciter.arabicName,
          englishName: reciter.englishName,
          photo: reciter.photo,
        },
        recitation: {
          slug: recitation.recitationInfo.slug,
          recitationInfo: recitation.recitationInfo,
        },
        surahs: [
          {
            surahNumber: surah.surahNumber,
            surahInfo: surah.surahInfo,
            url: surah.url,
          },
        ],
        key: bookmarkKey,
      };
      await addBookmark("Playlist", bookmarkKey, newBookmarkData);
      setAlert({ message: translate("addedToPlaylist"), type: "success" });
    }
    setIsBookmarked(!isBookmarked);
  };

  return (
    <>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <View
        className={`${flexDirection()} items-center justify-between p-4 my-2 bg-white border border-gray-400 rounded-lg dark:border-gray-500 dark:bg-gray-700`}
      >
        <TouchableOpacity
          className={`${flexDirection()} items-center`}
          onPress={() =>
            navigation.navigate("Surah", { surahNumber: surah?.surahNumber })
          }
        >
          <View
            style={{ transform: [{ rotate: "45deg" }] }}
            className={`${flexDirection()} items-center justify-center ${
              getCurrentLanguage() === "ar" ? "ml-2.5" : "mr-2.5"
            } bg-gray-200 w-9 h-9 dark:bg-green-600`}
          >
            <Text
              style={{ transform: [{ rotate: "-45deg" }] }}
              className="font-semibold text-center text-gray-700 text-md dark:text-white"
            >
              {surah?.surahNumber}
            </Text>
          </View>
          <Text className="text-lg font-semibold text-gray-800 dark:text-white">
            {getName(surah?.surahInfo)}
          </Text>
        </TouchableOpacity>
        <View
          style={{ gap: 9 }}
          className={`${flexDirection()} items-center justify-center`}
        >
          {/* Audio Play Button */}
          <TouchableOpacity onPress={() => togglePlayback(surah)}>
            <Ionicons
              name={
                isCurrentlyPlaying()
                  ? "pause-circle-outline"
                  : "play-circle-outline"
              }
              size={30}
              color={isCurrentlyPlaying() ? "#22c55e" : iconColor}
              // color={"white"}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleBookmark}>
            <MaterialIcons
              name={isBookmarked ? "playlist-add-check" : "playlist-add"}
              size={30}
              color={isBookmarked ? "#22c55e" : iconColor}
            />
          </TouchableOpacity>

          {/* Download Button */}
          <TouchableOpacity onPress={handleDownload}>
            <Feather name="download" size={26} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>
      <SocialMediaShare
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </>
  );
};

export default SurahCard;
