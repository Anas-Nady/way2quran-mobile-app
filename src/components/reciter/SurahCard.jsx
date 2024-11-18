import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
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
import TrackPlayer, { State } from "react-native-track-player";

const SurahCard = ({ surah, surahIndex, reciter, recitation }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [alert, setAlert] = useState(null);
  const translate = useTranslate("SurahCard");

  const navigation = useNavigation();

  const { playerState, setPlayerState } = useAudioPlayer();

  // download audio file
  const handleDownload = () => {
    Linking.openURL(surah?.downloadUrl);
  };

  const iconColor = "#fff";

  const togglePlayback = async (surah) => {
    setPlayerState((prev) => ({ ...prev, playLoading: true }));

    try {
      const notificationInfo = {
        reciterName: getName(reciter),
        surahName: getName(surah?.surahInfo),
      };

      // Check if this is the current track
      const currentTrack = await TrackPlayer.getCurrentTrack();
      const playerState = await TrackPlayer.getState();

      // If no track is loaded yet
      if (currentTrack === null) {
        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: surah.surahNumber.toString(),
          url: surah.url,
          title: notificationInfo.surahName,
          artist: notificationInfo.reciterName,
          artwork: reciter.photo,
          genre: "Quran",
        });

        await TrackPlayer.play();

        setPlayerState((prev) => ({
          ...prev,
          playLoading: false,
          currentAudio: surah,
          isPlaying: true,
          isModalVisible: true,
          isAutoPlayEnabled: false,
          surahIndex,
          reciter,
          recitation,
        }));
        return;
      }

      // If this is the current track - handle play/pause
      if (currentTrack === surah.surahNumber.toString()) {
        if (playerState === State.Playing) {
          await TrackPlayer.pause();
          setPlayerState((prev) => ({
            ...prev,
            playLoading: false,
            isPlaying: false,
          }));
        } else {
          await TrackPlayer.play();
          setPlayerState((prev) => ({
            ...prev,
            playLoading: false,
            isPlaying: true,
            isModalVisible: true,
          }));
        }
        return;
      }

      // If switching to a different track
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: surah.surahNumber.toString(),
        url: surah.url,
        title: notificationInfo.surahName,
        artist: notificationInfo.reciterName,
        artwork: reciter.photo,
        genre: "Quran",
      });

      await TrackPlayer.play();

      setPlayerState((prev) => ({
        ...prev,
        playLoading: false,
        currentAudio: surah,
        isPlaying: true,
        isModalVisible: true,
        isAutoPlayEnabled: false,
        surahIndex,
        reciter,
        recitation,
      }));
    } catch (error) {
      console.error("Error playing track:", error);
      setPlayerState((prev) => ({ ...prev, playLoading: false }));
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
      <View
        className={`${flexDirection()} relative items-center justify-between p-4 my-2 border rounded-lg border-gray-500 bg-gray-700`}
      >
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
        <TouchableOpacity
          className={`${flexDirection()} items-center`}
          onPress={() =>
            navigation.navigate("Surah", { surahNumber: surah?.surahNumber })
          }
        >
          <View
            style={{ transform: [{ rotate: "45deg" }] }}
            className={`${flexDirection()} items-center justify-center mx-2.5 w-9 h-9 bg-green-600`}
          >
            <Text
              style={{ transform: [{ rotate: "-45deg" }] }}
              className="font-semibold text-center text-white text-md"
            >
              {surah?.surahNumber}
            </Text>
          </View>
          <Text className="text-lg font-semibold text-white">
            {getName(surah?.surahInfo)}
          </Text>
        </TouchableOpacity>
        <View
          style={{ gap: 9 }}
          className={`${flexDirection()} items-center justify-center`}
        >
          {/* Audio Play Button */}
          <TouchableOpacity
            disabled={playerState.playLoading}
            onPress={() => togglePlayback(surah)}
          >
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
    </>
  );
};

export default SurahCard;
