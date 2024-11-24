import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAudioPlayer } from "../../contexts/AudioPlayerContext.jsx";
import {
  isBookmarkExists,
  addBookmark,
  getBookmarkData,
} from "../../helpers/bookmarkHandlers.js";
import getName from "../../helpers/getName.js";
import { flexDirection } from "../../helpers/flexDirection.js";
import TrackPlayer, { State } from "react-native-track-player";
import { savePlayerState } from "../../helpers/playerStateStorage";

const SurahCardDetails = ({ surah, surahIndex, reciter, recitation }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigation = useNavigation();

  const { playerState, setPlayerState } = useAudioPlayer();

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

      const currentTrack = await TrackPlayer.getCurrentTrack();
      const playbackState = await TrackPlayer.getState();

      // If no track is loaded yet
      if (currentTrack === null) {
        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: surah.surahNumber.toString(),
          url: surah.url,
          title: `${notificationInfo.surahName}`,
          artist: notificationInfo.reciterName,
          artwork: reciter.photo,
          genre: "Quran",
        });
        await TrackPlayer.updateNowPlayingMetadata({
          artwork: reciter.photo,
        });

        await TrackPlayer.play();

        const updatedPlayerState = {
          ...playerState,
          playLoading: false,
          currentAudio: surah,
          isPlaying: true,
          isModalVisible: true,
          isAutoPlayEnabled: false,
          surahIndex,
          reciter,
          recitation,
        };

        setPlayerState(updatedPlayerState);
        await savePlayerState(updatedPlayerState);
        return;
      }

      // If this is the current track - handle play/pause
      if (currentTrack === surah.surahNumber.toString()) {
        const updatedPlayerState = {
          ...playerState,
          playLoading: false,
        };
        if (playbackState === State.Playing) {
          await TrackPlayer.pause();
          updatedPlayerState.isPlaying = false;
        } else {
          await TrackPlayer.play();
          updatedPlayerState.isPlaying = true;
        }

        await savePlayerState(updatedPlayerState);
        return;
      }

      // If switching to a different track
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: surah.surahNumber.toString(),
        url: surah.url,
        title: `${notificationInfo.surahName}`,
        artist: notificationInfo.reciterName,
        artwork: reciter.photo,
        genre: "Quran",
      });

      await TrackPlayer.updateNowPlayingMetadata({ artwork: reciter.photo });
      await TrackPlayer.play();

      const updatedPlayerState = {
        ...playerState,
        playLoading: false,
        currentAudio: surah,
        isPlaying: true,
        isModalVisible: true,
        isAutoPlayEnabled: false,
        surahIndex,
        reciter,
        recitation,
      };

      setPlayerState(updatedPlayerState);
      await savePlayerState(updatedPlayerState);
    } catch (error) {
      console.error("Error playing track:", error);
      const updatedState = { ...playerState, playLoading: false };
      setPlayerState(updatedState);
      await savePlayerState(updatedState);
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
      } else {
        updatedSurahs = [
          ...bookmarkData.surahs,
          {
            surahNumber: surah.surahNumber,
            surahInfo: surah.surahInfo,
            url: surah.url,
          },
        ];
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
    }
    setIsBookmarked(!isBookmarked);
  };

  return (
    <View
      className={`${flexDirection()} w-[95%] mx-auto relative items-center justify-between p-4 my-2 border rounded-lg border-gray-500 bg-gray-700`}
    >
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
  );
};

export default React.memo(SurahCardDetails);
