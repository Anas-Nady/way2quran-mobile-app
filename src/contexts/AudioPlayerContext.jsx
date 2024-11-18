import React, { createContext, useState, useContext } from "react";
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from "react-native-track-player";
import getName from "../helpers/getName";

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const [playerState, setPlayerState] = useState({
    audioFiles: [],
    currentAudio: null,
    isPlaying: false,
    surahIndex: -1,
    isModalVisible: false,
    isModalExpanded: false,
    isAutoPlayEnabled: false,
    reciter: null,
    recitation: null,
    modalHeight: 80,
    playLoading: false,
  });

  // Listen to remote control events
  useTrackPlayerEvents(
    [
      Event.RemotePlay,
      Event.RemotePause,
      Event.RemoteNext,
      Event.RemotePrevious,
      Event.RemoteStop,
      Event.RemoteSeek,
    ],
    async (event) => {
      switch (event.type) {
        case Event.RemotePlay:
          await TrackPlayer.play();
          setPlayerState((prev) => ({ ...prev, isPlaying: true }));
          break;

        case Event.RemotePause:
          await TrackPlayer.pause();
          setPlayerState((prev) => ({ ...prev, isPlaying: false }));
          break;

        case Event.RemoteStop:
          await TrackPlayer.reset();
          setPlayerState((prev) => ({
            ...prev,
            isPlaying: false,
            currentAudio: null,
            surahIndex: -1,
            isModalVisible: false,
          }));
          break;

        case Event.RemoteSeek:
          await TrackPlayer.seekTo(event.position);
          break;

        case Event.RemoteNext:
          if (
            playerState.surahIndex <
            playerState.recitation?.audioFiles.length - 1
          ) {
            const nextIdx = playerState.surahIndex + 1;
            const nextSurah = playerState?.recitation?.audioFiles[nextIdx];

            await TrackPlayer.reset();
            await TrackPlayer.add({
              id: nextSurah.surahNumber.toString(),
              url: nextSurah.url,
              title: getName(nextSurah.surahInfo),
              artist: getName(playerState.reciter),
              artwork: playerState.reciter.photo,
              genre: "Quran",
            });

            await TrackPlayer.play();
            setPlayerState((prev) => ({
              ...prev,
              currentAudio: nextSurah,
              isPlaying: true,
              surahIndex: nextIdx,
            }));
          }
          break;

        case Event.RemotePrevious:
          if (playerState.surahIndex > 0) {
            const prevIdx = playerState.surahIndex - 1;
            const prevSurah = playerState?.recitation?.audioFiles[prevIdx];

            await TrackPlayer.reset();
            await TrackPlayer.add({
              id: prevSurah.surahNumber.toString(),
              url: prevSurah.url,
              title: getName(prevSurah.surahInfo),
              artist: getName(playerState.reciter),
              artwork: playerState.reciter.photo,
              genre: "Quran",
            });

            await TrackPlayer.play();
            setPlayerState((prev) => ({
              ...prev,
              currentAudio: prevSurah,
              isPlaying: true,
              surahIndex: prevIdx,
            }));
          }
          break;
      }
    }
  );

  // Add PlaybackQueueEnded event listener
  useTrackPlayerEvents([Event.PlaybackQueueEnded], async (event) => {
    if (event.type === Event.PlaybackQueueEnded) {
      if (
        playerState.isAutoPlayEnabled &&
        playerState.surahIndex < playerState.recitation?.audioFiles.length - 1
      ) {
        const nextIdx = playerState.surahIndex + 1;
        const nextSurah = playerState.recitation.audioFiles[nextIdx];

        try {
          await TrackPlayer.reset();
          await TrackPlayer.add({
            id: nextSurah.surahNumber.toString(),
            url: nextSurah.url,
            title: getName(nextSurah.surahInfo),
            artist: getName(playerState.reciter),
            artwork: playerState.reciter.photo,
            genre: "Quran",
          });

          await TrackPlayer.play();

          setPlayerState((prev) => ({
            ...prev,
            currentAudio: nextSurah,
            isPlaying: true,
            surahIndex: nextIdx,
          }));
        } catch (error) {
          console.error("Error auto-playing next track:", error);
          setPlayerState((prev) => ({ ...prev, isPlaying: false }));
        }
      } else {
        setPlayerState((prev) => ({ ...prev, isPlaying: false }));
      }
    }
  });

  const toggleModalExpansion = () => {
    setPlayerState((prev) => ({
      ...prev,
      isModalExpanded: !prev.isModalExpanded,
      modalHeight: prev.isModalExpanded ? 165 : 80,
    }));
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        playerState,
        setPlayerState,
        toggleModalExpansion,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error(
      "useAudioPlayer must be used within an AudioPlayerProvider"
    );
  }
  return context;
};
