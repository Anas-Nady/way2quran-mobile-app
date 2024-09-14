import React, { createContext, useState, useContext } from "react";

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const [playerState, setPlayerState] = useState({
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
    modalHeight: 80,
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
