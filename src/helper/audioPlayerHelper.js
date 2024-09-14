export const playAudio = async (playbackObj, uri) => {
  try {
    return await playbackObj.loadAsync({ uri }, { shouldPlay: true });
  } catch (error) {
    console.log("Error in playAudio: ", error.message);
    throw error; // Re-throw the error so it can be caught in the calling function
  }
};

export const pauseAudio = async (playbackObject) => {
  try {
    return await playbackObject.setStatusAsync({
      shouldPlay: false,
    });
  } catch (error) {
    console.error("Error while playing sound: ", error.message);
  }
};

export const resumeAudio = async (playbackObject) => {
  try {
    return await playbackObject.playAsync();
  } catch (error) {
    console.error("Error while trying to resume audio: ", error.message);
  }
};

export const playNextAudio = async (playbackObject, uri) => {
  try {
    await playbackObject.stopAsync();
    await playbackObject.unloadAsync();
    return await playAudio(playbackObject, uri);
  } catch (error) {
    console.error("Error while trying to play next audio: ", error.message);
  }
};
