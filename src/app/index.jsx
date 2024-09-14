import { useEffect, useState } from "react";
import { AudioPlayerProvider } from "../contexts/AudioPlayerContext";
import NoInternetScreen from "../screens/No-Internet";
import RootScreenContent from "../screens/root";
import NetInfo from "@react-native-community/netinfo";

function App() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  if (!isConnected) {
    return <NoInternetScreen />;
  }

  return (
    <AudioPlayerProvider>
      <RootScreenContent />
    </AudioPlayerProvider>
  );
}

export default App;
