import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useAudioPlayer } from "../../contexts/AudioPlayerContext";
import {
  pauseAudio,
  playNextAudio,
  resumeAudio,
} from "../../helpers/audioPlayerHelper";
import formatTime from "../../helpers/formatTime";
import { useColorScheme } from "nativewind";
import getName from "../../helpers/getName";

const AudioPlayerModal = () => {
  const { playerState, setPlayerState, toggleModalExpansion } =
    useAudioPlayer();
  const [currentTime, setCurrentTime] = useState(0);
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "white" : "#4B5563";

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerState.playbackObject && playerState.isPlaying) {
        playerState.playbackObject.getStatusAsync().then((status) => {
          setCurrentTime(status.positionMillis / 1000);
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [playerState.playbackObject, playerState.isPlaying]);

  useEffect(() => {
    if (playerState.playbackObject) {
      const subscription = playerState.playbackObject.setOnPlaybackStatusUpdate(
        async (status) => {
          if (status.didJustFinish) {
            setCurrentTime(0);

            if (playerState.isAutoPlayEnabled) {
              const isLastSurah =
                playerState.surahIndex ===
                playerState.recitation.audioFiles.length - 1;
              if (isLastSurah) {
                // Stop playback if it's the last surah
                setPlayerState((prevState) => ({
                  ...prevState,
                  isPlaying: false,
                }));
              } else {
                await handleNextSurah();
              }
            } else {
              setPlayerState((prevState) => ({
                ...prevState,
                isPlaying: false,
              }));
            }
          }
        }
      );

      return () => {
        if (subscription) {
          subscription.remove();
        }
      };
    }
  }, [
    playerState.playbackObject,
    setPlayerState,
    playerState.isAutoPlayEnabled,
    playerState.surahIndex,
  ]);

  const togglePlayPause = async () => {
    try {
      if (playerState.isPlaying) {
        // Pause the audio if it's currently playing
        const status = await pauseAudio(playerState.playbackObject);
        setPlayerState((prevState) => ({
          ...prevState,
          isPlaying: false,
          soundObject: status,
        }));
        return;
      }

      let status;
      const hasFinished =
        currentTime === playerState.soundObject?.durationMillis / 1000;

      // Replay if the audio has finished or it's the first time playing
      if (currentTime === 0 || hasFinished) {
        setCurrentTime(0);
        status = await playerState.playbackObject.playFromPositionAsync(0); // Replay from start
      } else {
        // Resume from the current position if audio is paused but not finished
        status = await resumeAudio(playerState.playbackObject);
      }

      // Update state after play/resume
      setPlayerState((prevState) => ({
        ...prevState,
        isPlaying: true,
        soundObject: status,
      }));
    } catch (error) {
      console.error("Error handling audio playback:", error);
    }
  };

  const handleSeek = async (value) => {
    if (playerState.playbackObject) {
      await playerState.playbackObject.setPositionAsync(value * 1000);
      setCurrentTime(value);
    }
  };

  const handleNextSurah = async () => {
    if (playerState.surahIndex < playerState.recitation.audioFiles.length - 1) {
      setCurrentTime(0);
      const nextIdx = playerState.surahIndex + 1;
      const nextSurah = playerState?.recitation?.audioFiles[nextIdx];

      const status = await playNextAudio(
        playerState.playbackObject,
        nextSurah.url
      );

      setPlayerState((prevState) => ({
        ...prevState,
        currentAudio: nextSurah,
        isPlaying: true,
        surahIndex: nextIdx,
        soundObject: status,
      }));
    } else {
      // If it's the last surah, stop playback
      setPlayerState((prevState) => ({
        ...prevState,
        isPlaying: false,
      }));
    }
  };

  const handlePrevSurah = async () => {
    if (playerState.surahIndex > 0) {
      setCurrentTime(0);
      const prevIdx = playerState.surahIndex - 1;
      const prevSurah = playerState?.recitation?.audioFiles[prevIdx];
      await playNextAudio(playerState.playbackObject, prevSurah.url);
      setPlayerState((prevState) => ({
        ...prevState,
        currentAudio: prevSurah,
        isPlaying: true,
        surahIndex: prevIdx,
      }));
    }
  };

  if (!playerState.isModalVisible) return null;

  //

  const closeModal = async () => {
    // Stop playback if it's playing
    if (playerState.soundObject && playerState.isPlaying) {
      await playerState.playbackObject.stopAsync();
    }

    // Reset player state
    setPlayerState((prev) => ({
      ...prev,
      audioFiles: [],
      playbackObject: null,
      soundObject: null,
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

  return (
    <View
      className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 border-b-0 rounded-t-3xl ${
        playerState?.isModalExpanded ? "h-[165px] p-5" : "h-[80px] p-2"
      }`}
    >
      <TouchableOpacity
        className="absolute z-10 rounded-full top-2 left-3"
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

      {playerState?.isModalExpanded && (
        <TouchableOpacity
          className="absolute z-10 top-2 right-3"
          onPress={closeModal}
        >
          <AntDesign name="closecircleo" size={24} color={iconColor} />
        </TouchableOpacity>
      )}

      {playerState?.isModalExpanded ? (
        // Expanded view content
        <>
          <View className="flex-row-reverse items-center justify-end mr-6">
            <View className="flex-row-reverse items-center flex-1 gap-2">
              <Image
                source={{ uri: playerState.reciter?.photo }}
                className="rounded-full w-14 h-14"
              />
              <View className="flex-1">
                <Text className="text-[20px] font-bold text-gray-700 dark:text-gray-100 text-right">
                  {playerState.reciter?.arabicName}
                </Text>
                <Text className="text-gray-700 mt-1 text-[16px] dark:text-gray-100 text-right">
                  {playerState.currentAudio?.surahInfo?.arabicName} -{" "}
                  {playerState?.recitation?.recitationInfo?.arabicName}
                </Text>
              </View>
            </View>
          </View>

          <Slider
            style={{
              width: "100%",
              height: 25,
              marginVertical: 10,
              transform: [{ scaleX: -1 }],
            }}
            minimumValue={0}
            maximumValue={playerState.soundObject?.durationMillis / 1000 || 0}
            value={currentTime}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor="#22c55e"
            maximumTrackTintColor="#9ca3af"
            thumbTintColor="#22c55e"
          />

          <View className="flex-row-reverse items-center justify-between w-full">
            <Text className="text-sm text-gray-800 dark:text-white">
              {formatTime(currentTime)}
            </Text>
            <View className="flex-row-reverse items-center justify-center gap-2">
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
            <Text className="text-sm text-gray-800 dark:text-white">
              {formatTime(playerState.soundObject?.durationMillis / 1000 || 0)}
            </Text>
          </View>
        </>
      ) : (
        // Collapsed view content
        <View className="flex-row-reverse">
          <TouchableOpacity onPress={togglePlayPause} className="ml-4">
            <Ionicons
              name={playerState.isPlaying ? "pause-circle" : "play-circle"}
              size={33}
              color="#22c55e"
            />
          </TouchableOpacity>
          <View className="flex-row-reverse items-center">
            <Image
              source={{ uri: playerState.reciter?.photo }}
              className="w-12 h-12 rounded-full"
            />
            <View className="mr-3">
              <Text className="text-[16px] font-bold text-gray-700 dark:text-gray-100 text-right">
                {getName(playerState.reciter)}
              </Text>
              <Text className="text-gray-700 text-[14px] dark:text-gray-100 text-right">
                {getName(playerState.currentAudio?.surahInfo)}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default AudioPlayerModal;
