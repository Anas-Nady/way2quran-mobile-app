// import { useEffect } from "react";
import { AudioPlayerProvider } from "../contexts/AudioPlayerContext";
import RootScreenContent from "../screens/root";
// import { registerBackgroundNextPrayerTask } from "../services/backgroundTasks";

function App() {
  // useEffect(() => {
  //   // Register background task
  //   const setupBackgroundTask = async () => {
  //     try {
  //       await registerBackgroundNextPrayerTask();
  //     } catch (err) {
  //       console.error("Failed to setup background task:", err);
  //     }
  //   };
  //   setupBackgroundTask();
  // }, []);

  return (
    <AudioPlayerProvider>
      <RootScreenContent />
    </AudioPlayerProvider>
  );
}

export default App;
