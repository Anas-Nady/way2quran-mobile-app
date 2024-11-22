import TrackPlayer, { Capability } from "react-native-track-player";

export const setupTrackPlayer = async () => {
  try {
    const isInitialized = await TrackPlayer.isServiceRunning();
    if (!isInitialized) {
      await TrackPlayer.setupPlayer({
        autoHandleInterruptions: true,
      });
      console.log("Track Player is set up");
    }
    return true;
  } catch (error) {
    console.error("Error setting up Track Player:", error);
    return false;
  }
};

export default async function () {
  TrackPlayer.updateOptions({
    // Media controls capabilities
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop,
      Capability.SeekTo,
    ],

    // Capabilities that will show up when the notification is in the compact form on Android
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],

    // Notification color (Android)
    notificationColor: "#22c55e",

    // Media controls color on lock screen (iOS)
    accentColor: "#22c55e",
  });
}
