import { NavigationContainer } from "@react-navigation/native";
import { ScreenDimensionsProvider } from "../contexts/ScreenDimensionsProvider";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";
import { useCustomFonts } from "../services/font";
import Layout from "../components/Layout";

function RootScreenContent() {
  const { playerState } = useAudioPlayer();
  const { fontsLoaded, error } = useCustomFonts();

  if (!fontsLoaded && !error) return null;

  return (
    <NavigationContainer independent={true}>
      <ScreenDimensionsProvider>
        <Layout playerState={playerState} />
      </ScreenDimensionsProvider>
    </NavigationContainer>
  );
}

export default RootScreenContent;
