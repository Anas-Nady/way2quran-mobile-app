import React, { useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useAudioPlayer } from "../../contexts/AudioPlayerContext";
import formatTime from "../../helpers/formatTime";
import getName from "../../helpers/getName";
import { flexDirection } from "../../helpers/flexDirection";
import TrackPlayer, { State, useProgress } from "react-native-track-player";
import { useNavigation } from "@react-navigation/native";
import { APP_AR_NAME } from "../../constants/socialMedia";

// AudioPlayerModal component
const AudioPlayerModal = () => {
  const { playerState, setPlayerState, toggleModalExpansion } =
    useAudioPlayer();
  const { position, duration } = useProgress();
  const iconColor = "white";
  const navigation = useNavigation();

  // Toggle play/pause functionality
  const togglePlayPause = useCallback(async () => {
    try {
      const playerState = await TrackPlayer.getState();

      if (playerState === State.Playing) {
        await TrackPlayer.pause();
        setPlayerState((prev) => ({
          ...prev,
          isPlaying: false,
        }));
      } else {
        await TrackPlayer.play();
        setPlayerState((prev) => ({
          ...prev,
          isPlaying: true,
        }));
      }
    } catch (error) {
      console.error("Error handling playback:", error);
    }
  }, [setPlayerState]);

  // Handle seeking the audio
  const handleSeek = async (value) => {
    await TrackPlayer.seekTo(value);
  };

  // Handle playing the next surah
  const handleNextSurah = async () => {
    if (playerState.surahIndex < playerState.recitation.audioFiles.length - 1) {
      const nextIdx = playerState.surahIndex + 1;
      const nextSurah = playerState?.recitation?.audioFiles[nextIdx];

      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: nextSurah.surahNumber.toString(),
        url: nextSurah.url,
        title: `${APP_AR_NAME} | ${getName(nextSurah.surahInfo)}`,
        artist: getName(playerState.reciter),
        artwork: playerState.reciter.photo,
        genre: "Quran",
      });
      await TrackPlayer.updateNowPlayingMetadata({
        artwork: playerState.reciter.photo,
      });
      await TrackPlayer.play();

      setPlayerState((prev) => ({
        ...prev,
        currentAudio: nextSurah,
        isPlaying: true,
        surahIndex: nextIdx,
      }));
    }
  };

  // Handle playing the previous surah
  const handlePrevSurah = async () => {
    if (playerState.surahIndex > 0) {
      const prevIdx = playerState.surahIndex - 1;
      const prevSurah = playerState?.recitation?.audioFiles[prevIdx];

      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: prevSurah.surahNumber.toString(),
        url: prevSurah.url,
        title: `${APP_AR_NAME} | ${getName(nextSurah.surahInfo)}`,
        artist: getName(playerState.reciter),

        artwork: playerState.reciter.photo,
        genre: "Quran",
      });
      await TrackPlayer.updateNowPlayingMetadata({
        artwork: playerState.reciter.photo,
      });

      await TrackPlayer.play();

      setPlayerState((prev) => ({
        ...prev,
        currentAudio: prevSurah,
        isPlaying: true,
        surahIndex: prevIdx,
      }));
    }
  };

  // Close modal and stop playback
  const closeModal = async () => {
    await TrackPlayer.reset();
    setPlayerState((prev) => ({
      ...prev,
      audioFiles: [],
      currentAudio: null,
      isPlaying: false,
      surahIndex: -1,
      isModalVisible: false,
      isModalExpanded: true,
      isAutoPlayEnabled: false,
      reciter: null,
      recitation: null,
      modalHeight: 0,
    }));
  };

  if (!playerState.isModalVisible) return null;

  return (
    <View
      className={`bg-gray-800 border border-gray-500 border-b-0 rounded-t-3xl ${
        playerState?.isModalExpanded ? "h-[165px] p-5" : "h-[80px] p-2"
      }`}
    >
      {/* Modal Toggle Button */}
      <TouchableOpacity
        className={`absolute z-10 rounded-full top-2 left-3`}
        onPress={toggleModalExpansion}
      >
        <Feather
          name={
            playerState?.isModalExpanded
              ? "arrow-down-circle"
              : "arrow-up-circle"
          }
          size={26}
          color={iconColor}
        />
      </TouchableOpacity>

      {/* Close Modal Button */}
      <TouchableOpacity
        className={`absolute z-10 top-2 right-3`}
        onPress={closeModal}
      >
        <AntDesign name="closecircleo" size={24} color={iconColor} />
      </TouchableOpacity>

      {/* Expanded View */}
      {playerState?.isModalExpanded ? (
        // Expanded view content
        <>
          {/* Audio Details */}
          <View className={`${flexDirection()} items-center justify-end mx-4`}>
            <View className={`${flexDirection()} items-center flex-1 gap-2`}>
              <View className="flex-1">
                <Text
                  onPress={() =>
                    navigation.navigate("Reciter", {
                      reciterSlug: playerState.reciter?.slug,
                      recitationSlug:
                        playerState.recitation?.recitationInfo?.slug,
                    })
                  }
                  className={` text-[18px] text-center font-bold text-gray-100`}
                >
                  {getName(playerState.reciter)}
                </Text>
                <Text
                  numberOfLines={1}
                  className={`mt-1 text-[15px] text-center font-semibold text-gray-100`}
                >
                  {getName(playerState.currentAudio?.surahInfo)}
                </Text>
              </View>
            </View>
          </View>

          {/* Slider */}
          <Slider
            style={{
              width: "100%",
              height: 25,
              marginVertical: 10,
              transform: [{ scaleX: -1 }],
            }}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor="#22c55e"
            maximumTrackTintColor="#9ca3af"
            thumbTintColor="#22c55e"
          />

          {/* Playback Controls */}
          <View
            className={`${flexDirection()} items-center justify-between w-full`}
          >
            <Text className="text-sm text-white">{formatTime(position)}</Text>
            <View
              className={`${flexDirection()} items-center justify-center gap-2`}
            >
              <TouchableOpacity
                onPress={handlePrevSurah}
                disabled={playerState.surahIndex === 0}
              >
                <Ionicons
                  name="play-skip-forward"
                  size={24}
                  color={playerState.surahIndex === 0 ? "#9ca3af" : "#22c55e"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlayPause}>
                <Ionicons
                  name={playerState.isPlaying ? "pause-circle" : "play-circle"}
                  size={33}
                  color="#22c55e"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNextSurah}
                disabled={
                  playerState.surahIndex ===
                  playerState.recitation?.audioFiles.length - 1
                }
              >
                <Ionicons
                  name="play-skip-back"
                  size={24}
                  color={
                    playerState.surahIndex ===
                    playerState.recitation?.audioFiles.length - 1
                      ? "#9ca3af"
                      : "#22c55e"
                  }
                />
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-white">{formatTime(duration)}</Text>
          </View>
        </>
      ) : (
        // Collapsed view content
        <View className="px-7">
          <Slider
            style={{
              width: "100%",
              height: 25,
              marginVertical: 10,
              transform: [{ scaleX: -1 }],
            }}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor="#22c55e"
            maximumTrackTintColor="#9ca3af"
            thumbTintColor="#22c55e"
          />

          {/* Playback Controls */}
          <View
            className={`${flexDirection()} items-center justify-between w-full -mt-2 px-3`}
          >
            <Text className="text-sm text-white">{formatTime(position)}</Text>
            <View
              className={`${flexDirection()} items-center justify-center gap-2`}
            >
              <TouchableOpacity
                onPress={handlePrevSurah}
                disabled={playerState.surahIndex === 0}
              >
                <Ionicons
                  name="play-skip-forward"
                  size={24}
                  color={playerState.surahIndex === 0 ? "#9ca3af" : "#22c55e"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlayPause}>
                <Ionicons
                  name={playerState.isPlaying ? "pause-circle" : "play-circle"}
                  size={28}
                  color="#22c55e"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNextSurah}
                disabled={
                  playerState.surahIndex ===
                  playerState.recitation?.audioFiles.length - 1
                }
              >
                <Ionicons
                  name="play-skip-back"
                  size={24}
                  color={
                    playerState.surahIndex ===
                    playerState.recitation?.audioFiles.length - 1
                      ? "#9ca3af"
                      : "#22c55e"
                  }
                />
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-white">{formatTime(duration)}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default AudioPlayerModal;
